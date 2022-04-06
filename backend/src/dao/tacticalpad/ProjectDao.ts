import { Project } from "../../interfaces/tacticalpad/project";
import projectModel from "../../models/tacticalpad/project";

export default class ProjectDao {

    constructor(){}

    public static async create(project: Project): Promise<Project> {      
        return await projectModel.create(project);
    }

    public static async getUserProjects(user_id: string): Promise<Project[]>{
        return await projectModel.find({user_id: user_id});
    }

    public static async updateByIntId(projectId: number, project:Project): Promise<Project>{
        return await projectModel.findOneAndUpdate({int_id: projectId}, {$set: project}, {returnOriginal: false});
    }

    public static async getById(project_id: string): Promise<Project> {      
        return await projectModel.findById( project_id);
    }

    public static async getByIntId(project_int_id: number): Promise<Project> {      
        return await projectModel.findOne({int_id: project_int_id});
    }

    public static async deleteProjectById(projectId: string){
        return await projectModel.findByIdAndRemove(projectId);
    }

}