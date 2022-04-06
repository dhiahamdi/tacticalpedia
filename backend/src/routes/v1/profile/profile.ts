import express from 'express'
import { Profile } from '../../../interfaces/profile';
import { User } from '../../../interfaces/user';
import FileManagerService from '../../../services/file-manager';
import ProfileService from '../../../services/profile';

const router = express.Router();

var upload = new FileManagerService('public').upload;

/*
Routes
*/

router.get('/', async (req, res)=>{

    const profileService = new ProfileService();
    
    try{
        const profile = await profileService.getProfile(req.loggedUser);
        return res.status(200).send(profile);
    
    }catch(e){

        return res.status(400).send({message: e.message});
    }
});


router.get('/picture', async (req, res)=>{

    const profileService = new ProfileService();

    try{
        const profilePic = await profileService.getProfilePic(req.loggedUser);

        if(!profilePic) throw new Error('IMAGE_NOT_FOUND');

        return res.status(200).sendFile(String(profilePic));

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});

router.post('/update', upload.single('image'), async (req, res)=> {

    const profileService = new ProfileService();

    try{

        const newProfile = getNewProfileFromRequest(req);

        await profileService.updateProfile(req.loggedUser, newProfile);

        return res.status(200).json({response: 'profile_update'});

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});

router.post('/update-password', async (req, res)=> {

    const profileService = new ProfileService();

    try{
        const oldPassword = req.body.oldPassword;
        const password = req.body.pass;

        await profileService.updatePassword(req.loggedUser, oldPassword, password);

        return res.status(200).json({response: 'password_updated'});

    }catch(e){

        return res.status(400).send({message: e.message});
    }
});

router.get('/can-publish', async (req, res) =>{

    const profileService = new ProfileService();

    try{
        const canPusblish = await profileService.canPublish(req.loggedUser);
        return res.status(200).send({canPublish: canPusblish});

    }catch(e){
        return res.status(400).send({message: e.message});
    }

});


router.get('/lang', async (req, res) =>{
        const lang = req.loggedUser.lang ? req.loggedUser.lang : 'en'; 
        return res.status(200).send(lang);
});


router.post('/lang', async (req, res) =>{

    const profileService = new ProfileService();

    try{
        const canPusblish = await profileService.setLang(req.loggedUser, req.body.lang);
        return res.sendStatus(200);

    }catch(e){
        return res.status(400).send({message: e.message});
    }

});

function getNewProfileFromRequest(req): Profile{

    //check if user uploaded profile pic
    const file = (req as any).file;
    const imagePath = (!file) ? (null) : (file.path);

    let newProfile: Profile ={
        name: req.body.name,
        surname: req.body.surname,
        address: req.body.address,
        discipline: req.body.discipline,
        role: req.body.role,
        qualification: req.body.qualification,
    }

    if (file)
        newProfile['image'] = file.path;
        
    return newProfile;
}


export default router