import express from "express";
import { protect } from "../utils/protect.js";
import {
  getAllSeshes,
  createSesh,
  addExerciseToSesh,
  deleteSesh,
  deleteExerciseFromSesh,
  editExerciseInSesh,
  getSeshById,
  renameSesh,
} from "../controllers/seshController.js";

const router = express.Router();

// GET all seshes / CREATE a sesh
router.route("/").get(protect, getAllSeshes).post(protect, createSesh);

// GET a single sesh by ID
router
  .route("/:id")
  .get(protect, getSeshById)
  .delete(protect, deleteSesh)
  .patch(protect, renameSesh);

// Add / Delete exercises in a sesh
router
  .route("/:seshId/exercises")
  .post(protect, addExerciseToSesh)
  .delete(protect, deleteExerciseFromSesh);

// Edit a specific exercise in a sesh
router.route("/:seshId/exercises/:exerciseId").put(protect, editExerciseInSesh);

export default router;
