import Sesh from "../models/seshModel.js";
import Exercise from "../models/exerciseModel.js";

/**
 * Creates an Exercise document and appends its reference to the parent Session.
 */
const addExerciseToSesh = async (req, res) => {
  try {
    const { seshId } = req.params;
    const exerciseData = req.body;

    // Validate parent existence before performing writes
    const sesh = await Sesh.findById(seshId);
    if (!sesh) return res.status(404).json({ message: "Sesh not found" });

    // Persist child document
    const newExercise = new Exercise(exerciseData);
    const savedExercise = await newExercise.save();

    // Update parent reference array
    sesh.exercises.push(savedExercise._id);
    await sesh.save();

    // Return hydrated session to sync frontend state
    const updatedSesh = await Sesh.findById(seshId).populate("exercises");
    res.status(201).json(updatedSesh);
  } catch (err) {
    console.error(`[Controller Error] addExerciseToSesh: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Performs a manual cascade delete of the Session and all associated Exercises.
 */
const deleteSesh = async (req, res) => {
  try {
    // Multi-tenancy check: Ensure user owns the resource being deleted
    const sesh = await Sesh.findOne({ _id: req.params.id, user: req.user._id });
    if (!sesh)
      return res
        .status(404)
        .json({ message: "Sesh not found or unauthorized" });

    // Clean up Exercise documents to prevent orphaned records in the database
    await Exercise.deleteMany({ _id: { $in: sesh.exercises } });

    // Finalize deletion of the parent document
    await sesh.deleteOne();

    res
      .status(200)
      .json({ message: "Sesh and exercises deleted successfully" });
  } catch (err) {
    console.error(`[Controller Error] deleteSesh: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Decouples an exercise from a session and removes the Exercise document.
 */
const deleteExerciseFromSesh = async (req, res) => {
  try {
    const { seshId } = req.params;
    const { _id: exerciseId } = req.body;

    const sesh = await Sesh.findById(seshId);
    if (!sesh) return res.status(404).json({ message: "Sesh not found" });

    // Filter reference from parent array (In-memory)
    sesh.exercises = sesh.exercises.filter(
      (id) => id.toString() !== exerciseId
    );
    await sesh.save();

    // Physical deletion of child document
    await Exercise.findByIdAndDelete(exerciseId);

    const updatedSesh = await Sesh.findById(seshId).populate("exercises");
    res.status(200).json(updatedSesh);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Returns all sessions for the authenticated user with optional date-range filtering.
 */
const getAllSeshes = async (req, res) => {
  try {
    // Strictly scope query to the authenticated user context
    const query = { user: req.user._id };

    // Apply temporal filtering if date query parameter is present
    if (req.query.date) {
      const parsedDate = new Date(req.query.date);

      if (!isNaN(parsedDate.getTime())) {
        // Define a 24-hour window for the targeted date
        const start = new Date(parsedDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(parsedDate);
        end.setHours(23, 59, 59, 999);

        query.date = { $gte: start, $lte: end };
      }
    }

    const seshes = await Sesh.find(query)
      .sort({ date: -1 }) // Default to descending chronological order
      .populate("exercises");

    res.status(200).json(seshes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Initializes a new session record.
 */
const createSesh = async (req, res) => {
  try {
    const { title, date } = req.body;

    // Explicit property mapping to prevent over-posting vulnerabilities
    const newSesh = new Sesh({
      title,
      date,
      user: req.user._id,
    });

    const savedSesh = await newSesh.save();
    res.status(201).json(savedSesh);
  } catch (error) {
    res.status(400).json({ message: "Validation error: " + error.message });
  }
};

/**
 * Updates an exercise document and re-hydrates the parent session.
 */
const editExerciseInSesh = async (req, res) => {
  try {
    const { seshId, exerciseId } = req.params;
    const exerciseData = req.body;

    // Use { new: true } to return the post-update state; runValidators ensures schema compliance
    const updatedExercise = await Exercise.findByIdAndUpdate(
      exerciseId,
      exerciseData,
      { new: true, runValidators: true }
    );

    if (!updatedExercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    const updatedSesh = await Sesh.findById(seshId).populate("exercises");
    res.status(200).json(updatedSesh);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates session metadata after verifying ownership.
 */
const renameSesh = async (req, res) => {
  try {
    const sesh = await Sesh.findById(req.params.id);
    if (!sesh) return res.status(404).json({ message: "Sesh not found" });

    // Authorization: Restrict update to the record owner
    if (sesh.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not own this session" });
    }

    const { title } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ message: "Valid title is required" });
    }

    sesh.title = title.trim();
    const updatedSesh = await sesh.save();

    res.status(200).json(updatedSesh);
  } catch (err) {
    res.status(500).json({ message: "Failed to update session" });
  }
};

const getSeshById = async (req, res) => {
  try {
    // Explicit ownership check during retrieval
    const sesh = await Sesh.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("exercises");

    if (!sesh) return res.status(404).json({ message: "Session not found" });
    res.status(200).json(sesh);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllSeshes,
  createSesh,
  addExerciseToSesh,
  deleteSesh,
  deleteExerciseFromSesh,
  getSeshById,
  editExerciseInSesh,
  renameSesh,
};
