import TaskService from "../service/TaskService.js";

class TaskController {
    async addTask(req, res, next) {
        try {
            const {
                id,
                name,
            } = req.body;
            const user = req.user;
            const task = await TaskService.addTask(id, name, user.id);
            return res.json({message: 'success add'});
        } catch (e) {
            next(e);
        }
    }

    async deleteTask(req, res, next) {
        try {
            const { id, idColumn } = req.params;
            const user = req.user;
            const delTask = await TaskService.deleteTask(id, idColumn, user.id);
            return res.json({message: 'success delete'});
        } catch (e) {
            next(e);
        }
    }

    async updateTask(req, res, next) {
        try {
            const { _id, description, name } = req.body;
            const user = req.user;
            const updTask = await TaskService.updateTask(_id, description, name, user.id);
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
            const { idArray } = req.body;
            const user = req.user;
            const manyTask = await TaskService.getMany(idArray, user.id);
            return res.json({message: 'success find'});
        } catch (e) {
            next(e);
        }
    }

    async deleteMany(req, res, next) {
        try {
            const { idArray } = req.body;
            const user = req.user;
            const manyTask = await TaskService.deleteMany(idArray, user.id);
            return res.json({message: 'success delete'});
        } catch (e) {
            next(e);
        }
    }
}


export default new TaskController();