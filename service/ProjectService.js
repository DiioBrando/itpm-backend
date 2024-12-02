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

        const findProject = await Project.findOne({ nameProject: name });
        if(findProject) {
            if(user.projects.includes(findProject._id)) {
                throw ApiError.BadRequest('this is project already created');
            }
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
        const create = await Project.create({ nameProject: name, userId: userDto.id, kanbanTasks: createDefaultTasksColumn, });

        user.projects.push(create._id);
        await user.save();

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
    async getOne(name, idUser) {

        const findUser = await User.findOne({ _id: idUser });
        if(!findUser) {
            throw ApiError.BadRequest();
        }

        const findProject = await Project.findOne({ nameProject: name });

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
       const findArray = await Project.find({ _id: { $in: idArray.split(',') } });
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

       const deleteArray = await Project.deleteMany({ _id: { $in: idArray.split(',') } });
       if(!deleteArray) {
           throw ApiError.BadRequest();
       }

       return deleteArray;
   }
    async inviteProject(idProject, idUser){
        const findUser = await User.findOne({ _id: idUser });
        if(!findUser) {
            throw ApiError.BadRequest();
        }

        const findProject = await Project.findOne({ _id: idProject });
        if(!findProject) {
            throw ApiError.BadRequest();
        }

        if (findProject.subscribers.includes(findUser._id)) {
            throw ApiError.BadRequest();
        }

        findProject.subscribers.push(findUser._id);
        findUser.subProjects.push(findProject._id);

        await findProject.save();
        await findUser.save();

        return findProject;
    }
    async kickProject(idProject, idUser){
        const findUser = await User.findOne({ _id: idUser });
        if(!findUser) {
            throw ApiError.BadRequest();
        }

        const findProject = await Project.findOne({ _id: idProject });
        if(!findProject) {
            throw ApiError.BadRequest();
        }

        findProject.subscribers = findProject.subscribers.filter(subscriberId => !subscriberId.equals(findUser._id));
        findUser.subProjects = findUser.subProjects.filter(subProjectsId => !subProjectsId.equals(findProject._id));

        await findProject.save();
        await findUser.save();

        return findProject;
   }
}


export default new ProjectService();