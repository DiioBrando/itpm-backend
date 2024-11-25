import ApiError from "../exceptions/ApiError.js";
import User from "../model/users-model/User.js";
import Task from "../model/kanban-model/Task.js";
import TasksColumn from "../model/kanban-model/TasksColumn.js";

class TaskService {
    async addTask(idTasksColumn, name, idUser) {
        if (name.length === 0) {
            throw ApiError.BadRequest('Please set name project!');
        }
        const user = await User.findOne({_id: idUser});
        if (!user) {
            throw ApiError.BadRequest('not found user');
        }

        const create = await Task.create({ nameTask: name, idTasksColumn: idTasksColumn});
        await TasksColumn.findByIdAndUpdate(
            idTasksColumn,
            { $push: { tasks: create._id } },
            { new: true }
        );
        return create;
    }

    async deleteTask(_id, idTasksColumn, idUser) {
        const findUser = await User.findOne({_id: idUser});
        if (!findUser) {
            throw ApiError.BadRequest();
        }

        const findTask = await Task.findOne({_id: _id});

        if (!findTask) {
            throw ApiError.BadRequest();
        }

        const delTask = await Task.deleteOne({_id: findTask._id});
        await TasksColumn.findOneAndDelete(
            idTasksColumn,
            { $pull: { tasks: delTask._id } },
            { new: true }
        );
        return delTask;
    }

    async updateTask(_id, description, nameProject, idUser) {
        if (nameProject.length === 0) {
            throw ApiError.BadRequest();
        }

        const findUser = await User.findOne({_id: idUser});
        if (!findUser) {
            throw ApiError.BadRequest();
        }

        const findTask = await Task.findOne({_id: _id});

        if (!findTask) {
            throw ApiError.BadRequest();
        }

        const update = Task.findOneAndUpdate({_id: findTask._id}, { nameProject: nameProject, description: description, }, {new: true});
        return update;
    }
    async getOne(_id, idUser) {

        const findUser = await User.findOne({_id: idUser});
        if (!findUser) {
            throw ApiError.BadRequest();
        }

        const findTask = await Task.findOne({_id: _id});

        if (!findTask) {
            throw ApiError.BadRequest();
        }

        return findTask;
    }
    async getAll() {
        const findAllProjects = await Task.find();
        if (!findAllProjects) {
            throw ApiError.BadRequest();
        }

        return findAllProjects;
    }
    async getMany(idArray, idUser) {
        if (idArray.length === 0) {
            throw ApiError.BadRequest();
        }

        const findUser = await User.findOne({_id: idUser});
        if (!findUser) {
            throw ApiError.BadRequest();
        }

        const findArray = await Task.find({_id: {$in: idArray}});
        if (!findArray) {
            throw ApiError.BadRequest();
        }

        return findArray;
    }
    async deleteMany(idArray, idTasksColumn, idUser) {
        if (idArray.length === 0) {
            throw ApiError.BadRequest();
        }

        const findUser = await User.findOne({_id: idUser});
        if (!findUser) {
            throw ApiError.BadRequest();
        }

        const deleteArray = await Task.deleteMany({_id: {$in: idArray}});
        if (!deleteArray) {
            throw ApiError.BadRequest();
        }
        await TasksColumn.findOneAndUpdate(
            { _id: idTasksColumn },
            { $pull: { tasks: { $in: idArray } } },
            { new: true }
        );
        return deleteArray;
    }
}


export default new TaskService();