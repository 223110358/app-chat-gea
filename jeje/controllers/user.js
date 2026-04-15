import {Group, User } from "../models/index.js";
import { getFilePath } from "../utils/index.js";
//fuciones del controlador
async function getMe(req, res) {
    const { user_id } = req.user;
    try {
        const response = await User.findById(user_id).select(["-password"])
        if (!response) {
            res.status(400).send({ msg: "no se encontro el usuario" })
        } else {
            res.status(200).send(response)
        }
    } catch {
        res.status(500).send({ msg: "error del servidor" })
    }
}
async function getUsers(req, res) {
    try {
        const {user_id}=req.user;
        const users = await User.find({_id: {$ne:user_id}}).select(["-password"]);
        if (!users) {
            res.status(400).send({ msg: "No se han encontrado usuarios" })
        } else {
            res.status(200).send(users);
        }
    } catch (error) {
        res.status(500).send({ msg: "error en el servidor" })
    }
}
async function getUser(req,res) {
    const {id}= req.params;
    try{
        const response = await User.findById(id).select(["-password"])
        if(!response){
            res.status(400).send({msg:"Error en el servidor"})
        }else{
            res.status(200).send(response)
        }
    }catch(error){
        res.status(500).send({msg:"Error en el servidor"})
    }
}
async function updateUser(req,res) {
    const {user_id}= req.user;
    const userData = req.body;

   try{
        if(req.files && req.files.avatar){
            const file = Array.isArray(req.files.avatar)
            ? req.files.avatar[0]
            : req.files.avatar;
            console.log("file",JSON.stringify(file))
        const imagePath= getFilePath(file)
        console.log("imagePath",imagePath)
        userData.avatar=imagePath
        }
        const response = await User.findByIdAndUpdate(user_id,userData,{new:true});
        if(!response){
            res.status(400).send({msg:"Usuario no encontrado"})
        }else{
            res.status(200).send(response)
        }
    }catch(error){
        res.status(500).send({msg:"Error en el servidor"})
   }

}

async function getUsersExeptParticipantsGroup(req,res) {
    const { group_id } = req.params;
    try {
        const group = await Group.findById(group_id);
        if (!group) {
            return res.status(404).send({ msg: "Grupo no encontrado" });
        }
        const response = await User.find({ _id: { $nin: group.participants } }).select("-password");
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ msg: "Error en el servidor" });
    }
}
export const UserController = {
    getMe,
    getUsers,
    getUser,
    updateUser,
    getUsersExeptParticipantsGroup
};
