import PageDao from "../../dao/tacticalpad/PageDao";
import ProjectDao from "../../dao/tacticalpad/ProjectDao";
import PublishingDao from "../../dao/tacticalpad/PublishingDao";
import { Page } from "../../interfaces/tacticalpad/page";
import { Project } from "../../interfaces/tacticalpad/project";
import { Publishing } from "../../interfaces/tacticalpad/publishing";
import { TrainingFile } from "../../interfaces/training/training-file";
import FileManagerService from "../file-manager";

export default class TacticalpadService {

    constructor(){
    }

    public async inserProject(project: Project): Promise<Project> {
        try {
            const projectRecord = await ProjectDao.create(project);
            return projectRecord;
        } catch (e) {
            throw e;
        } 
    }

    public async updateProject(projectId: number, project: Project): Promise<Project> {
        try {
            const projectRecord = await ProjectDao.updateByIntId(projectId, project);
            return projectRecord;
        } catch (e) {
            throw e;
        } 
    }

    public async insertPublishing(publishing: Publishing): Promise<Publishing> {
        try {
            const publishingRecord = await PublishingDao.create(publishing);
            return publishingRecord;
        } catch (e) {
            throw e;
        } 
    }

    public async updatePublishing(publishingId: number, publishing: Publishing): Promise<Publishing> {
        try {
            const publishingRecord = await PublishingDao.updateByIntId(publishingId, publishing);
            return publishingRecord;
        } catch (e) {
            throw e;
        } 
    }


    public async attachFileToPublishing(publishingId: string, attachedFile: TrainingFile): Promise<Publishing> {
        try {
            const publishingRecord = await PublishingDao.attachFile(publishingId, attachedFile);
            
            return publishingRecord;
        } catch (e) {
            throw e;
        } 
    }

    
    public async attachFileToPage(pageId: string, attachedFile: TrainingFile): Promise<Page> {
        try {
            const pageRecord = await PageDao.attachFile(pageId, attachedFile);
            
            return pageRecord;
        } catch (e) {
            throw e;
        } 
    }

    public async getPublishingById(publishingId: string): Promise<Publishing> {
        try {
            const publishingRecord = await PublishingDao.getById(publishingId);

            if(!publishingRecord) throw new Error('Unable to find publishing');
            
            return publishingRecord;
        } catch (e) {
            throw e;
        } 
    }

    public async getPublishingByIntId(publishingId: number): Promise<Publishing> {
        try {
            const publishingRecord = await PublishingDao.getByIntId(publishingId);

            if(!publishingRecord) throw new Error('Unable to find publishing');
            
            return publishingRecord;
        } catch (e) {
            throw e;
        } 
    }


    public async getUserProjects(user_id: string): Promise<Project[]> {
        try {
            const projects = await ProjectDao.getUserProjects(user_id);
            
            return projects;
        } catch (e) {
            throw e;
        } 
    }

    public async getProjectById(project_id: string): Promise<Project> {
        try {
            const project = await ProjectDao.getById(project_id);
            
            return project;
        } catch (e) {
            throw e;
        } 
    }

    public async getProjectByIntId(project_id: number): Promise<Project> {
        try {
            const project = await ProjectDao.getByIntId(project_id);
            
            return project;
        } catch (e) {
            throw e;
        } 
    }

    public async getProjectThumbnail(project_id: string): Promise<string> {
        try {
            //find publishing & pages
            const project = await ProjectDao.getById(project_id);

            const publishing = await PublishingDao.getByProjectId(project.int_id);

            const pages = await PageDao.getByPublishingId(publishing._id);

            let imageExt;

            for(let p of pages){

                for(let f of p.files){

                    imageExt = await FileManagerService.getFileExtension(f.path);
    
                    if(imageExt ===".png" || imageExt ===".jpg" || imageExt ===".jpeg" || imageExt ===".gif") return f.path;
                }
            }


        } catch (e) {
            throw e;
        } 
    }
    

    public async getPublishingByProjectId(proj_id: number): Promise<Publishing> {

        try{
            const publishing = await PublishingDao.getByProjectId(proj_id);

            return publishing;


        }catch(e){
            throw e;
        }
    }

    

    public async attachPageToPublishing(page: Page): Promise<Page> {

        try{
            const pageRecord = await PageDao.create(page);

            return pageRecord;


        }catch(e){
            throw e;
        }
    }

    public async getPageByInternalBoardId(internalBoardId: string){

        try{
            const pageRecord = await PageDao.getByInternalBoardId(internalBoardId);

            return pageRecord;

        }catch(e){
            throw(e);
        }
    }

    public async updatePage(internalBoardId: string, page: Page): Promise<Page> {

        try{
            const pageRecord = await PageDao.updateByInternalBoardId(internalBoardId, page);

            return pageRecord;


        }catch(e){
            throw e;
        }
    }

    


    public async getPublishingPages(publishing_id: string): Promise<Page[]> {

        try{
            const pages = await PageDao.getByPublishingId(publishing_id);

            //check if publishing contain image file
            if(!pages) throw new Error('Unable to find publishing');

            //check publishing files for img/video
            return pages;


        }catch(e){
            throw e;
        }
    }


    public async deletePage(page_id: string): Promise<boolean> {

        try {
            const page = await PageDao.getById(page_id);
            
            if (!page)
                throw new Error('Cannot find page')
            
            await PageDao.deletePageById(page_id); // delete page
            await FileManagerService.removeFiles(page.files.map(f => f.path)); // delete page files

            const relatedPages = await this.getPublishingPages(page.publishing_id);

            if (relatedPages.length == 1) { // is the last page, remove publishing and project too

                const publishing = await PublishingDao.getById(page.publishing_id); // delete publishing
                await PublishingDao.deletePublishingById(page.publishing_id); // delete publishing files

                const project_int_id = publishing.source_project.project_id;
                const project = await ProjectDao.getByIntId(project_int_id);
                await ProjectDao.deleteProjectById(project._id);
                
                await FileManagerService.removeFiles([project.tacticalpedia_file_path]); // remove pej2 file

            }

            return true;

        } catch(e) {
            throw e;
        }
    }

    
}