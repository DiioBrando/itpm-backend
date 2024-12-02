import Router from 'express';

import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import TasksColumnController from '../controller/TasksColumnController.js';

const routerTasksColumn = new Router();

routerTasksColumn.post('/column', authMiddleware, TasksColumnController.addTasksColumn);
routerTasksColumn.delete('/column/:id', authMiddleware, TasksColumnController.deleteTasksColumn);
routerTasksColumn.patch('/column/:id', authMiddleware, TasksColumnController.updateTasksColumn);
routerTasksColumn.get('/column/:id', authMiddleware, TasksColumnController.getOne);
routerTasksColumn.get('/columns', authMiddleware, TasksColumnController.getAll);
routerTasksColumn.get('/columns/batch', authMiddleware, TasksColumnController.getMany);
routerTasksColumn.delete('/columns/batch', authMiddleware, TasksColumnController.deleteMany);

export default routerTasksColumn;
