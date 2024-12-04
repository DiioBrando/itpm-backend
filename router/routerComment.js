import Router from 'express';
import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import CommentController from '../controller/CommentController.js';

const routerComment = new Router();

routerComment.post('/comment', authMiddleware, CommentController.commentAdd);
routerComment.delete('/comment/:id', authMiddleware, CommentController.deleteComment);
routerComment.patch('/comment/:id', authMiddleware, CommentController.updateComment);
routerComment.get('/comments', authMiddleware, CommentController.getAll);
routerComment.get('/comments/batch', CommentController.getMany);

export default routerComment;
