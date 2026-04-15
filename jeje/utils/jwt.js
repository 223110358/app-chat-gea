import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";
const { JWT_SECRET } = process.env;
import { token } from "morgan";

function createAccessToken(user){
    const expToken=new Date();
    expToken.setHours(expToken.getHours()+24)
    const payload ={
        token_type:"access",
        user_id: user._id,
        iat:Date.now(),
        exp:expToken.getTime()
    };
    return jsonwebtoken.sign(payload,JWT_SECRET);
}
function createRefreshToken(user){
    const expToken =new Date();
    expToken.setMonth(expToken.getMonth()+1);
    const payload={
        token_type:"refresh",
        user_id: user._id,
        iat:Date.now(),
        exp: expToken.getTime()
    };
    return jsonwebtoken.sign(payload,JWT_SECRET)
}
function decoded (token){
    return jsonwebtoken.verify(token, JWT_SECRET);
}
function hasExpiredToken(token){
    const { exp } = decoded(token);
    const currentDate= new Date().getTime();
    if(exp <= currentDate){
        return true
    }else{
        return false
    }
}
export const jwt={
    createAccessToken,
    createRefreshToken,
    decoded,
    hasExpiredToken
}
