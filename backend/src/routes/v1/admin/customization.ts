import express from 'express'
import isAdmin from '../middlewares/isAdmin';

import AdminDao from '../../../dao/AdminDao';
import UserDao from '../../../dao/UserDao';
import { TrainingCategory } from '../../../interfaces/training/training-category';
import { TrainingSelectTaxonomy } from '../../../interfaces/training/training-select-taxonomy';
import { TrainingTaxonomy } from '../../../interfaces/training/training-taxonomy';
import CustomizationService from '../../../services/customization';




const router = express.Router();


router.post('/customize/sync-categories', isAdmin,  async (req, res) => {

    const customizationService = new CustomizationService();

    try {
        const categories: TrainingCategory[] = req.body;

        const adminRecord = await customizationService.syncAdminCategories(categories);
        
        return res.status(200).json({response: 'ok'});

    } catch(e) {

        return res.status(400).send('error-updating-configuration');
    }
    
});


router.get('/customize/categories', async (req, res) => {

    const customizationService = new CustomizationService();

    try {

        const categories = await customizationService.getAdminCategories();

        return res.status(200).json(categories ? categories : []);

    } catch(e) {
        return res.status(400);
    }
    
});


router.post('/customize/sync-taxonomies', isAdmin, async (req, res) => {

    const customizationService = new CustomizationService();

    try {

        const taxonomies: TrainingTaxonomy[] = req.body;

        const adminRecord = await customizationService.syncAdminTaxonomies(taxonomies);

        return res.status(200).json({response: 'ok'});
        
    } catch(e) {
        return res.status(400).send('error-updating-configuration');
    }
    
});


router.get('/customize/taxonomies', async (req, res) => {
    
    const customizationService = new CustomizationService();

    try {
        const taxonomies = await customizationService.getAdminTaxonomies();
        return res.status(200).json(taxonomies ? taxonomies : []);

    } catch(e) {
        return res.status(400);
    }
    
});


router.post('/customize/sync-select-taxonomies', isAdmin, async (req, res) => {

    const customizationService = new CustomizationService();

    try {
        const selectTaxonomies: TrainingSelectTaxonomy[] = req.body;

        const adminRecord = await customizationService.updateAdminSelectTaxonomies(selectTaxonomies);

        return res.status(200).json({response: 'ok'});

    } catch(e) {
        return res.status(400).send('error-updating-configuration');
    }

});


router.get('/customize/select-taxonomies', async (req, res) => {

    const customizationService = new CustomizationService();

    try {
        const taxonomies = await customizationService.getAdminSelectTaxonomies();
        return res.status(200).json(taxonomies ? taxonomies : []);

    } catch(e) {
        return res.status(400);
    }
      
});

export default router;