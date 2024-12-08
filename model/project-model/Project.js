import mongoose from "mongoose";
import TasksColumn from "../kanban-model/TasksColumn.js";

const Project = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    nameProject: { type: String, required: true, },

    budgetProject: { type: String, required: true },
    descriptionProject: { type: String, default: '', },
    dateProject: { type: String, required: true },

    timestamp: { type: String, required: true, default: Date.now },
    kanbanTasks: [{ type: mongoose.Schema.Types.ObjectId , ref: "TasksColumn", default: [] }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
});


export default mongoose.model('Project', Project);