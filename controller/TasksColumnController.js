import TasksColumnService from "../service/TasksColumnService.js";

class TasksColumnController {
    async addTasksColumn(req, res, next) {
        try {
            const { nameTasksColumn, } = req.body;
            const user = req.user;
            const create = await TasksColumnService.addTasksColumn(nameTasksColumn, user.id);
            return res.json({ message: 'success create' });
        } catch (e) {
            next(e);
        }
    }
    async deleteTasksColumn(req, res, next) {
        try {
            const _id = req.params.id;
            const user = req.user;
            const del = await TasksColumnService.deleteTasksColumn(_id, user.id);
            return res.json({ message: 'success delete' });
        } catch (e) {
            next(e);
        }
    }
    async updateTasksColumn(req, res, next) {
        try {
            const { name } = req.body;
            const _id = req.params.id;
            const user = req.user;

            const update = await TasksColumnService.updateProject(_id, user.id, name);
            return res.json({ message: 'success update' });
        } catch (e) {
            next(e);
        }
    }
    async getOne(req, res, next) {
        try {
            const _id = req.params.id;
            const user = req.user;

            const getTasksColumn = await TasksColumnService.getOne(_id, user.id);
            return res.json({ message: 'success find', getTasksColumn},);
        } catch (e) {
            next(e);
        }
    }
    async getAll(req, res, next) {
        try {
            const getAllProjects = await TasksColumnService.getAll();
            return res.json({ message: 'success find', getAllProjects},);
        } catch (e) {
            next(e);
        }
    }
    async getMany(req, res, next) {
        try {
            const { idArray } = req.body;
            const user = req.user;
            const manyProjects = await TasksColumnService.getMany(idArray, user.id);
            return res.json({ message: 'success find', manyProjects });
        } catch (e) {
            next(e);
        }
    }
    async deleteMany(req, res, next) {
        try {
            const { idArray } = req.body;
            const user = req.user;
            const deleteManyProjects = await TasksColumnService.deleteMany(idArray, user.id);
            return res.json({ message: 'success delete' });
        } catch (e) {
            next(e);
        }
    }
}

export default new TasksColumnController();