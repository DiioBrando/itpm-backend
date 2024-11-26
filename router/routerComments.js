import Router from 'express';

import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import CommentController from '../controller/CommentController.js';

const routerComments = new Router();

routerComments.post('/comment/add', authMiddleware, CommentController.commentAdd);
routerComments.delete('/comment/delete/:id', authMiddleware, CommentController.deleteComment);
routerComments.patch('/comment/update/:id', authMiddleware, CommentController.updateComment);
routerComments.get('/comment/get-all', CommentController.getAll);

export default routerComments