import ProjectService from "../service/ProjectService.js";
import fs from "fs";

class ProjectController {
    async createProject(req, res, next) {
        try {
            const {nameProject, budgetProject, descriptionProject, formattedDates} = req.body;
            const user = req.user;
            const create = await ProjectService.createProject(nameProject, budgetProject, descriptionProject, formattedDates, user.id);
            return res.json(create);
        } catch (e) {
            next(e);
        }
    }

    async deleteProject(req, res, next) {
        try {
            const _id = req.params.id;
            const user = req.user;
            const del = await ProjectService.deleteProject(_id, user.id);
            return res.json({message: 'success delete'});
        } catch (e) {
            next(e);
        }
    }

    async updateProject(req, res, next) {
        try {
            const {name, statusProject, descriptionProject, dateProject, budgetProject} = req.body;
            const _id = req.params.id;
            const user = req.user;

            const update = await ProjectService.updateProject(_id, user.id, name, statusProject, descriptionProject, dateProject, budgetProject);
            return res.json({message: 'success update'});
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const name = req.params.name;
            const user = req.user;
            const getProject = await ProjectService.getOne(name, user.id);
            return res.json(getProject);
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            const getAllProjects = await ProjectService.getAll();
            return res.json(getAllProjects);
        } catch (e) {
            next(e);
        }
    }

    async getMany(req, res, next) {
        try {
            const idArray = req.query.id;
            const user = req.user;
            const manyProjects = await ProjectService.getMany(idArray, user.id);
            return res.json(manyProjects);
        } catch (e) {
            next(e);
        }
    }

    async deleteMany(req, res, next) {
        try {
            const idArray = req.query.id;
            const user = req.user;
            const deleteManyProjects = await ProjectService.deleteMany(idArray, user.id);
            return res.json({message: 'success delete'});
        } catch (e) {
            next(e);
        }
    }

    async inviteProject(req, res, next) {
        try {
            const id = req.params.id;
            const userid = req.params.userId;
            const invite = await ProjectService.inviteProject(id, userid);
            return res.json({message: 'success invite'});
        } catch (e) {
            next(e);
        }
    }

    async kickProject(req, res, next) {
        try {
            const {id, userid} = req.params;
            const invite = await ProjectService.kickProject(id, userid);
            return res.json({message: 'success delete'});
        } catch (e) {
            next(e);
        }
    }

    async generateProjectReport(req, res, next) {
        try {
            const projectId = req.params.projectId;

            const filePath = await ProjectService.generateProjectReport(projectId);

            return res.download(filePath);
        } catch (error) {
            next(error);
        }
    }

    async generateSelectedProjectsReports(req, res, next) {
        try {
            const idArray = req.params.id;

            const filePath = await ProjectService.generateSelectedProjectsReports(idArray);
            return res.download(filePath);
        } catch (e) {
            next(e);
        }
    }

    async generateAllProjectsReports(req, res, next) {
        try {
            const _id = req.user.id;
            const filePath = await ProjectService.generateAllProjectsReports(_id);
            return res.download(filePath);
        } catch (e) {
            next(e);
        }
    }
}

export default new ProjectController();