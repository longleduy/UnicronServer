import jwt from 'jsonwebtoken'
import {genJWT} from '../utils/common'
export const refreshJWT = async (req,res,updateObject = {}) => {
        let jwtReq = req.headers.authorization;
        const token = jwtReq.replace("Beare ", "");
        const userInfo = await jwt.decode(token);
        delete userInfo["exp"];
        if(updateObject && Object.keys(updateObject).length !== 0){
            Object.keys(updateObject).forEach((v,k) => {
                const key = Object.entries(updateObject)[k][0];
                const value = Object.entries(updateObject)[k][1];
                if(value != null && userInfo[`${key}`]){
                    userInfo[`${key}`] = value;
                }
            })
        }
        const newJWT = await genJWT(userInfo,process.env.SECRET_KEY,'1h')
        res.set('Access-Control-Expose-Headers','x-refresh-token');
        res.set('x-refresh-token', newJWT);
}