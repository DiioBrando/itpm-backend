import mongoose from 'mongoose';
import CryptoInfo from '../../helpers/cryptoInfo.js';

const Task = new mongoose.Schema({
    idTasksColumn: { type: mongoose.Schema.Types.ObjectId, ref: "TasksColumn", required: true, },
    nameTask: { type: String, required: true,
        set: (nameTask) => {
            const { encryptedData, iv } = CryptoInfo.encrypt(nameTask);
            return JSON.stringify({ encryptedData, iv });
        },
        get: (value) => {
            if (!value) return value;
            const { encryptedData, iv } = JSON.parse(value);
            return CryptoInfo.decrypt(encryptedData, iv);
        },
    },
    description: { type: String, required: false, default: '',
        set: (description) => {
            const { encryptedData, iv } = CryptoInfo.encrypt(description);
            return JSON.stringify({ encryptedData, iv });
        },
        get: (value) => {
            if (!value) return value;
            const { encryptedData, iv } = JSON.parse(value);
            return CryptoInfo.decrypt(encryptedData, iv);
        },
    },
    changed: { type: Boolean, default: false, },

    timestamp: { type: String, required: true, default: Date.now },
    startDate: { type: String, required: false },
});

Task.set('toJSON', { getters: true });
Task.set('toObject', { getters: true });


export default mongoose.model('Task', Task);