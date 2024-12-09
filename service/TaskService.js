import ApiError from "../exceptions/ApiError.js";
import User from "../model/users-model/User.js";
import Task from "../model/kanban-model/Task.js";
import TasksColumn from "../model/kanban-model/TasksColumn.js";

class TaskService {
    async addTask(idTasksColumn, name, idUser, expirationDate, description) {
        if (!name || name.trim().length === 0) {
            throw ApiError.BadRequest('Task name is required!');
        }

        const user = await User.findById(idUser);
        if (!user) {
            throw ApiError.BadRequest('User not found!');
        }

        const create = await Task.create({
            nameTask: name,
            idTasksColumn: idTasksColumn,
            expirationDate: expirationDate || '',
            description: description,
        });

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
        await TasksColumn.findOneAndUpdate(
            { _id: idTasksColumn },
            { $pull: { tasks: _id } },
            { new: true }
        );
        return delTask;
    }


    async updateTask(_id, description, nameTask, idTasksColumn, idUser) {
        if (nameTask.length === 0) {
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


        const update = await Task.findOneAndUpdate(
            { _id: findTask._id },
            { nameTask: nameTask, description: description, idTasksColumn: idTasksColumn, changed: true, },
            { new: true }
        );

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

        idArray = idArray.split(',')

        if (idArray.length === 0) {
            throw ApiError.BadRequest();
        }

        const findUser = await User.findOne({_id: idUser});
        if (!findUser) {
            throw ApiError.BadRequest();
        }

        const findArray = await Task.find({ _id: {$in: idArray } });
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

        const deleteArray = await Task.deleteMany({_id: {$in: idArray.split(',')}});
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

    async updateTaskDeadline(_id, expirationDate, idUser) {
        const user = await User.findOne({ _id: idUser });
        if (!user) {
            throw ApiError.BadRequest('User not found!');
        }

        const task = await Task.findOne({ _id });
        if (!task) {
            throw ApiError.BadRequest('Task not found!');
        }

        if (!expirationDate) {
            throw ApiError.BadRequest('Expiration date is required!');
        }

        task.expirationDate = expirationDate;
        await task.save();

        return task;
    }

    async moveTask(_id, idColumn) {

        const findTask = await Task.findOne({ _id: _id });
        if (!findTask) {
            throw ApiError.BadRequest('');
        }


        const findTasksColumn = await TasksColumn.findOne({ _id: idColumn });
        if (!findTasksColumn) {
            throw ApiError.BadRequest('');
        }


        const oldTasksColumn = await TasksColumn.findOne({ _id: findTask.idTasksColumn });
        if (oldTasksColumn) {

            oldTasksColumn.tasks = oldTasksColumn.tasks.filter(
                (taskId) => taskId.toString() !== _id.toString()
            );
            await oldTasksColumn.save();
        }


        findTasksColumn.tasks.push(_id);
        await findTasksColumn.save();


        findTask.idTasksColumn = idColumn;
        await findTask.save();

        return findTask;
    }


}


export default new TaskService();