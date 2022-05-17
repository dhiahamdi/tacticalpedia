import express from 'express';
import { LoginRequest } from '../../../interfaces/login-request';
import AuthService from '../../../services/auth';

const router = express.Router();

router.post('/', async (req, res) => {

    const authService = new AuthService();

    try{
      
      const loginRequest = getLoginInfoFromRequest(req);
      
      const user = await authService.login(loginRequest);
      
      if(req.body.remember) res.cookie('login', user.cookie);

      else res.cookie('login', user.cookie, { maxAge: 900000*6 });

      return res.status(200).json(user);

    }catch(e){
      
      console.log(e);
      return res.status(400).send({message: e.message});
    }
  }
);

function getLoginInfoFromRequest(req): LoginRequest{
  
  const loginRequest = {
    email: req.body.email,
    password: req.body.pass
  }

  return loginRequest;
}

export default router;