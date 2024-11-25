import mongoose from 'mongoose';

const User = new mongoose.Schema({
    login: { type: String, required: true, unique: true, trim: true, },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, },
    roles: [{ type: String, ref: "Role", }],
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
});

export default mongoose.model("User", User);