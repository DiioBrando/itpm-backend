import mongoose from 'mongoose';


const Task = new mongoose.Schema({
    idTasksColumn: { type: mongoose.Types.ObjectId, ref: "TasksColumn", required: true, },
    nameTask: { type: String, required: true, },
    changed: { type: Boolean, default: false, },
    comments: [ { type: mongoose.Types.ObjectId, ref: "Comments", required: true, }, ],
    timestamp: { type: String, required: true, },
});


export default mongoose.model('Task', Task);