import Router from 'express';
import ProjectController from "../controller/ProjectController.js";
import { authMiddleware } from "../middlewaree/authMiddlewaree.js";

const routerProject = new Router();

routerProject.post('/create-project', authMiddleware, ProjectController.createProject);
routerProject.delete('/delete-project/:id', authMiddleware, ProjectController.deleteProject);
routerProject.patch('/update-project/:id', authMiddleware, ProjectController.updateProject);
routerProject.get('/get-one/:id', authMiddleware, ProjectController.getOne);
routerProject.get('/get-all', authMiddleware, ProjectController.getAll);
routerProject.get('/get-many-projects', authMiddleware, ProjectController.getMany);

export default routerProject;