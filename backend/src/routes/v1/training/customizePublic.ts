import express from 'express'
import UserDao from '../../../dao/UserDao';
import { TrainingCategory } from '../../../interfaces/training/training-category';
import { TrainingSelectTaxonomy } from '../../../interfaces/training/training-select-taxonomy';
import { TrainingTaxonomy } from '../../../interfaces/training/training-taxonomy';
import CustomizationService from '../../../services/customization';

const router = express.Router();

router.get('/customize/categories/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const user = await UserDao.getUserById(user_id);
        const categories = user.custom_categories;
        return res.status(200).json(categories ? categories : []);
    } catch(e) {
        return res.status(400).send('User not found');
    }
});


router.get('/customize/taxonomies/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const user = await UserDao.getUserById(user_id);
        const categories = user.custom_taxonomies;
        return res.status(200).json(categories ? categories : []);
    } catch(e) {
        return res.status(400).send('User not found');
    }
});


router.get('/customize/select-taxonomies/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const user = await UserDao.getUserById(user_id);
        const categories = user.custom_select_taxonomies;
        return res.status(200).json(categories ? categories : []);
    } catch(e) {
        return res.status(400).send('User not found');
    }
});

export default router;