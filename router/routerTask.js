import Router from 'express';

import { authMiddleware } from '../middlewaree/authMiddlewaree.js';

const routerTask = new Router();

routerTask.post('/add-task', authMiddleware, );
routerTask.delete('/delete-task/:id', authMiddleware, );
routerTask.patch('/update-task/:id', authMiddleware, );
routerTask.get('/getAll-tasks', );

export default routerTask;