import express from 'express'
import RefreshTokenDao from '../../../dao/RefreshTokenDao';
import ProjectDao from '../../../dao/tacticalpad/ProjectDao';
import { LoginRequest } from '../../../interfaces/login-request';
import { Project } from '../../../interfaces/tacticalpad/project';
import { Publishing } from '../../../interfaces/tacticalpad/publishing';
import { Training } from '../../../interfaces/training/training';
import { TrainingFile } from '../../../interfaces/training/training-file';
import AuthService from '../../../services/auth';
import FileManagerService from '../../../services/file-manager';
import ProfileService from '../../../services/profile';
import TacticalpadService from '../../../services/tacticalpad/tacticalpad';
import TrainingService from '../../../services/training';
import mongoose from 'mongoose';
import { User } from '../../../interfaces/user';
import { Page } from '../../../interfaces/tacticalpad/page';
import { FilterMapping } from '../../../interfaces/tacticalpad/filter-mapping';
import FilterService from '../../../services/tacticalpad/filter';
import { TrainingCategory } from '../../../interfaces/training/training-category';
import { Console } from 'winston/lib/winston/transports';
import isTacticalpadAuth from '../middlewares/isTacticalpadAuth';

const jwt = require('jsonwebtoken');

const router = express.Router();

var upload = new FileManagerService('tacticalpad').upload;

router.get('/projects', isTacticalpadAuth,  async (req, res) => {

    const tacticalpadService = new TacticalpadService();

    try {

        const user_id = req.loggedUser._id;

        //get all project of users
        let projects = await tacticalpadService.getUserProjects(user_id);

        const pageNum = parseInt(String(req.query.page));
        const itemsPerPage = parseInt(String(req.query.items_per_page));
        const lastPage = String(Math.ceil(projects.length/parseInt(String(req.query.items_per_page))))

        const start = (pageNum-1)*itemsPerPage;
        const end = ((start+itemsPerPage) > projects.length) ? projects.length : start+itemsPerPage;

        projects = projects.slice(start, end);

        const formattedProjects = await Promise.all(projects.map(async proj =>  await (await formatProject(proj, req.loggedUser))));

        return res.status(200).json({
            "total_items": projects.length,
            "items_per_page": itemsPerPage,
            "current_page": pageNum,
            "last_page": lastPage,
            "projects": formattedProjects, 
        });

    } catch (e) {
        console.log(e);
        return res.status(400).send({ message: e.message });
    }

});

router.get('/filters', isTacticalpadAuth, async (req, res) => {

    const filterService = new FilterService();
    const authService = new AuthService();

    try {

        // Get and prepare categories
        const categories = await filterService.getEncodedCategories(req.loggedUser);
        const categoriesResponse = await prepareEncodedCategories(categories);

        // Get and prepare select taxonomies
        const selectTaxonomies = await filterService.getEncodedSelectTaxonomies(req.loggedUser);
        const selectTaxonomiesResponse = await prepareEncodedSelectTaxonomies(selectTaxonomies);

        return res.status(200).json(categoriesResponse.concat(selectTaxonomiesResponse));

    } catch(e) {
        console.log(e);
        return  res.status(400);
    }

    

})


async function formatProject(proj: Project, user: User){

    const tacticalpadService = new TacticalpadService();
    const filterService = new FilterService();

    try{

        let obj = {
            "project_id": proj.int_id,
            "fullPath": proj.fullPath,
            "mimetype":proj.attached_file_info.mimetype, //'tacticalpad/pej2', //proj.attached_file_info.mimetype, // only one file or multiple files
            "size": proj.attached_file_info.size,
            "metadata": proj.attached_file_info.metadata,
            "thumbnail_url": process.env.BACK_END_URL + 'v1/tacticalpad/v1/project/thumbnail/'+proj._id, // only if project has published
            "owner": {
                "id": user.int_id,
                "name": user.profile.name + ' ' + user.profile.surname,
            },
            "is_mine": true,
            "share_info": [
                proj.share_info,
            ],
            "project_modified_at": proj.attached_file_info.modified_at, // modification of project
        }

        //get project pusblishing
        const publishing = await tacticalpadService.getPublishingByProjectId(proj.int_id);

        let filters = [];

        if (publishing) {

            let pages = [];

            //get pages of publishing
            pages = await tacticalpadService.getPublishingPages(publishing._id);

            if (pages.length > 0) {

                for(let p of pages){
                    filters = [...filters, ...p.filter_id]
                }
    
                filters = await Promise.all(filters.map(async f =>{
                    const decodedCategory = await filterService.decodeEncodedCategory(f);
                    let name = decodedCategory.type == "category" ? decodedCategory.value : decodedCategory.select;
                    return {id: f, name: name};
                }));

            }

            obj['publishing'] = {
                "publishing_id": publishing.int_id,
                "number_boards": pages.length,
                "title": publishing.title,
                "author_name": user.profile.name + ' ' + user.profile.surname,
                "publishing_url": process.env.FRONT_END_URL + '/training/library',
                "source_project": {
                    // Data sent on publishing begin
                    "modified_at": publishing.source_project.modified_at,
                    // From project
                    "size": publishing.source_project.size,
                    // bytes
                }
            };

        }

        obj['filters'] = filters;

        return obj
        
        }catch(e){
            console.log(e);
            throw e;
        }

}

