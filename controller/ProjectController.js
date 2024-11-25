import ProjectService from "../service/ProjectService.js";

class ProjectController {
   async createProject(req, res, next) {
        try {
            const { nameProject, } = req.body;
            const user = req.user;
            const create = await ProjectService.createProject(nameProject, user.id);
            return res.json({ message: 'success create' });
        } catch (e) {
            next(e);
        }
    }
    async deleteProject(req, res, next) {
        try {
            const _id = req.params.id;
            const user = req.user;
            const del = await ProjectService.deleteProject(_id, user.id);
            return res.json({ message: 'success delete' });
        } catch (e) {
            next(e);
        }
    }
    async updateProject(req, res, next) {
        try {
            const { name } = req.body;
            const _id = req.params.id;
            const user = req.user;

            const update = await ProjectService.updateProject(_id, user.id, name);
            return res.json({ message: 'success update' });
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
       try {
           const _id = req.params.id;
           const user = req.user;

           const getProject = await ProjectService.getOne(_id, user.id);
           return res.json({ message: 'success find', getProject},);
       } catch (e) {
           next(e);
       }
    }
    async getAll(req, res, next) {
       try {
           const getAllProjects = await ProjectService.getAll();
           return res.json({ message: 'success find', getAllProjects},);
       } catch (e) {
           next(e);
       }
    }
    async getMany(req, res, next) {
       try {
           const { idArray } = req.body;
           const _id = req.user;
           const manyProjects = await ProjectService.getMany(idArray, _id);
           return res.json({ message: 'success find', manyProjects });
       } catch (e) {
           next(e);
       }
    }
}

export default new ProjectController();