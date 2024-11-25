import ApiError from "../exceptions/ApiError.js";
import User from "../model/users-model/User.js";
import UserDTO from "../dtos/UserDTO.js";
import Project from "../model/project-model/Project.js";
import TasksColumn from "../model/kanban-model/TasksColumn.js";

class ProjectService {
   async createProject(name, idUser) {
        if(name.length === 0)  {
            throw ApiError.BadRequest('Please set name project!');
        }
        const user = await User.findOne({ _id: idUser });
        if(!user) {
            throw ApiError.BadRequest('not found user');
        }
        const userDto = new UserDTO(user);
        const defaultKanban = [
            {
                nameTasksColumn: 'in work',
            },
            {
                nameTasksColumn: 'in process',
            },
            {
                nameTasksColumn: 'completed',
            },
        ];
        const createDefaultTasksColumn = await TasksColumn.insertMany(defaultKanban);
        const idTasksColumn = await createDefaultTasksColumn.map(item => item._id);

        const create = await Project.create({ nameProject: name, userId: userDto.id, kanbanTasks: idTasksColumn, });
        return create;
    }
    async deleteProject(_id, idUser) {
       const findUser = await User.findOne({ _id: idUser });
       if(!findUser) {
           throw ApiError.BadRequest();
       }

       const findProject = await Project.findOne({ _id: _id });

       if(!findProject) {
           throw ApiError.BadRequest();
       }

       const delProject = await Project.deleteOne({ _id: findProject._id });
       return delProject;
    }
    async updateProject(_id, idUser, nameProject) {
       if(nameProject.length === 0) {
           throw ApiError.BadRequest();
       }

        const findUser = await User.findOne({ _id: idUser });
        if(!findUser) {
            throw ApiError.BadRequest();
        }

        const findProject = await Project.findOne({ _id: _id });

        if(!findProject) {
            throw ApiError.BadRequest();
        }

        const update = Project.findOneAndUpdate({ _id: findProject.id }, { nameProject: nameProject }, { new: true } );
        return update;
    }
    async getOne(_id, idUser) {

        const findUser = await User.findOne({ _id: idUser });
        if(!findUser) {
            throw ApiError.BadRequest();
        }

        const findProject = await Project.findOne({ _id: _id });

        if(!findProject) {
            throw ApiError.BadRequest();
        }

        return findProject;
    }
   async getAll() {
       const findAllProjects = await Project.find();
       if(!findAllProjects) {
           throw ApiError.BadRequest();
       }

       return findAllProjects;
   }
   async getMany(idArray, idUser) {
       if(idArray.length === 0) {
           throw ApiError.BadRequest();
       }

       const findUser = await User.findOne({ _id: idUser });
       if(!findUser) {
           throw ApiError.BadRequest();
       }

       const findArray = await Project.find({ _id: { $in: idArray } });
       if(!findArray) {
           throw ApiError.BadRequest();
       }

       return findArray;
   }

   async deleteMany(idArray, idUser) {
       if(idArray.length === 0) {
           throw ApiError.BadRequest();
       }

       const findUser = await User.findOne({ _id: idUser });
       if(!findUser) {
           throw ApiError.BadRequest();
       }

       const deleteArray = await Project.deleteMany({ _id: { $in: idArray } });
       if(!deleteArray) {
           throw ApiError.BadRequest();
       }

       return deleteArray;
   }
}


export default new ProjectService();