import ApiError from "../exceptions/ApiError.js";
import TasksColumn from "../model/kanban-model/TasksColumn.js";
import User from "../model/users-model/User.js";


class TasksColumnService {
    async addTasksColumn(nameTasksColumn, idUser) {
        const findUser = await User.findOne({ _id: idUser });

        if(!findUser) {
            throw ApiError.BadRequest();
        }

        if(nameTasksColumn.length === 0) {
            throw ApiError.BadRequest();
        }

        const addTasksColumn = await TasksColumn.create({ nameTasksColumn: nameTasksColumn });
        return addTasksColumn;
    }
    async getOne(_id, idUser) {

        const findUser = await User.findOne({_id: idUser});
        if (!findUser) {
            throw ApiError.BadRequest();
        }

        const findTasksColumn = await TasksColumn.findOne({_id: _id});

        if (!findTasksColumn) {
            throw ApiError.BadRequest();
        }

        return findTasksColumn;
    }

    async getAll() {
        const findAllTasksColumn = await TasksColumn.find();
        if (!findAllTasksColumn) {
            throw ApiError.BadRequest();
        }

        return findAllTasksColumn;
    }

    async deleteTasksColumn(_id, idUser) {
        const findUser = await User.findOne({ _id: idUser });
        if(!findUser) {
            throw ApiError.BadRequest();
        }

        const findTasksColumn = await TasksColumn.findOne({ _id: _id });

        if(!findTasksColumn) {
            throw ApiError.BadRequest();
        }

        const delTasksColumn = await TasksColumn.deleteOne({ _id: findTasksColumn._id });
        return delTasksColumn;
    }
    async getMany(idArray, idUser) {
        if (idArray.length === 0) {
            throw ApiError.BadRequest();
        }

        const findUser = await User.findOne({_id: idUser});
        if (!findUser) {
            throw ApiError.BadRequest();
        }

        const findArray = await TasksColumn.find({_id: {$in: idArray}});
        if (!findArray) {
            throw ApiError.BadRequest();
        }

        return findArray;
    }

    async deleteMany(idArray, idUser) {
        if (idArray.length === 0) {
            throw ApiError.BadRequest();
        }

        const findUser = await User.findOne({_id: idUser});
        if (!findUser) {
            throw ApiError.BadRequest();
        }

        const deleteArray = await TasksColumn.deleteMany({_id: {$in: idArray}});
        if (!deleteArray) {
            throw ApiError.BadRequest();
        }

        return deleteArray;
    }
}

export default new TasksColumnService();