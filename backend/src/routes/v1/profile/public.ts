import express from 'express';
import ProfileService from '../../../services/profile';
const fs = require('fs');


const router = express.Router();

/**
 * get profile from username
 */
 router.post('/from-username', async (req, res)=>{

    const profileService = new ProfileService();

    if (!req.body.username) return res.status(400).send({message: 'username missing'}); //TODO with validation
    
    try{
        const profile = await profileService.getProfileFromUsername(req.body.username);
        return res.status(200).send(profile);

    }catch(e){
        return res.status(404).send({message: e.message});
    }
});


/**
 * get user ID from username
 */
 router.post('/id-from-username', async(req, res) =>{

    const profileService = new ProfileService();

    try{
        const user_id = await profileService.getUserIdFromUsername(req.body.username);
        return res.status(200).send({user_id: user_id});

    }catch(e){

        res.status(400).send({message: e.message});
    }

});



router.post('/username/from-id', async (req, res)=>{

    const profileService = new ProfileService();

    console.log(req.body);

    try{

        const username = await profileService.getUsernameFromId(req.body.user_id);

        return res.status(200).send({username: username});


    }catch(e){

        return res.status(400).send({message: e.message});
    }

});

router.post('/full-name', async (req,res) =>{

    const profileService = new ProfileService();

    try{

        const fullname = await profileService.getFullNameFromId(req.body.user_id);

        return res.status(200).json({fullname: fullname});

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});


router.post('/picture/from-id', async (req, res)=>{

    const profileService = new ProfileService();

    try{

        const profilePic = await profileService.getProfilePicFromId(req.body.user_id);

        return res.status(200).sendFile(String(profilePic));


    }catch(e){

        return res.status(400).send({message: e.message});
    }

});

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    
    //return new Buffer(bitmap).toString('base64');
    return Buffer.from(bitmap).toString('base64');
}


router.post('/pictures/from-ids', async (req, res)=>{

    const profileService = new ProfileService();
    const ids = req.body.users ;

    try{
        //const images =  ids.map( async el => base64_encode(String(await profileService.getProfilePicFromId(el)) ))
        const imagesx = await Promise.all(ids.map( async (el) : Promise<string> => base64_encode(String(await profileService.getProfilePicFromId(el)) )))

        return res.status(200).send(imagesx);

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});

export default router;