import express from 'express'
import ManageUsersService from '../../../services/manage-users';

const router = express.Router();

var multer  = require('multer');

const path = require('path');

var storage = multer.diskStorage({

	destination: function (req, file, cb) {
	  cb(null, path.dirname(require.main.filename) + '/uploads/public');
	},
	filename: function (req, file, cb) {
	  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
	  cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
	}
  });


var upload = multer({ storage: storage });

router.get('/users', async(req, res)=> {

    const manageUsersService = new ManageUsersService();

    try{
        const users = await manageUsersService.getUsers();
        res.status(200).json(users);

    }catch(e){

        res.status(400).send({message: e.message});
    }

});


router.get('/user/:id', async(req, res)=> {

    const manageUsersService = new ManageUsersService();

    try{
        const user = await manageUsersService.getUser(req.params.id);
        res.status(200).json(user);

    }catch(e){

        res.status(400).send({message: e.message});
    }

});


router.post('/update-user', upload.single('image'), async(req, res)=> {

    const manageUsersService = new ManageUsersService();

    try{
        const user = await manageUsersService.updateUser(req.body);
        res.status(200).json(user);

    }catch(e){

        res.status(400).send({message: e.message});
    }

});


router.post('/user/delete', async(req, res)=> {

    console.log(req.body);
    
    const manageUsersService = new ManageUsersService();

    try{
        const result = await manageUsersService.deleteUser(req.body.user_id, req.body.new_user_id);
        res.status(200).json(result);

    }catch(e){
        res.status(400).send({message: e.message});
    }

});

export default router;