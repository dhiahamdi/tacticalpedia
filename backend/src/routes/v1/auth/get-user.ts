import express from 'express';
import AuthService from '../../../services/auth';

const router = express.Router();

router.get('/', async (req, res) => {

    try{
        res.status(200).json(req.loggedUser);

    } catch(e) {
      console.log(e.message);
      return res.status(400).send({message: e.message});
    }
  }
);

export default router;