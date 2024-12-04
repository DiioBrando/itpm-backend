import mongoose from 'mongoose';
import Comments from "../Comment.js";



const Task = new mongoose.Schema({
    idTasksColumn: { type: mongoose.Schema.Types.ObjectId, ref: "TasksColumn", required: true, },
    nameTask: { type: String, required: true, },
    description: { type: String, required: false, default: '', },
    changed: { type: Boolean, default: false, },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments", default: [], }],
    timestamp: { type: String, required: true, default: Date.now },
    expirationDate: { type: Date, required: false },
});


export default mongoose.model('Task', Task);