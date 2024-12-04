import ApiError from "../exceptions/ApiError.js";
import TasksColumn from "../model/kanban-model/TasksColumn.js";
import User from "../model/users-model/User.js";
import Task from "../model/kanban-model/Task.js";
import Project from "../model/project-model/Project.js";


class TasksColumnService {
    async addTasksColumn(nameTasksColumn, typeTasksColumn, idUser, projectId) {
        const findUser = await User.findOne({ _id: idUser });
        if (!findUser) {
            throw ApiError.BadRequest('');
        }

        if (!nameTasksColumn || nameTasksColumn.length === 0) {
            throw ApiError.BadRequest('');
        }

        const project = await Project.findOne({ _id: projectId, userId: idUser });
        console.log(project);
        if (!project) {
            throw ApiError.BadRequest('');
        }

        const newTasksColumn = await TasksColumn.create({
            nameTasksColumn: nameTasksColumn,
            typeColumn: typeTasksColumn,
        });

        project.kanbanTasks.push(newTasksColumn._id);
        await project.save();

        return newTasksColumn;
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

        const ids = Array.isArray(idArray) ? idArray : idArray.split(',');
        const findArray = await TasksColumn.find({ _id: {$in: ids }});

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

        const deleteArray = await TasksColumn.deleteMany({_id: {$in: idArray.split(',')}});
        if (!deleteArray) {
            throw ApiError.BadRequest();
        }

        return deleteArray;
    }

    async updateTasksColumn(_id, idUser, name){
        if (name.length === 0) {
            throw ApiError.BadRequest();
        }

        const findUser = await User.findOne({_id: idUser});
        if (!findUser) {
            throw ApiError.BadRequest();
        }

        const findTask = await TasksColumn.findOne({_id: _id});

        if (!findTask) {
            throw ApiError.BadRequest();
        }


        const update = TasksColumn.findOneAndUpdate({_id: findTask._id}, { nameTasksColumn: name  }, {new: true});
        return update;
    }
}

export default new TasksColumnService();