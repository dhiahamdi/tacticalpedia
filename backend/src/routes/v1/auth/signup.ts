import express from 'express';

import { User, UserInput } from '../../../interfaces/user';
import AuthService from '../../../services/auth';
import FileManagerService from '../../../services/file-manager';


var upload = new FileManagerService('public').upload;


const router = express.Router();

/*
Signup routes
*/


router.post('/', upload.single('image'), async (req , res) => {

        const userInput = createUserInputFromRequest(req);

        const authService = new AuthService();

        try{
          
          const user = await authService.signup(userInput);
          return res.status(200).json(user);

        }catch(e){

          return res.status(400).send({message: e.message});
        }
    }
);

/*
Check if username or email is already taken
*/

router.post('/checkUsername', async (req , res) => {

  const authService = new AuthService();
  const user = await authService.findByUsername(req.body.username);

  if(!user) return res.status(200).json(false);

  return res.status(200).json(true);

}
);


router.post('/checkEmail', async (req , res) => {

  const authService = new AuthService();
  const user = await authService.findByEmail(req.body.email);

  if(!user) return res.status(200).json(false);

  return res.status(200).json(true);
}
);


// create inpt for service signup
function createUserInputFromRequest(req): UserInput{

    //check if user uploaded profile pic
    const file = (req as any).file;
    const imagePath = (!file) ? (null) : (file.path);

    const userInput: UserInput = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        lang: req.body.lang,

        profile:{
            name: req.body.name,
            surname: req.body.surname,
            address: req.body.address,
            discipline: req.body.discipline,
            role: req.body.role,
            qualification: req.body.qualification,
            image: imagePath
        }
    }

    return userInput

}

export default router;