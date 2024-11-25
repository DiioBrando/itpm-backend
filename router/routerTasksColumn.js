import Router from 'express';

import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import TasksColumnController from "../controller/TasksColumnController.js";

const routerTasksColumn = new Router();

routerTasksColumn.post('/add-tasks-column', authMiddleware, TasksColumnController.addTasksColumn);
routerTasksColumn.delete('/delete-tasks-column/:id', authMiddleware, TasksColumnController.deleteTasksColumn);
routerTasksColumn.patch('/update-tasks-column/:id', authMiddleware, TasksColumnController.updateTasksColumn);
routerTasksColumn.get('/get-all-tasks-column', TasksColumnController.getAllTasksColumn);

export default routerTasksColumn;