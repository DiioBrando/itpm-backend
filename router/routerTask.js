import Router from 'express';

import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import ProjectController from "../controller/ProjectController.js";
import routerProject from "./routerProject.js";
import TaskController from "../controller/TaskController.js";

const routerTask = new Router();

routerTask.post('/add-task', authMiddleware, TaskController.addTask);
routerTask.delete('/delete-task/:id', authMiddleware, TaskController.deleteTask);
routerTask.patch('/update-task/:id', authMiddleware, TaskController.updateTask);
routerTask.get('/get-all-tasks', TaskController.getAll);
routerTask.get('/get-one-tasks/:id', authMiddleware, TaskController.getOne);
routerTask.get('/get-many-tasks', authMiddleware, TaskController.getMany);
routerTask.delete('/delete-many-tasks', authMiddleware, TaskController.deleteMany);


export default routerTask;