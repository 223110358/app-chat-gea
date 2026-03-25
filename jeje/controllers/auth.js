import { User } from "../models/index.js";
import bcrypt from "bcryptjs"
import { jwt } from "../utils/index.js";

async function register(req, res) {
    try {
        const { email, password } = req.body;
        const user = new User({
            email: email.toLowerCase(),
        });

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        user.password = hashPassword;
        const userStorage = await user.save();
            res.status(201).send(userStorage);
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: "Error al registrar el usuario" });
    }

}

async function login(req,res) {

    try{
        const {email,password}=req.body;
        
        // Validar que email y password se reciban
        if (!email || !password) {
            return res.status(400).send({msg:"Email y contraseña son requeridos"})
        }
        
        const emaillowerCase= email.toLowerCase();
        const userStorage = await User.findOne({email: emaillowerCase})
        if (!userStorage){
            return res.status(404).send({msg:"Usuario no encontrado"})
        }
        const passwordMatch= await bcrypt.compare(password,userStorage.password);
        if(!passwordMatch){
            return res.status(400).send({msg:"Contraseña incorrecta"})
        }
        res.status(200).send({access: jwt.createAccessToken(userStorage),refresh:jwt.createRefreshToken(userStorage)})
    }catch(error){
        console.error("❌ Error en login:", error.message);
        console.error("Stack:", error.stack);
        res.status(500).send({msg: "Error en el servidor", error: error.message})
    }
    
}

async function refreshAccessToken(req,res) {
    const{refreshToken}=req.body;
    if(!refreshToken)res.status(400).send({msg:"token requerido"})
    const hasExpired = jwt.hasExpiredToken(refreshToken);
    if(hasExpired){
        return res.status(400).send({msg:"Token expirado"})
    }
    const {user_id}= jwt.decoded(refreshToken)
    try{
        const userStorage =await User.findById(user_id)
        if(!userStorage){
            return res.status(400).send({msg:"Usuario no encontrado"})
        }
        return res.status(200).send({accessToken: jwt.createAccessToken(userStorage)})
    }catch(error){
        return res.status(500).send({msg:"Error del servidor",error:error.message})
    }
    res.status(200).send({msg:"OK refresh"})
}

export const AuthController = {
    register,
    login,
    refreshAccessToken
};



