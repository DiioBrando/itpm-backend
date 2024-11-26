import Router from 'express';

import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import ProjectController from "../controller/ProjectController.js";
import routerProject from "./routerProject.js";
import TaskController from "../controller/TaskController.js";

const routerTask = new Router();

routerTask.post('/task/add', authMiddleware, TaskController.addTask);
routerTask.delete('/task/delete/:id/:idColumn', authMiddleware, TaskController.deleteTask);
routerTask.patch('/task/update/:id', authMiddleware, TaskController.updateTask);
routerTask.get('/task/get-all', TaskController.getAll);
routerTask.get('/task/get-one/:id', authMiddleware, TaskController.getOne);
routerTask.get('/task/get-many', authMiddleware, TaskController.getMany);
routerTask.delete('/task/delete-many', authMiddleware, TaskController.deleteMany);


export default routerTask;