import TasksColumnService from "../service/TasksColumnService.js";

class TasksColumnController {
    async addTasksColumn(req, res, next) {
        try {
            const { name, typeTasksColumn, projectId } = req.body;
            const user = req.user;
            const create = await TasksColumnService.addTasksColumn(name, typeTasksColumn, user.id, projectId);
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

            console.log(name);

            const update = await TasksColumnService.updateTasksColumn(_id, user.id, name);
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
            return res.json(getTasksColumn);
        } catch (e) {
            next(e);
        }
    }
    async getAll(req, res, next) {
        try {
            const getAllProjects = await TasksColumnService.getAll();
            return res.json(getAllProjects);
        } catch (e) {
            next(e);
        }
    }
    async getMany(req, res, next) {
        try {
            const idArray = req.query.id;
            const user = req.user;
            const manyProjects = await TasksColumnService.getMany(idArray, user.id);
            return res.json(manyProjects);
        } catch (e) {
            next(e);
        }
    }
    async deleteMany(req, res, next) {
        try {
            const idArray = req.query.id;
            const user = req.user;
            const deleteManyProjects = await TasksColumnService.deleteMany(idArray, user.id);
            return res.json({ message: 'success delete' });
        } catch (e) {
            next(e);
        }
    }
}

export default new TasksColumnController();