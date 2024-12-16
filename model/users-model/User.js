import mongoose from 'mongoose';
import CryptoInfo from "../../helpers/cryptoInfo.js";

const User = new mongoose.Schema({
    login: { type: String, required: true, unique: true, trim: true,
        set: (login) => {
            const { encryptedData, iv } = CryptoInfo.encrypt(login);
            return JSON.stringify({ encryptedData, iv });
        },
        get: (value) => {
            if (!value) return value;
            const { encryptedData, iv } = JSON.parse(value);
            return CryptoInfo.decrypt(encryptedData, iv);
        },
    },
    email: { type: String, required: true, unique: true, trim: true, },
    password: { type: String, required: true, },
    roles: [{ type: String, ref: "Role", }],
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project", default: []}, ],
    subProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project", default: []},  ],
});

User.set('toJSON', { getters: true });
User.set('toObject', { getters: true });

export default mongoose.model("User", User);