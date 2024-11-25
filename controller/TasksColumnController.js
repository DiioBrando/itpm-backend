import TasksColumnService from "../service/TasksColumnService.js";

class TasksColumnController {
   async addTasksColumn(req, res, next) {
       try {
           const { nameTask, idColumnTasks, description } = req.body;
           const user = req.user;
           const addTask = await TasksColumnService.addTasksColumn(nameTask, idColumnTasks, user.id, description);
           return res.json({ message: 'success add' });
       } catch(e) {
           next(e);
       }
   }
   async deleteTasksColumn(req, res, next) {
       try {

       } catch(e) {
           next(e);
       }
   }
   async updateTasksColumn(req, res, next) {
       try {

       } catch(e) {
           next(e);
       }
   }
   async getAllTasksColumn(req, res, next) {
       try {

       } catch(e) {
           next(e);
       }
   }
}

export default new TasksColumnController();