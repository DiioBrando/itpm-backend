import ApiError from "../exceptions/ApiError.js";
import User from "../model/users-model/User.js";
import Project from "../model/project-model/Project.js";
import TasksColumn from "../model/kanban-model/TasksColumn.js";
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import Task from "../model/kanban-model/Task.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProjectService {
    async createProject(name, budgetProject, descriptionProject , dateProject, idUser) {
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
            { nameTasksColumn: 'к работе', typeColumn: 'in-work', },
            { nameTasksColumn: 'в процессе', typeColumn: 'in-process', },
            { nameTasksColumn: 'завершенные', typeColumn: 'completed', },
        ];
        const createDefaultTasksColumn = await TasksColumn.insertMany(defaultKanban);
        const create = await Project.create({
            nameProject: name,
            userId: user._id,
            kanbanTasks: createDefaultTasksColumn,
            budgetProject: budgetProject,
            descriptionProject: descriptionProject,
            dateProject: dateProject,
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


    async generateProjectReport(projectId) {
        const project = await Project.findById(projectId)
            .populate('kanbanTasks')
            .populate('subscribers');

        const user = await User.findOne({ _id: project.userId });
        const users = project.subscribers.map(item => User.findOne({ _id: item }));
        if (!project) {
            throw ApiError.BadRequest('Project not found');
        }

        // Подготовка папки для отчета
        const directoryPath = path.join(__dirname, 'reports');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        // Создание PDF-документа
        const doc = new PDFDocument();
        const filePath = path.join(directoryPath, `project_${projectId}.pdf`);
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
        doc.registerFont('Tinos', './font/Tinos/Tinos-Bold.ttf');
        doc.font('Tinos');

        // Наполнение документа данными
        doc.fontSize(20).text(`Отчёт о проекте: ${project.nameProject}`, { align: 'center' });
        doc.moveDown();
        doc.text(`Отчёт создан: ${user.email}`);

        // Обработка подписчиков
        const subscribers = users.length > 0 ? (users.map(item => item.email) || 'не известна').join(', ') : 'Нет команды';
        doc.text(`Команда: ${subscribers}`);
        doc.moveDown();

        // Подсчет задач в каждой колонке и количества выполненных задач
        let totalCompletedTasks = 0;

        for (const column of project.kanbanTasks) {
            const columnName = column.nameTasksColumn;
            const tasksCount = column.tasks.length;

            // Подсчет только выполненных задач
            const completedTasksCount = column.tasks.filter(task => task.status === 'completed').length;
            totalCompletedTasks += completedTasksCount;

            // Добавляем в отчет только столбец и количество задач
            doc.text(`${columnName}: ${completedTasksCount} задачи`);
            doc.moveDown();
        }

        // Расчет общей суммы выплат (например, 10% от бюджета проекта на количество выполненных задач)
        const paymentPerTask = project.budgetProject / totalCompletedTasks;
        const totalPayment = totalCompletedTasks * paymentPerTask;

        // Добавляем сумму выплат
        doc.text(`Общая оплата на основе выполненных задач: ${totalPayment? totalPayment.toFixed(2): 0} $`);
        doc.moveDown();

        // Завершение документа
        doc.end();

        // Проверка, существует ли файл после завершения записи
        if (!fs.existsSync(filePath)) {
            throw new Error(`Failed to create file at path: ${filePath}`);
        }

        // Удаляем отчет после отправки пользователю
        writeStream.on('finish', () => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file at path: ${filePath}`, err);
                } else {
                    console.log(`File deleted successfully at path: ${filePath}`);
                }
            });
        });

        // Возврат пути к файлу для скачивания
        return filePath;
    }








}

export default new ProjectService();
