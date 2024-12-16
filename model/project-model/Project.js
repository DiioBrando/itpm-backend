import mongoose from "mongoose";
import TasksColumn from "../kanban-model/TasksColumn.js";
import CryptoInfo from "../../helpers/cryptoInfo.js";

const Project = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    nameProject: { type: String, required: true},

    budgetProject: { type: String, required: true,
        set: (budgetProject) => {
            const { encryptedData, iv } = CryptoInfo.encrypt(budgetProject);
            return JSON.stringify({ encryptedData, iv });
        },
        get: (value) => {
            if (!value) return value;
            const { encryptedData, iv } = JSON.parse(value);
            return CryptoInfo.decrypt(encryptedData, iv);
        },
    },
    descriptionProject: { type: String, default: '',
        set: (descriptionProject) => {
            const { encryptedData, iv } = CryptoInfo.encrypt(descriptionProject);
            return JSON.stringify({ encryptedData, iv });
        },
        get: (value) => {
            if (!value) return value;
            const { encryptedData, iv } = JSON.parse(value);
            return CryptoInfo.decrypt(encryptedData, iv);
        },
    },
    dateProject: { type: String, required: true },

    timestamp: { type: String, required: true, default: Date.now },
    kanbanTasks: [{ type: mongoose.Schema.Types.ObjectId , ref: "TasksColumn", default: [] }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    statusProject: { type: String, required: true, default: 'in-work',
        set: (statusProject) => {
            const { encryptedData, iv } = CryptoInfo.encrypt(statusProject);
            return JSON.stringify({ encryptedData, iv });
        },
        get: (value) => {
            if (!value) return value;
            const { encryptedData, iv } = JSON.parse(value);
            return CryptoInfo.decrypt(encryptedData, iv);
        },
    },
});

Project.set('toJSON', { getters: true });
Project.set('toObject', { getters: true });

export default mongoose.model('Project', Project);