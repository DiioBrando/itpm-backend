import Router from 'express';

import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import TasksColumnController from "../controller/TasksColumnController.js";
import routerProject from "./routerProject.js";

const routerTasksColumn = new Router();

routerTasksColumn.post('/add-tasks-column', authMiddleware, TasksColumnController.addTasksColumn);
routerTasksColumn.delete('/delete-tasks-column/:id', authMiddleware, TasksColumnController.deleteTasksColumn);
routerTasksColumn.patch('/update-tasks-column/:id', authMiddleware, TasksColumnController.updateTasksColumn);
routerProject.get('/get-one-tasks-column/:id', authMiddleware, TasksColumnController.getOne);
routerProject.get('/get-all-tasks-column', authMiddleware, TasksColumnController.getAll);
routerProject.get('/get-many-tasks-column', authMiddleware, TasksColumnController.getMany);
routerProject.delete('/delete-many-tasks-column', authMiddleware, TasksColumnController.deleteMany);

export default routerTasksColumn;