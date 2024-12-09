import Router from 'express';
import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import TaskController from "../controller/TaskController.js";
import TasksColumnController from "../controller/TasksColumnController.js";
import routerTasksColumn from "./routerTasksColumn.js";

const routerTask = new Router();

routerTask.post('/tasks', authMiddleware, TaskController.addTask);
routerTask.get('/tasks', TaskController.getAll);
routerTask.get('/tasks/many', authMiddleware, TaskController.getMany);
routerTask.delete('/tasks', authMiddleware, TaskController.deleteMany);
routerTask.get('/tasks/:id', authMiddleware, TaskController.getOne);
routerTask.delete('/tasks/:id/:idColumn', authMiddleware, TaskController.deleteTask);
routerTask.patch('/tasks/:id', authMiddleware, TaskController.updateTask);
routerTask.patch('/tasks/:id/deadline', authMiddleware, TaskController.updateTaskDeadline);
routerTasksColumn.patch('/tasks/move/:id', authMiddleware, TaskController.moveTask)

export default routerTask;