//Update existing project
router.post('/projects/:id', isTacticalpadAuth, upload.single('attached_file'), async (req, res) => {

    const tacticalpadService = new TacticalpadService();

    try {

        const projectId = req.params.id;

        const project : Project = {...JSON.parse(req.body.parameters), user_id: req.loggedUser._id, tacticalpedia_file_path: (req as any).file.path };

        const projectRecord = await tacticalpadService.updateProject(parseInt(projectId), project);

        return res.status(200).json({
            "project_id": projectRecord.int_id,
            "synchronised_at": new Date().toISOString()
        });

    } catch (e) {
        console.log(e.message);
        return res.status(400).send({ message: e.message });
    }

});


router.post('/projects', isTacticalpadAuth, upload.single('attached_file'), async (req, res) => {

    const tacticalpadService = new TacticalpadService();

    try {

        const project : Project = {...JSON.parse(req.body.parameters), user_id: req.loggedUser._id, tacticalpedia_file_path: (req as any).file.path };

        const projectRecord = await tacticalpadService.inserProject(project);

        return res.status(200).json({
            "project_id": projectRecord.int_id,
            "synchronised_at": new Date().toISOString()
        });

    } catch (e) {
        console.log(e.message);
        return res.status(400).send({ message: e.message });
    }

});

router.post('/publishings/begin', isTacticalpadAuth, async (req, res) => {

    const tacticalpadService = new TacticalpadService();

    try {

        let publishingRecord;

        const publishing : Publishing = req.body;

        const publishingId = req.body.publishing_id;

        if(publishingId && publishingId !== -1){
            publishingRecord = await tacticalpadService.getPublishingByIntId(publishingId);

            publishingRecord = await tacticalpadService.updatePublishing(publishingId, publishing);
        }

        else publishingRecord = await tacticalpadService.insertPublishing(publishing);
        
        return res.status(200).json({"publishing_upload_session_id": publishingRecord._id});

    } catch (e) {

        console.log(e.message);
        return res.status(400).send({ message: e.message });
    }

});



