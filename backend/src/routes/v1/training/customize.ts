import express from 'express'
import UserDao from '../../../dao/UserDao';
import { TrainingCategory } from '../../../interfaces/training/training-category';
import { TrainingSelectTaxonomy } from '../../../interfaces/training/training-select-taxonomy';
import { TrainingTaxonomy } from '../../../interfaces/training/training-taxonomy';
import CustomizationService from '../../../services/customization';

const router = express.Router();


router.post('/customize/sync-categories', async (req, res) => {

    const customizationService = new CustomizationService();

    try {
        const categories: TrainingCategory[] = req.body;
        const userRecord = await customizationService.updateUserCategories(req.loggedUser, categories);

        return res.status(200).json({response: 'ok'});
        
    } catch(e) {
        return res.status(400).send('error-updating-account');

    }
    
});


router.get('/customize/categories', async (req, res) => {
    const categories = req.loggedUser.custom_categories;
    return res.status(200).json(categories ? categories : []);
});


router.post('/customize/sync-taxonomies', async (req, res) => {

    const customizationService = new CustomizationService();

    try {

        const taxonomies: TrainingTaxonomy[] = req.body;

        const userRecord = await customizationService.updateUserTaxonomies(req.loggedUser, taxonomies);

        return res.status(200).json({response: 'ok'});

    } catch(e) {
        return res.status(400).send('error-updating-account');
    }
});


router.get('/customize/taxonomies', async (req, res) => {
    return res.status(200).json(req.loggedUser.custom_taxonomies);
});


router.post('/customize/sync-select-taxonomies', async (req, res) => {

    const customizationService = new CustomizationService();

    try {
        const selectTaxonomies: TrainingSelectTaxonomy[] = req.body;

        const userRecord = await customizationService.updateUserSelectTaxonomies(req.loggedUser, selectTaxonomies);

        return res.status(200).json({response: 'ok'});

    } catch(e) {
        return res.status(400).send('error-updating-account');
    }
});


router.get('/customize/select-taxonomies', async (req, res) => {
    return res.status(200).json(req.loggedUser.custom_select_taxonomies);
});

export default router;