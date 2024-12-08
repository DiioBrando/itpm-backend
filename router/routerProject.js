import Router from 'express';
import ProjectController from "../controller/ProjectController.js";
import { authMiddleware } from "../middlewaree/authMiddlewaree.js";


const routerProject = new Router();

routerProject.post('/project', authMiddleware, ProjectController.createProject);
routerProject.delete('/project/:id', authMiddleware, ProjectController.deleteProject);
routerProject.patch('/project/:id', authMiddleware, ProjectController.updateProject);

routerProject.get('/project/:name', authMiddleware, ProjectController.getOne);
routerProject.get('/projects', authMiddleware, ProjectController.getAll);
routerProject.get('/projects/many', authMiddleware, ProjectController.getMany);

routerProject.delete('/projects', authMiddleware, ProjectController.deleteMany);
routerProject.post('/project/invite/:id/:userId', authMiddleware, ProjectController.inviteProject);
routerProject.delete('/project/invite/:id/:userId', authMiddleware, ProjectController.kickProject);

routerProject.get('/project/report/:projectId', authMiddleware, ProjectController.generateProjectReport);

export default routerProject;
