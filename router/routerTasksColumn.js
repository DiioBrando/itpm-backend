import Router from 'express';

import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import TasksColumnController from "../controller/TasksColumnController.js";
import routerProject from "./routerProject.js";

const routerTasksColumn = new Router();

routerTasksColumn.post('/column/add', authMiddleware, TasksColumnController.addTasksColumn);
routerTasksColumn.delete('/column/delete/:id', authMiddleware, TasksColumnController.deleteTasksColumn);
routerTasksColumn.patch('/column/update/:id', authMiddleware, TasksColumnController.updateTasksColumn);
routerProject.get('/column/get-one/:id', authMiddleware, TasksColumnController.getOne);
routerProject.get('/column/get-all', authMiddleware, TasksColumnController.getAll);
routerProject.get('/column/get-many', authMiddleware, TasksColumnController.getMany);
routerProject.delete('/column/delete-many', authMiddleware, TasksColumnController.deleteMany);

export default routerTasksColumn;