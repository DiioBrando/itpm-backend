import mongoose from "mongoose";

const Project = new mongoose.Schema({
    nameProject: { type: String, required: true, },
    timestamp: { type: String, required: true, default: Date.now },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, },
    kanbanTasks: [{ type: mongoose.Types.ObjectId, ref: "TasksColumn", }, ],
    subscribers: [{ type: mongoose.Types.ObjectId, ref: "User", }, ],
});


export default mongoose.model('Project', Project);