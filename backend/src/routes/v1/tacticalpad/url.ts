import express from 'express'
import TacticalpadService from '../../../services/tacticalpad/tacticalpad';

const router = express.Router();

const path = require('path');


/**
 * download url
 */
 router.get('/project/download/:id', async (req, res)=>{

    const tacticalpadService = new TacticalpadService();

    try{

        const projectId = req.params.id;

        const project = await tacticalpadService.getProjectByIntId(parseInt(projectId));

        return res.status(200).download(project.tacticalpedia_file_path, project.attached_file_info.filename);

    }catch(e){
        console.log(e);
        return res.status(400).send({message: e.message});
    }
})


/**
 * download url
 */
 router.get('/projects/:id/download-url', async (req, res)=>{
    const projectId = req.params.id;
    return res.status(200).json({url: process.env.BACK_END_URL + 'v1/tacticalpad/v1/project/download/'+projectId});
})


/**
 * thumbnail url
 */
 router.get('/project/thumbnail/:id', async (req, res)=>{

    const tacticalpadService = new TacticalpadService();

    try{

        const projectId = req.params.id;

        const thumbnail = await tacticalpadService.getProjectThumbnail(projectId);

        return res.status(200).download(thumbnail);

    }catch(e){
        console.log(e);
        return res.status(400).send({message: e.message});
    }
})

export default router
