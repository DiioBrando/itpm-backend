import Router from 'express';
import ProjectController from "../controller/ProjectController.js";
import { authMiddleware } from "../middlewaree/authMiddlewaree.js";

const routerProject = new Router();

routerProject.post('/projects', authMiddleware, ProjectController.createProject);
routerProject.delete('/projects/:id', authMiddleware, ProjectController.deleteProject);
routerProject.patch('/projects/:id', authMiddleware, ProjectController.updateProject);

routerProject.get('/projects/:name', authMiddleware, ProjectController.getOne);
routerProject.get('/projects', authMiddleware, ProjectController.getAll);
routerProject.get('/projects/many', authMiddleware, ProjectController.getMany);

routerProject.delete('/projects', authMiddleware, ProjectController.deleteMany);
routerProject.post('/projects/:id/invite/:userId', authMiddleware, ProjectController.inviteProject);
routerProject.delete('/projects/:id/kick/:userId', authMiddleware, ProjectController.kickProject);

export default routerProject;
