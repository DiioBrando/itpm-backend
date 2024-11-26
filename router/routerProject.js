import Router from 'express';
import ProjectController from "../controller/ProjectController.js";
import { authMiddleware } from "../middlewaree/authMiddlewaree.js";

const routerProject = new Router();

routerProject.post('/project/create', authMiddleware, ProjectController.createProject);
routerProject.delete('/project/delete/:id', authMiddleware, ProjectController.deleteProject);
routerProject.patch('/project/update/:id', authMiddleware, ProjectController.updateProject);
routerProject.get('/project/get-one/:id', authMiddleware, ProjectController.getOne);
routerProject.get('/project/get-all', authMiddleware, ProjectController.getAll);
routerProject.get('/project/get-many', authMiddleware, ProjectController.getMany);
routerProject.delete('/project/delete-many', authMiddleware, ProjectController.deleteMany);
routerProject.post('/project/invite-project/:id/:userid', authMiddleware, ProjectController.inviteProject);
routerProject.delete('/project/kick-project/:id/:userid', authMiddleware, ProjectController.kickProject);

export default routerProject;