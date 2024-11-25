import ApiError from "../exceptions/ApiError.js";
import TasksColumn from "../model/kanban-model/TasksColumn.js";
import User from "../model/users-model/User.js";
import Task from "../model/kanban-model/Task.js";

class TasksColumnService {
    async addTasksColumn(nameTask, idColumnTasks, _id, description = '') {
        const findUser = await User.findOne({ _id: _id });

        if(!findUser) {
            throw ApiError.BadRequest();
        }

        if(nameTask.length === 0) {
            throw ApiError.BadRequest();
        }

        const findIdColumn = await TasksColumn.findOne({ _id: idColumnTasks });

        if(!findIdColumn) {
            return ApiError.BadRequest();
        }

        const addColumn = await Task.create({ idTasksColumn: findIdColumn.idColumnTasks, nameTask: nameTask, description: description, });
        return addColumn;
    }
    async deleteTasksColumn() {

    }
    async updateTasksColumn() {

    }
    async getAllTasksColumn() {

    }
}

export default new TasksColumnService();