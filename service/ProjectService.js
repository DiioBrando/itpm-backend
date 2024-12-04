import ApiError from "../exceptions/ApiError.js";
import User from "../model/users-model/User.js";
import Project from "../model/project-model/Project.js";
import TasksColumn from "../model/kanban-model/TasksColumn.js";

class ProjectService {
    async createProject(name, idUser) {
        if (name.length === 0) {
            throw ApiError.BadRequest('Please set name project!');
        }

        name = name
            .replace(/[^a-zA-Z0-9-]/g, '')
            .trim()
            .replace(/(\w)[\s]+(\w)/g, '$1-$2')
            .replace(/[\s]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase();


        const user = await User.findOne({ _id: idUser });
        if (!user) {
            throw ApiError.BadRequest('Not found user');
        }
        const findProject = await Project.findOne({ nameProject: name });
        if (findProject && user.projects.includes(findProject._id)) {
            throw ApiError.BadRequest('This project already exists');
        }
        const defaultKanban = [
            { nameTasksColumn: 'in work', typeColumn: 'in-work', },
            { nameTasksColumn: 'in process', typeColumn: 'in-process', },
            { nameTasksColumn: 'completed', typeColumn: 'completed', },
        ];
        const createDefaultTasksColumn = await TasksColumn.insertMany(defaultKanban);
        const create = await Project.create({
            nameProject: name,
            userId: user._id,
            kanbanTasks: createDefaultTasksColumn,
        });
        user.projects.push(create._id);
        await user.save();
        return create;
    }

    async deleteProject(_id, idUser) {
        const user = await User.findOne({ _id: idUser });
        if (!user) {
            throw ApiError.BadRequest();
        }
        const project = await Project.findOne({ _id });
        if (!project) {
            throw ApiError.BadRequest();
        }
        await TasksColumn.deleteMany({ _id: { $in: project.kanbanTasks } });
        user.projects = user.projects.filter(projectId => !projectId.equals(project._id));
        await user.save();
        const delProject = await Project.deleteOne({ _id: project._id });
        return delProject;
    }

    async updateProject(_id, idUser, nameProject) {
        if (nameProject.length === 0) {
            throw ApiError.BadRequest();
        }
        const user = await User.findOne({ _id: idUser });
        if (!user) {
            throw ApiError.BadRequest();
        }
        const project = await Project.findOne({ _id });
        if (!project) {
            throw ApiError.BadRequest();
        }
        const update = await Project.findOneAndUpdate(
            { _id: project._id },
            { nameProject },
            { new: true }
        );
        return update;
    }

    async getOne(name, idUser) {
        const user = await User.findOne({ _id: idUser });
        if (!user) {
            throw ApiError.BadRequest();
        }
        const project = await Project.findOne({ nameProject: name });
        if (!project) {
            throw ApiError.BadRequest();
        }
        return project;
    }

    async getAll() {
        const findAllProjects = await Project.find();
        if (!findAllProjects) {
            throw ApiError.BadRequest();
        }
        return findAllProjects;
    }

    async getMany(idArray, idUser) {
        if (idArray.length === 0) {
            throw ApiError.BadRequest();
        }
        const user = await User.findOne({ _id: idUser });
        if (!user) {
            throw ApiError.BadRequest();
        }
        const findArray = await Project.find({ _id: { $in: idArray.split(',') } });
        if (!findArray) {
            throw ApiError.BadRequest();
        }
        return findArray;
    }

    async deleteMany(idArray, idUser) {
        if (idArray.length === 0) {
            throw ApiError.BadRequest();
        }
        const user = await User.findOne({ _id: idUser });
        if (!user) {
            throw ApiError.BadRequest();
        }
        const projects = await Project.find({ _id: { $in: idArray.split(',') } });
        for (const project of projects) {
            await TasksColumn.deleteMany({ _id: { $in: project.kanbanTasks } });
        }
        user.projects = user.projects.filter(projectId => !idArray.includes(projectId.toString()));
        await user.save();
        const deleteArray = await Project.deleteMany({ _id: { $in: idArray.split(',') } });
        return deleteArray;
    }

    async inviteProject(idProject, idUser) {
        const user = await User.findOne({ _id: idUser });
        if (!user) {
            throw ApiError.BadRequest();
        }
        const project = await Project.findOne({ _id: idProject });
        if (!project) {
            throw ApiError.BadRequest();
        }
        if (project.subscribers.includes(user._id)) {
            throw ApiError.BadRequest();
        }
        project.subscribers.push(user._id);
        user.subProjects.push(project._id);
        await project.save();
        await user.save();
        return project;
    }

    async kickProject(idProject, idUser) {
        const user = await User.findOne({ _id: idUser });
        if (!user) {
            throw ApiError.BadRequest();
        }
        const project = await Project.findOne({ _id: idProject });
        if (!project) {
            throw ApiError.BadRequest();
        }
        project.subscribers = project.subscribers.filter(
            subscriberId => !subscriberId.equals(user._id)
        );
        user.subProjects = user.subProjects.filter(
            subProjectsId => !subProjectsId.equals(project._id)
        );
        await project.save();
        await user.save();
        return project;
    }
}

export default new ProjectService();
