import express from 'express'
import { LoginRequest } from '../../../../interfaces/login-request';
import { FilterMapping } from '../../../../interfaces/tacticalpad/filter-mapping';
import AuthService from '../../../../services/auth';
import ProfileService from '../../../../services/profile';
import FilterService from '../../../../services/tacticalpad/filter';
import isTacticalpadAuthFake from '../../middlewares/isTacticalpadAuthFake';

const jwt = require('jsonwebtoken');
const NodeRSA = require('node-rsa');

const router = express.Router();

router.post('/users/login', async (req, res) => {

    const authService = new AuthService();

    try {

        const loginRequest: LoginRequest = {
            email: req.body.email,
            password: req.body.password
        }

        const user = await authService.login(loginRequest);

        const payload = { email: user.email };

        const aToken = generateAccessToken(payload);
        const rToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {

            expiresIn: '365d' // expires in 365 days
 
       });

        //refreshTokensDB.push(rToken); // TODO store it	
        authService.pushRefreshToken(rToken);

        const loginResponse = {
            "id": 2,
            "name": user.profile.name + ' ' + user.profile.surname,
            "email": user.email,
            "member_info": "Coach", //user.profile.role,
            "photo_url": "https:\/\/media.sketchfab.com\/models\/0d121b54c66b40a3bcf83df607300ec5\/thumbnails\/e317c766d86347b8ab47f90f78c6bc55\/271e430a75f14a2aab2270f9083578f3.jpeg",
            "notification_email": true,
            "status": 1, // 1=inactive,2=registered, 3=active
            "access_level": 2, // 1=guest,2=user, 3=editor, 4=admin
            "created_at": new Date(user.createdAt).toISOString(),
            "updated_at": new Date(user.updatedAt).toISOString(),
            "type": "bearer",
            "accessToken": aToken,
            "refreshToken": rToken
        }

        return res.status(200).json(loginResponse);

    } catch (e) {

        console.log(e.message);

        return res.status(400).send({ message: e.message });
    }

});



// '/token' endpoint will accept the refresh token to generate new access token
router.post('/users/refresh-token/', (req, res) => {

    const authService = new AuthService();

    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) {
            res.json({ message: 'Invalid refresh token' });
        }

        const rToken = req.body.refreshToken;
        const rTokenResult = authService.getRefreshToken(rToken);

        if (!rTokenResult) {
            res.json({ message: 'Forbidden' });
        }

        jwt.verify(rToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                res.json({ message: 'Some error occured' });
            }
            else {

                const accessToken = generateAccessToken({ email: payload.email })

                res.json({ 
                    "accessToken": accessToken,
                    "refreshToken": rToken
                 });
            }
        });

    } catch (e) {
        return res.status(400).send({ message: e.message });
    }

});


router.post('/users/session-ping', (req, res) => {

    const data64 = req.body.data;

    try {

        const keyData = '-----BEGIN RSA PRIVATE KEY-----' + 
        'MIICWwIBAAKBgQC1cGw092J6xtN4+a871gz6itzZct2J+/25INUUTAa2af63pi7Z' +
        'vSQA51BLyZWASwegSh5iz3H7fTpuQTIzXQ8hAqFkadAu/XVr7a1t4dVjsmNfitRc' +
        'lF25Kzb4Wm/QmIIjxgAkM8K5eXEnycF4/dC079Hs3raW3VKdjeQQSHrRJwIDAQAB' +
        'AoGAT0l8j7zXdS2ztfbug6hrbYUHM6MFesn6u07ErqT2ffpdzCU77fzAYgCzTxsd' +
        'UL347CvXkXhzp+G2if3FkTqGZDqIkgO0od6AgtD530p/S7eWNflJzwki9rKb1F5P' +
        '5F7iFSLS6hLVM64yy9wawVWoKpkoyC3uy/MZyREY+JkxBFECQQDpjaQhcBuCATwk' +
        'HZTs3MSxqCSP1k7z2J7DZDiZd1p2jxVKDyv0s/LcZB2ENa37eKS42PsFfdflv77Y' +
        'cdqvoX8PAkEAxuCP8qVWk3yvRyfZtFjPbPtKScpWysYgOoQxza3ldYzwWiJSc1tF' +
        'Hx/9b7SGAaRs/P3ZYGCfjo2sy5QSjicMaQJAAMtxloeKIGwep0TOf+vUY4Jd9XtW' +
        'M3A2QhXyN1t3nFWqTeE1VhTSq7tPemawW92yOcrLN96QwIBhht0EUHqtMwJAc4wz' +
        'dlpDw+s0d1Ya8eKLmZki316VMLkOLpFx0juPzs11NBku6GEF9wCCIi2zki6zOAZR' +
        'DuL0sUF1PM6qPTdIyQJAQiCSBAq3KO2Kg8fXfJ3EvyXVL5ZM1rl8ZUEeA1xzthmd' +
        'vFaPmc5V+5FKuHcxfAN0B7UOQLUkUBjT5GtsjalMtw==' +
        '-----END RSA PRIVATE KEY-----';

        const key = new NodeRSA();

        key.setOptions({encryptionScheme: 'pkcs1'});
        key.importKey(keyData, 'pkcs1');

        const decrypted = key.decrypt(data64, 'utf8');

        res.status(200).json({result: decrypted});

    } catch (e) {
        console.log(e);
        return res.status(400).send({ message: e.message });
    }

});

export default router


// Following function will generate access token that will be valid for 2 minutes
function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' });
}
