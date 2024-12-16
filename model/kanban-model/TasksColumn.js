import mongoose from "mongoose";
import CryptoInfo from "../../helpers/cryptoInfo.js";

const TasksColumn = new mongoose.Schema({
    nameTasksColumn: { type: String, required: true,},
    timestamp: { type: String, default: Date.now },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task", default: [], }],
    typeColumn: { type: String, required: true,
        set: (typeColumn) => {
            const { encryptedData, iv } = CryptoInfo.encrypt(typeColumn);
            return JSON.stringify({ encryptedData, iv });
        },
        get: (value) => {
            if (!value) return value;
            const { encryptedData, iv } = JSON.parse(value);
            return CryptoInfo.decrypt(encryptedData, iv);
        },
    },
});

TasksColumn.set('toJSON', { getters: true });
TasksColumn.set('toObject', { getters: true });
export default mongoose.model("TasksColumn", TasksColumn);