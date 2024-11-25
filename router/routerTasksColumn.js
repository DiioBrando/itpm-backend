import Router from 'express';

import { authMiddleware } from '../middlewaree/authMiddlewaree.js';

const routerTasksColumn = new Router();

routerTasksColumn.post('/add-tasks-column', authMiddleware, );
routerTasksColumn.delete('/delete-tasks-column/:id', authMiddleware, );
routerTasksColumn.patch('/update-tasks-column/:id', authMiddleware, );
routerTasksColumn.get('/get-all-tasks-column', );

export default routerTasksColumn;