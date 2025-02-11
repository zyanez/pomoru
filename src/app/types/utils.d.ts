import { InsertTask, InsertProject, SelectTask, SelectProject, UpdateTask,  UpdateProject } from "@/db/schema";

export type Task = SelectTask;
export type IInsertTask = InsertTask;
export type IUpdateTask = UpdateTask;

export type Project = SelectProject;
export type IInsertProject = InsertProject;
export type IUpdateProject = UpdateProject;