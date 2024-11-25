import Router from 'express';

import { authMiddleware } from '../middlewaree/authMiddlewaree.js';
import CommentController from '../controller/CommentController.js';

const routerComments = new Router();

routerComments.post('/add-comment', authMiddleware, CommentController.commentAdd);
routerComments.delete('/delete-comment/:id', authMiddleware, CommentController.deleteComment);
routerComments.patch('/update-comment/:id', authMiddleware, CommentController.updateComment);
routerComments.get('/get-all-comments', CommentController.getAll);

export default routerComments