router.post('/publishings/board/:publishingId', isTacticalpadAuth, upload.single('attached_file'), async (req, res) => {

    const tacticalpadService = new TacticalpadService();

    const trainingService = new TrainingService();

    const filterService = new FilterService();

    try{

        const publishingId = req.params.publishingId;
        const title = req.body.title;
        const internalBoardId = req.body.internal_board_id;

        let flag;

        //check if page exists
        let page = (internalBoardId) ? await tacticalpadService.getPageByInternalBoardId(internalBoardId): null;

        //create new page
        if(page == null){
            page = await tacticalpadService.attachPageToPublishing({publishing_id: publishingId, ...req.body} as Page);
            flag = 'create';
        }
        //update page
        else{
            await FileManagerService.removeFiles(page.files.map(f => f.path));
            page = await tacticalpadService.updatePage(internalBoardId, {publishing_id: publishingId, ...req.body, files:[]} as Page);
            flag = 'update';
        } 

        //create a tacticalpedia training for this page
        if(flag === 'create'){

            const mappedCategories = (await decodeFilter(req.body.filter_id, 'category')).map((category) => ({slug: slugify(category.value), label: category.value}));

            const decodedSelectTaxonomies = (await decodeFilter(req.body.filter_id, 'select-taxonomy')).map((t) => ({name: t.select, value: t.value}))
            .reduce(function (r, a) {
                r[a.name] = r[a.name] || [];
                r[a.name].push(a.value);
                return r;
            }, Object.create(null));
        
            const selectTaxonomies = Object.keys(decodedSelectTaxonomies).map(function (key) {
                return {name: key, value: decodedSelectTaxonomies[key]};
            });

            const training: Training = { user_id: mongoose.Types.ObjectId(req.loggedUser._id), 
                description: page.notes,
                tacticalpad_publishing_id: page._id,
                taxonomies: page.additional_info.map(tax => ({slug: slugify(tax.key), label:tax.key, value: tax.value})),
                category: mappedCategories as TrainingCategory[],
                selectTaxonomies: selectTaxonomies,
                visibility: 'private',
                name: page.title
            };
             
            const trainingRecord = await trainingService.insertTraining(training);
        }

        //update tacticalpedia training for this page
        else if(flag === 'update'){
           
            let trainingRecord = await trainingService.getTrainingByPublishingId(page._id);

            const mappedCategories = (await decodeFilter(req.body.filter_id, 'category')).map((category) => ({slug: slugify(category.value), label: category.value}));

            //compute new taxonomies
            const newTax = page.additional_info.map(tax => ({slug: slugify(tax.key), label:tax.key, value: tax.value}));

            const newDecodedSelectTaxonomies = (await decodeFilter(req.body.filter_id, 'select-taxonomy')).map((t) => ({name: t.select, value: t.value}))
            .reduce(function (r, a) {
                r[a.name] = r[a.name] || [];
                r[a.name].push(a.value);
                return r;
            }, Object.create(null));
        
            const newMappedSelectTaxonomies = Object.keys(newDecodedSelectTaxonomies).map(function (key) {
                return {name: key, value: newDecodedSelectTaxonomies[key]};
            });

            //compute taxonomies to keep
            const taxonomiesToKeep = trainingRecord.taxonomies.filter(t=> !(newTax.map(t=>t.slug).includes(t.slug)));

            //compute select-taxonomies to keep
            const selectTaxonomiesToKeep = trainingRecord.selectTaxonomies.filter(t=>!(newMappedSelectTaxonomies.map(t=>t.name).includes(t.name)));

            const training: Training = { user_id: mongoose.Types.ObjectId(req.loggedUser._id), 
                description: page.notes,
                tacticalpad_publishing_id: page._id,
                taxonomies: newTax.concat(taxonomiesToKeep),
                category: mappedCategories as TrainingCategory[],
                selectTaxonomies: newMappedSelectTaxonomies.concat(selectTaxonomiesToKeep),
                visibility: trainingRecord.visibility,
                name: page.title};
            
            await trainingService.editTraining(trainingRecord._id, training);

        }
        
        return res.status(200).json({
            "page_upload_session_id": page._id
        });

    }catch(e){
        console.log(e.message);
        return res.status(400).send({ message: e.message });
    }

});

function slugify(input: string) : string{
    if (input)
    return input.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    else  
        return input;
}


router.post('/publishings/attach-file/:publishingId', isTacticalpadAuth,  upload.single('attached_file'), async (req, res) => {

    const tacticalpadService = new TacticalpadService();

    try {

        const publishingId = req.params.publishingId;

        const attachedFile : TrainingFile = {name: JSON.parse(req.body.parameters).attached_file_info.filename, path: (req as any).file.path };

        const attachedFileRecord = await tacticalpadService.attachFileToPublishing(publishingId, attachedFile);

        return res.status(200).json({});

    } catch (e) {

        console.log(e.message);
        return res.status(400).send({ message: e.message });
    }

});



router.post('/publishings/attach-board-file-content/:pageId', isTacticalpadAuth, upload.single('attached_file'), async (req, res) => {

    const tacticalpadService = new TacticalpadService();

    try {

        const pageId = req.params.pageId;

        const attachedFile : TrainingFile = {name: JSON.parse(req.body.parameters).attached_file_info.filename, path: (req as any).file.path };

        const attachedFileRecord = await tacticalpadService.attachFileToPage(pageId, attachedFile);

        return res.status(200).json({});

    } catch (e) {

        console.log(e.message);
        return res.status(400).send({ message: e.message });
    }

});


