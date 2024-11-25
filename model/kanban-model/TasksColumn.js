import mongoose from "mongoose";

const TasksColumn = new mongoose.Schema({
    nameTasksColumn: { type: String, required: true, },
    tasks: [ { type: mongoose.Types.ObjectId, ref: "Task", }, ],
});

export default mongoose.model("TasksColumn", TasksColumn);