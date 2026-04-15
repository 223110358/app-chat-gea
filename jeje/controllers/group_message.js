import { GroupMessage } from "../models/index.js";

import { io,getFilePath } from "../utils/index.js";

async function sendText(req,res) {
    const { group_id,message}=req.body;
    const {user_id}=req.user;
    const group_message = new GroupMessage({
        group:group_id,
        user:user_id,
        message,
        type:"TEXT"
    });
    try {
        await group_message.save()
        const data = await group_message.populate("user");
        io.sockets.in(group_id).emit("message",data);
        io.sockets.in(`${group_id}_notify`).emit("message_notify",data)
        res.status(201).send({})
    } catch (error) {
        console.error("Error al guardar el mensaje",error)
        res.status(400).send({msg:"Error del servidor"})
    }
}

async function sendImage(req,res) {
    const { group_id}=req.body;
    const {user_id}=req.user;
    const group_message = new GroupMessage({
        group:group_id,
        user:user_id,
        message:getFilePath(req.files.image),
        type:"IMAGE"
    });
     try {
        await group_message.save()
        const data = await group_message.populate("user");
        io.sockets.in(group_id).emit("message",data);
        io.sockets.in(`${group_id}_notify`).emit("message_notify",data)
        res.status(201).send({})
    } catch (error) {
        console.error("Error al guardar el mensaje",error)
        res.status(400).send({msg:"Error del servidor"})
    }
  
    
}


async function getAll(req,res) {
    const {group_id} = req.params;
    try{
        const message = await GroupMessage.find({group:group_id})
        .sort({createdAt:1})
        .populate("user");
        const total = await GroupMessage.countDocuments({group: group_id});
        res.status(200).send({message, total})
    }catch(error){
        res.status(500).send({msg:"Error en el servidor"})
    }
    
}


async function getLastMessage(req,res) {
    const {group_id} = req.params;
    try{
        const response = await GroupMessage.findOne({group:group_id})
        .sort({createdAt:-1})
        .populate("user");
        res.status(200).send(response || {})
    }catch(error){
        res.status(500).send({msg:"Error en el servidor"})
    }

}

export const GroupMessageController={
    sendText,
    sendImage,
    getAll,
    getLastMessage
}
