import express from 'express'

const router = express.Router();

router.get('/status', async (req, res)=>{

    const user = req.loggedUser;

    res.status(200).json({paypal: user.paypal, stripe:user.stripe});

});

export default router;