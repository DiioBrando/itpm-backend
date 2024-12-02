import mongoose from 'mongoose';
import Comments from "../Comments.js";



const Task = new mongoose.Schema({
    idTasksColumn: { type: mongoose.Schema.Types.ObjectId, ref: "TasksColumn", required: true, },
    nameTask: { type: String, required: true, },
    description: { type: String, required: false, },
    changed: { type: Boolean, default: false, },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments", default: [], }],
    timestamp: { type: String, required: true, default: Date.now },
});


export default mongoose.model('Task', Task);