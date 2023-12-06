import express from "express";
import {
    countByTitle,
    createTask,
    deleteTask,
    getTask,
    getTasks,
    updateTask,
} from "../controllers/task.js";
import Task from "../models/Task.js";
const router = express.Router();

//?CREATE
router.post("/", createTask);

//?UPDATE
router.put("/:id", updateTask);

//?DELETE
router.delete("/:id", deleteTask);

//?GET
router.get("/find/:id", getTask);

//?GET ALL
router.get("/", getTasks);
router.get("/countByTitle", countByTitle);


export default router;