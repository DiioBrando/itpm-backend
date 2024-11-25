import mongoose from 'mongoose';


const Comments = new mongoose.Schema({
    idUser: { type: mongoose.Types.ObjectId, ref: "User", required: true, },
    timestamp: { type: String, required: true, },
    comment: { type: String, required: true, },
});

export default mongoose.model("Comments", Comments)