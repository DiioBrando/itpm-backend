import mongoose from 'mongoose';


const Task = new mongoose.Schema({
    idTasksColumn: { type: mongoose.Types.ObjectId, ref: "TasksColumn", required: true, },
    nameTask: { type: String, required: true, },
    description: { type: String, required: false, },
    changed: { type: Boolean, default: false, },
    comments: [ { type: mongoose.Types.ObjectId, ref: "Comments", }, ],
    timestamp: { type: String, required: true, default: Date.now },
});


export default mongoose.model('Task', Task);