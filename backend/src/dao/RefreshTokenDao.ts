import refreshTokenModel from "../models/refresh-token";

export default class RefreshTokenDao {

    constructor(){}

    public static async push(refreshToken: string): Promise<any> {

        let result = await refreshTokenModel.create({refreshToken: refreshToken});

        if (!result) return false;
    
        return result;
    }


    public static async getRefreshToken(refreshToken: string): Promise<any> {

        let result = await refreshTokenModel.findOne({refreshToken: refreshToken});

        if (!result) return false;
    
        return result;
    }


    
 }