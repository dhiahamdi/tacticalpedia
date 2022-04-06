import AuthService from "../../../services/auth";

const isTacticalpadAuthFake = async (req, res, next) => {

    /* TEST MIDDLEWARE, REMOVE IN PRODUCTION */

    try{   
        const authService = new AuthService()
        const userRecord = await authService.findByEmail('l.dimartino@polarispartner.com');
        req.loggedUser = userRecord;
        next()
        
    }catch(e){

        return res.sendStatus(401)
    }
}

export default isTacticalpadAuthFake;