import TaskService from "../service/TaskService.js";

class TaskController {
    async addTask(req, res, next) {
        try {
            const {
                _id,
                name,
                expirationDate,
                description
            } = req.body;
            const user = req.user;

            const task = await TaskService.addTask(_id, name, user.id, expirationDate, description);
            return res.json({ message: 'Task added successfully', task });
        } catch (e) {
            next(e);
        }
    }

    async deleteTask(req, res, next) {
        try {
            const _id = req.params.id;
            const idColumn = req.params.idColumn

            const user = req.user;
            const delTask = await TaskService.deleteTask(_id, idColumn, user.id);
            return res.json({message: 'success delete'});
        } catch (e) {
            next(e);
        }
    }

    async updateTask(req, res, next) {
        try {
            const { description, name, idTasksColumn } = req.body;
            const _id = req.params.id;
            const user = req.user;
            const updTask = await TaskService.updateTask(_id, description, name, idTasksColumn, user.id);
            return res.json({message: 'success update'});
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            const allTask = await TaskService.getAll();
            return res.json({ message: 'success find', allTask });
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const { _id } = req.body;
            const user = req.user;
            const oneTask = await TaskService.getOne(_id, user.id);
            return res.json({message: 'success find'});
        } catch (e) {
            next(e);
        }
    }

    async getMany(req, res, next) {
        try {
            const idArray = req.query.id;
            const user = req.user;
            const manyTask = await TaskService.getMany(idArray, user.id);
            return res.json(manyTask);
        } catch (e) {
            next(e);
        }
    }

    async deleteMany(req, res, next) {
        try {
            const idArray = req.query.id;
            const user = req.user;
            const manyTask = await TaskService.deleteMany(idArray, user.id);
            return res.json({message: 'success delete'});
        } catch (e) {
            next(e);
        }
    }

    async updateTaskDeadline(req, res, next) {
        try {
            const { id } = req.params;
            const { expirationDate } = req.body;
            const user = req.user;

            const updatedTask = await TaskService.updateTaskDeadline(id, expirationDate, user.id);
            return res.json({ message: 'Deadline updated successfully', updatedTask });
        } catch (e) {
            next(e);
        }
    }
}


export default new TaskController();