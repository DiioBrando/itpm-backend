import Router from 'express';
import ProjectController from "../controller/ProjectController.js";
import { authMiddleware } from "../middlewaree/authMiddlewaree.js";

const routerProject = new Router();

routerProject.post('/create-project', authMiddleware, ProjectController.createProject);
routerProject.delete('/delete-project', authMiddleware, ProjectController.deleteProject);
routerProject.patch('/update-project', authMiddleware, ProjectController.updateProject);

export default routerProject;