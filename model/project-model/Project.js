import mongoose from "mongoose";

const Project = new mongoose.Schema({
    nameProject: { type: String, required: true, },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, },
    kanbanTasks: [{ type: mongoose.Schema.ObjectId, ref: "TasksColumn", }, ],
});


export default mongoose.model('Project', Project);