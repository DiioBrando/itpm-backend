import mongoose from "mongoose";

const TasksColumn = new mongoose.Schema({
    nameTasksColumn: { type: String, required: true, },
    timestamp: { type: String, default: Date.now },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task", default: [], }],
    typeColumn: { type: String, required: true, },
});

export default mongoose.model("TasksColumn", TasksColumn);