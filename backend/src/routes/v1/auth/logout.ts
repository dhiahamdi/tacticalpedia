import express from 'express'

const router = express.Router();

router.post('/', (req,res) =>{
    
    res.clearCookie('login');

    res.status(200).json({response: 'logged_out'});

});

export default router