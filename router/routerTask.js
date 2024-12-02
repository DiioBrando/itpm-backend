import Router from 'express';
import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import TaskController from "../controller/TaskController.js";

const routerTask = new Router();

routerTask.post('/tasks', authMiddleware, TaskController.addTask);
routerTask.delete('/tasks/:id/:idColumn', authMiddleware, TaskController.deleteTask);
routerTask.patch('/tasks/:id', authMiddleware, TaskController.updateTask);
routerTask.get('/tasks', TaskController.getAll);
routerTask.get('/tasks/:id', authMiddleware, TaskController.getOne);
routerTask.get('/tasks/many', authMiddleware, TaskController.getMany);
routerTask.delete('/tasks', authMiddleware, TaskController.deleteMany);

export default routerTask;
