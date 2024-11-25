import ProjectService from "../service/ProjectService.js";

class ProjectController {
   async createProject(res, req, next) {
        try {
            const { name, } = req.body;
            const user = req.user;
            const create = await ProjectService.createProject(name, user.id);
            return res.json({ message: 'success create' });
        } catch (e) {
            next(e);
        }
    }
    async deleteProject(res, req, next) {
        try {

            return res.json({ message: 'success delete' });
        } catch (e) {
            next(e);
        }
    }
    async updateProject(res, req, next) {
        try {

            return res.json({ message: 'success update' });
        } catch (e) {
            next(e);
        }
    }
}

export default new ProjectController();