router.post('/publishings/commit/:publishingId', isTacticalpadAuth, upload.single('attached_file'), async (req, res) => {

    const tacticalpadService = new TacticalpadService();

    try {

        const publishingId = req.params.publishingId;

        const publishingRecord = await tacticalpadService.getPublishingById(publishingId);


        return res.status(200).json({
            "publishing_id": publishingRecord.int_id,
            "publishing_url": process.env.FRONT_END_URL + '/training/library',
        });

    } catch (e) {

        console.log(e.message);
        return res.status(400).send({ message: e.message });
    }

});

/**
 * Prepares the response for Tacticalpedia, given an array of FilterMapping objects
 * (representing categories w/ their int ids)
 * @param encodedCategories 
 * @returns 
 */
 async function prepareEncodedCategories(encodedCategories: FilterMapping[]) {

    const authService = new AuthService();

    let categoriesResponse = []

    // Insert first filter: category
    categoriesResponse.push({
        "id": 1,
        "name": "Category",
        "parent_id": -1,
        "filter_owner_id": -1,
        "scope": {
            "type":1,
        }
    });

    // Push the encoded categories
    categoriesResponse = categoriesResponse.concat(await Promise.all(encodedCategories.map(async (category) => {

        // Get owner int_id or -1 if it is admin category
        const owner_id = category.user_id ? (await authService.findById(category.user_id)).int_id : -1;

        let filter_obj = {
            "id": category.int_id,
            "name": category.value,
            "parent_id": 1,
            "filter_owner_id": owner_id
        }

        if (owner_id != -1) {
            filter_obj["scope"] = {
                "type": 3,
                "scope_owner_id": owner_id
            }
        }
        else {
            filter_obj["scope"] = {
                "type": 1
            }
        }

        return filter_obj;
    })));

    return categoriesResponse;
}



async function prepareEncodedSelectTaxonomies(selectTaxonomies) {

    const authService = new AuthService();

    let selectTaxonomiesResponse = [];

    selectTaxonomiesResponse = selectTaxonomiesResponse.concat(
        await Promise.all(
            selectTaxonomies.map( async (tax) => {

                let taxResponse = [];

                // Get owner int_id or -1 if it is admin category
                const owner_id = tax.name.user_id ? (await authService.findById(tax.name.user_id)).int_id : -1;

                // Push first entry representing the name of the taxonomy
                let tax_name_obj = {
                    "id": tax.name.int_id,
                    "name": tax.name.select,
                    "parent_id": -1,
                    "filter_owner_id": owner_id
                }
        
                if (owner_id != -1) {
                    tax_name_obj["scope"] = {
                        "type": 3,
                        "scope_owner_id": owner_id
                    }
                }
                else {
                    tax_name_obj["scope"] = {
                        "type": 1
                    }
                }

                taxResponse.push(tax_name_obj);


                // Push options of the select
                taxResponse = taxResponse.concat(
                    await Promise.all(
                        tax.options.map( async (option) => {

                            let tax_option_obj = {
                                "id": option.int_id,
                                "name": option.value,
                                "parent_id": tax.name.int_id,
                                "filter_owner_id": owner_id
                            }
                    
                            if (owner_id != -1) {
                                tax_option_obj["scope"] = {
                                    "type": 3,
                                    "scope_owner_id": owner_id
                                }
                            }
                            else {
                                tax_option_obj["scope"] = {
                                    "type": 1
                                }
                            }

                            return tax_option_obj;

                        })
                    )
                );

                return taxResponse; 

            })
        )
    );

    return selectTaxonomiesResponse.reduce((acc, val) => acc.concat(val), []);
}



/* OPTIONAL */
router.get('/publishings', async (req, res) => {
    return res.sendStatus(200);
});

router.get('/users', async (req, res) => {
    return res.sendStatus(200);
});

router.get('/groups', async (req, res) => {
    return res.sendStatus(200);
});

router.get('*', function(req, res){
    return res.sendStatus(404);
});



async function decodeFilter(filters, type) {

    const filterService = new FilterService();

    const filteredFields = await filter(filters, async (f) => {
        return (await filterService.decodeEncodedCategory(f)).type == type;
    });

    return await Promise.all(filteredFields.map(async cat => {
        return await filterService.decodeEncodedCategory(cat as number);
    }));

}

// The helper function
async function filter(arr, callback) {
    const fail = Symbol()
    return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i=>i!==fail)
  }

export default router
