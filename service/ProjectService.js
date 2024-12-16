import ApiError from "../exceptions/ApiError.js";
import User from "../model/users-model/User.js";
import Project from "../model/project-model/Project.js";
import TasksColumn from "../model/kanban-model/TasksColumn.js";
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import Task from "../model/kanban-model/Task.js";
import {response} from "express";

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

    async updateProject(_id, idUser, nameProject, statusProject, descriptionProject, dateProject, budgetProject) {
        if(statusProject.length === 0) {
            throw ApiError.BadRequest();
        }

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
            { nameProject: nameProject, statusProject: statusProject, descriptionProject: descriptionProject, dateProject: dateProject, budgetProject: budgetProject },
            { new: true },
        );
        return update;
    }

    async getOne(name, idUser) {

        const user = await User.findOne({ _id: idUser });
        if (!user) {
            throw ApiError.BadRequest("not found user");
        }

        const project = await Project.findOne({
            nameProject: name,
            $or: [
                { userId: user._id },
                { subscribers: user._id },
            ]
        });

        if (!project) {
            throw ApiError.BadRequest("Project not fount or not access");
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
        const project = await Project.findById(projectId).populate({
            path: 'kanbanTasks',
            populate: {
                path: 'tasks',
                model: 'Task'
            }
        }).populate('subscribers', 'email');

        if (!project) {
            throw ApiError.BadRequest('Project not found');
        }

        const user = await User.findById(project.userId, 'email');

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
        doc.text(`Отчёт создан пользователем: ${user.email}`);

        // Обработка подписчиков
        const subscribers = project.subscribers.length > 0
            ? project.subscribers.map(sub => sub.email).join(', ')
            : 'Нет команды';
        doc.text(`Команда: ${subscribers}`);
        doc.moveDown();

        // Подсчет задач в каждой колонке и количества задач по типам
        let totalTasks = 0;
        let completedTasksCount = 0;
        for (const column of project.kanbanTasks) {
            const columnName = column.nameTasksColumn;
            const columnType = column.typeColumn;
            const tasksCount = column.tasks.length;

            if(columnType === 'completed') {
                completedTasksCount += tasksCount;
            }
            totalTasks += tasksCount;

            doc.text(`Колонка "${columnName}" (${columnType}): ${tasksCount} задач`);
            doc.moveDown();
        }

        const budget = parseFloat(project.budgetProject); // Преобразуем строку в число
        if (isNaN(budget) || budget <= 0) {
            throw new Error("Некорректный бюджет проекта");
        }
        console.log(completedTasksCount, 'completedTasksCount');

        const paymentPerTask = budget / totalTasks; // Сумма выплаты за задачу
        const totalPayment = paymentPerTask * (completedTasksCount); // Общая сумма выплат за завершенные задачи



        // Добавляем сумму выплат
        doc.text(`Общая оплата за задачи: ${totalPayment.toFixed(2)} $`);
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


    async generateSelectedProjectsReports(idArray) {

        const projectIds = idArray.split(',');


        const projects = await Project.find({ _id: { $in: projectIds } });

        if (!projects.length) {
            throw new Error('Проекты не найдены.');
        }


        const projectsByStatus = {
            'in-work': [],
            'in-process': [],
            'completed': [],
        };

        projects.forEach((project) => {
            projectsByStatus[project.statusProject]?.push(project);
        });


        const totalBudget = projects.reduce((sum, project) => sum + parseFloat(project.budgetProject || 0), 0);


        const directoryPath = path.join(__dirname, '../reports');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }


        const doc = new PDFDocument();
        const filePath = path.join(directoryPath, 'projects_report.pdf');
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
        doc.registerFont('Tinos', './font/Tinos/Tinos-Bold.ttf');
        doc.font('Tinos');

        doc.fontSize(20).text('Отчёт по проектам', { align: 'center' }).moveDown();


        ['in-work', 'in-process', 'completed'].forEach((status) => {
            const statusTitle =
                status === 'in-work'
                    ? 'К работе'
                    : status === 'in-process'
                        ? 'В процессе'
                        : 'Завершённые';
            doc.fontSize(16).text(`${statusTitle}:`, { underline: true }).moveDown();

            if (projectsByStatus[status].length > 0) {
                projectsByStatus[status].forEach((project) => {
                    const date = project.dateProject.split('-').map(Number);
                    const startDate = new Date(date[0]).toLocaleDateString('ru-Ru');
                    const endDate = new Date(date[1]).toLocaleDateString('ru-Ru');
                    doc
                        .fontSize(12)
                        .text(`Название: ${project.nameProject}`)
                        .text(`Бюджет: ${project.budgetProject}$`)
                        .text(`Дедлайн: ${startDate} - ${endDate}`)
                        .moveDown();
                });
            } else {
                doc.fontSize(12).text('Нет проектов').moveDown();
            }
        });


        doc.fontSize(16).text(`Общая сумма всех проектов: ${totalBudget.toFixed(2)}$`, {
            align: 'right',
        });


        doc.end();

        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => resolve(filePath));
            writeStream.on('error', reject);
        });
    }

    async generateAllProjectsReports(idUser) {
        const user = await User.findOne({ _id: idUser });

        const projectsId = [...user.projects, ...user.subProjects].filter((item) => item !== undefined);

        const projects = await Project.find({ _id: { $in: projectsId } });

        if (!projects.length) {
            throw new Error('Проекты не найдены.');
        }


        const projectsByStatus = {
            'in-work': [],
            'in-process': [],
            'completed': [],
        };

        projects.forEach((project) => {
            projectsByStatus[project.statusProject]?.push(project);
        });


        const totalBudget = projects.reduce((sum, project) => sum + parseFloat(project.budgetProject || 0), 0);


        const directoryPath = path.join(__dirname, '../reports');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }


        const doc = new PDFDocument();
        const filePath = path.join(directoryPath, 'projects_report.pdf');
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
        doc.registerFont('Tinos', './font/Tinos/Tinos-Bold.ttf');
        doc.font('Tinos');

        doc.fontSize(20).text('Отчёт по проектам', { align: 'center' }).moveDown();


        ['in-work', 'in-process', 'completed'].forEach((status) => {
            const statusTitle =
                status === 'in-work'
                    ? 'К работе'
                    : status === 'in-process'
                        ? 'В процессе'
                        : 'Завершённые';
            doc.fontSize(16).text(`${statusTitle}:`, { underline: true }).moveDown();

            if (projectsByStatus[status].length > 0) {
                projectsByStatus[status].forEach((project) => {
                    const date = project.dateProject.split('-').map(Number);
                    const startDate = new Date(date[0]).toLocaleDateString('ru-Ru');
                    const endDate = new Date(date[1]).toLocaleDateString('ru-Ru');
                    doc
                        .fontSize(12)
                        .text(`Название: ${project.nameProject}`)
                        .text(`Бюджет: ${project.budgetProject}$`)
                        .text(`Дедлайн: ${startDate} - ${endDate}`)
                        .moveDown();
                });
            } else {
                doc.fontSize(12).text('Нет проектов').moveDown();
            }
        });


        doc.fontSize(16).text(`Общая сумма всех проектов: ${totalBudget.toFixed(2)}$`, {
            align: 'right',
        });


        doc.end();

        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => resolve(filePath));
            writeStream.on('error', reject);
        });
    }

}

export default new ProjectService();
