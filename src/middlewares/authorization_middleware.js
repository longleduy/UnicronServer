import jwt from 'jsonwebtoken'
import {AuthenticationError} from 'apollo-server-express'
import {refreshJWT} from '../middlewares/refresh_jwt'
export const authorizationMiddleWare = async (req,res,childFunction,args = null) => {
    return childFunction(args,req,res);
    let token;
    try {
        let jwtReq = req.headers.authorization;
        token = jwtReq.replace("Beare ", "");
        let payload = await jwt.verify(token, process.env.SECRET_KEY);
        let { email } = payload;
        let userInfo = req.session.user
        if (email != userInfo.email) {
            throw new Error('Bad token!');
        }
        return childFunction(args,req,res);
    } catch (error){
        if(error.name === "TokenExpiredError"){
           await refreshJWT(req,res,null)
        }
        else{
            console.log(error);
            throw new AuthenticationError(error.message);
        }
    }

}


