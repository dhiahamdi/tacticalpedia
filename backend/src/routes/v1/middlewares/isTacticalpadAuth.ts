import AuthService from "../../../services/auth";

const jwt = require('jsonwebtoken');

const isTacticalpadAuth = (req, res, next) => {

    try{

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err: any, user: any) => {

            if (err) {
                console.log(err);
                return res.status(401).set('WWW-Authenticate', 'Bearer error="invalid_token" error_description="The access token expired"').json({
                    "error": "invalid_token",
                    "error_description": "The access token expired"  
                });
            }

            //get tacticalPedia user
            const authService = new AuthService()
            
            const userRecord = await authService.findByEmail(user.email);

            if (!userRecord) return res.sendStatus(401);

            //const userRecord = await authService.findByEmail('riccardoluigi.trinchieri@outlook.it');

            req.loggedUser = userRecord;

            next()
        })
    }catch(e){

        return res.sendStatus(401)
    }
}

export default isTacticalpadAuth;