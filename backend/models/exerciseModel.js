import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    exercise: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    rest: {
      type: Number,
      required: true,
    },
    comments: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // these are pushed to the Sesh exercises: array
  }
);

const Workout = mongoose.model("Exercise", exerciseSchema);

export default Workout;
