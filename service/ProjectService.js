import ApiError from "../exceptions/ApiError.js";
import User from "../model/users-model/User.js";
import UserDTO from "../dtos/UserDTO.js";
import Project from "../model/project-model/Project.js";

class ProjectService {
   async createProject(name, _id) {
        if(name.length === 0)  {
            throw ApiError.BadRequest('Please set name project!');
        }
        const user = await User.findOne({ _id: _id });
        if(!user) {
            throw ApiError.BadRequest('not found user');
        }
        const userDto = new UserDTO(user);
        const defaultKanban = [
            {
                nameTasksColumn: 'in work',
                tasks: [],
            },
            {
                nameTasksColumn: 'in process',
                tasks: [],
            },
            {
                nameTasksColumn: 'completed',
                tasks: [],
            },
        ];
        const create = await Project.create({ nameProject: name, userId: userDto.id, kanbanTasks: defaultKanban, });
        return create;
    }
    async deleteProject(_id, idUser) {

    }
    async updateProject(_id, nameProject) {

    }
}


export default new ProjectService();