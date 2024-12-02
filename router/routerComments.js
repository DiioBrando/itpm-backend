import Router from 'express';
import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import CommentController from '../controller/CommentController.js';

const routerComments = new Router();

routerComments.post('/comments', authMiddleware, CommentController.commentAdd);
routerComments.delete('/comments/:id', authMiddleware, CommentController.deleteComment);
routerComments.patch('/comments/:id', authMiddleware, CommentController.updateComment);
routerComments.get('/comments', CommentController.getAll);

export default routerComments;
