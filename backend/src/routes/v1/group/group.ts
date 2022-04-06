import express from 'express'
import { Group } from '../../../interfaces/groups/Group';
import FileManagerService from '../../../services/file-manager';
import GroupService from '../../../services/Group';
import ManageUsersService from '../../../services/manage-users';

const router = express.Router()

var upload = new FileManagerService('Group').upload;

router.post('/insert', async (req, res) => {

    const groupService = new GroupService();

    try {

        // req.body.user_id = req.loggedUser._id;

        const new_group = req.body as Group;
        if (req.loggedUser) {
            new_group.authors = [...new_group.authors, req.loggedUser._id]
        }

        const group = await groupService.insertGroup(new_group);

        return res.status(200).json({ GroupId: group._id });

    } catch (e) {

        return res.status(400).send({ message: e.message });
    }

});


router.post('/edit', async (req, res) => {

    const groupService = new GroupService();

    try {

        // req.body.user_id = req.loggedUser._id;
        //.body.draft = false;

        const GroupId = await groupService.editGroup(req.body._id, req.body as Group);

        return res.status(200).json({ GroupId: GroupId });


    } catch (e) {

        return res.status(400).send({ message: e.message });
    }

});

router.get('/search-author/:email', async (req, res) => {

    const userService = new ManageUsersService();

    try {

        // req.body.user_id = req.loggedUser._id;
        //.body.draft = false;

        const user = await userService.searchUserByMail(req.params.email);

        return res.status(200).json(user);


    } catch (e) {

        return res.status(400).send({ message: e.message });
    }

});


router.post('/add-author', async (req, res) => {

    const groupService = new GroupService();

    try {

        // req.body.user_id = req.loggedUser._id;
        //.body.draft = false;

        const GroupId = await groupService.addGroupAuthor(req.body.group_id, req.body.user_id);

        return res.status(200).json({ GroupId: GroupId });


    } catch (e) {

        return res.status(400).send({ message: e.message });
    }

});

router.post('/add-training', async (req, res) => {

    const groupService = new GroupService();

    try {

        // req.body.user_id = req.loggedUser._id;
        //.body.draft = false;

        const GroupId = await groupService.addGroupTraining(req.body.group_id, req.body.taining_id);

        return res.status(200).json({ GroupId: GroupId });


    } catch (e) {

        return res.status(400).send({ message: e.message });
    }

});

router.post('/add-subs', async (req, res) => {

    const groupService = new GroupService();

    try {

        // req.body.user_id = req.loggedUser._id;
        //.body.draft = false;

        const GroupId = await groupService.addGroupSubscription(req.body.group_id, req.body.user_id);

        return res.status(200).json({ GroupId: GroupId });


    } catch (e) {

        return res.status(400).send({ message: e.message });
    }

});

router.post('/delete', async (req, res) => {

    const groupService = new GroupService();

    try {

        await groupService.deleteGroups(req.body.GroupIds);

        return res.status(200).json({ response: 'Group deleted' });


    } catch (e) {

        return res.status(400).send({ message: e.message });
    }
});




router.post('/add-images', upload.array('file', 25), async (req, res) => {


    const groupService = new GroupService();

    try {
        let imagePaths = []

        for (let file of (req as any).files) {
            imagePaths = [...imagePaths, String(file.path)];
        }

        await groupService.addImagesToGroup(req.body._id, imagePaths[0]);

        return res.status(200).json({ response: 'image added to Group' });

    } catch (e) {

        return res.status(400).send({ message: e.message });
    }

});


router.post('/delete-imgs', async (req, res) => {

    const groupService = new GroupService();

    try {

        await groupService.deleteImagesFromGroup(req.body._id);

        return res.status(200).json({ response: 'images deleted from Group' });

    } catch (e) {

        return res.status(400).send({ message: e.message });
    }
})


router.get('/list', async (req, res) => {

    const groupService = new GroupService();

    try {

        const Groups = await groupService.getGroups();

        return res.status(200).json(Groups ? Groups : []);


    } catch (e) {

        res.status(400).send({ message: e.message });
    }

});

router.post('/img' ,  async (req, res) => {

    try{

        return res.status(200).sendFile(String(req.body.imagePath));

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});






export default router