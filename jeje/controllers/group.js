import mongoose from "mongoose";
import { Group, GroupMessage, User } from "../models/index.js";
import { getFilePath } from "../utils/index.js";
import { request } from "express";

async function create(req,res) {
    const group = new Group(req.body)
    group.creator = req.user.user_id
    let participants = JSON.parse(req.body.participants);
    participants.push(req.user.user_id);
    group.participants=participants
    if (req.files.image){
        const imagePath = getFilePath(req.files.image)
        group.image=imagePath
    }
    group.save()
    .then(groupStorage=>{
        if(!groupStorage){
            res.status(400).send({msg:"Error al crear el grupo"})
        }else{
            res.status(201).send(groupStorage)
        }
        })
    .catch( error =>{
       res.status(500).send({msg:"Error en el servidor"})
    }
    ) 
}
async function getAll(req,res) {
    const {user_id}=req.user;
    try{
        const userIdObjectId=new mongoose.Types.ObjectId(user_id)
        const groups = await Group.find({participants:userIdObjectId})
            .populate("creator")
            .populate("participants")
            .exec()
            const arrayGroups=[];
            for(const group of groups) {
                const response = await GroupMessage.findOne({group:group._id})
                .sort({createdAt:-1})
                arrayGroups.push({
                    ...group._doc,
                    last_message_date:response ? response.createdAt :null
                })
            }
        res.status(200).send(arrayGroups)
        console.log(groups)
    }catch(error){
        console.error(error)
        res.status(500).send({msg:"Error al obtener los grupos"})
    }
}
async function getGroup(req,res) {
    const group_id=req.params.id;
    try {
        const groupStorage = await Group.findById(group_id)
        .populate("creator")
        .populate("participants")
        .exec()
        if (!groupStorage) {
            return res.status(400).send({msg:"Nose puede obtener informacion, ID inexistente"})
        }
        res.status(200).send(groupStorage)
    } catch (error) {   
        console.error("Error al buscar el grupo",error)
        if (error.name=="CastError") {
            return res.status(400).send({msg:"Formato no de ID valido"})
        }
        res.status(500).send({msg:"Error del servidor"})
    }
}
async function updateGroup(req,res) {
    const {id}=req.params;
    const {name} = req.body;
    const updateData={}
    try {
        if (name) {
           updateData.name=name; 
        }
        if(req.files&& req.files.image){
            const imagePath = getFilePath(req.files.image)
            updateData.image=imagePath
        }
        const updatedGroup = await Group.findByIdAndUpdate(id,updateData,{new:true});
        if (!updatedGroup) {
            return res.status(400).send({msg:"Grupo no encontrado"});
        }
        res.status(200).send({image:updatedGroup.image,name:updatedGroup.name});
    } catch (error) {
        console.error("Error al actualizar el grupo",error);
        if (error.name=="CastError") {
            return res.status(400).send({msg:"Formato no de ID valido"})
        }
        res.status(500).send({msg:"Error del servidor al actualizar"})
    }
}

async function exitGroup(req,res) {
    const {id} = req.params;
    const {} = req.user;
    try{
       const group = await Group.findById(id);
       if(!group){
        return res.status(400).send({msg:"Grupo no encontrado"})
       }
       group.participants = group.participants.filter(
        participants => participants.groupString() != user_id.toString()
       );
       await group.save();
       res.status(200).send({msg:"Salida Exitosa"});
    }catch(error){
        console.error("Error al salir del grupo",error)
        res.status(500).send({msg:"Error al salir del servidor para salir del grupo"})
    }
    const newParticipants = group.participants.filter((participants) =>
     console.log(participants.toString())) 
   
    
}

async function addParticipants(req,res) {
    const{id}=req.params;
    const {users_id}=req.body;
    const group=await Group.findById(id)
    const users=await User.find({_id:users_id})
    const arrayObjectIds=[]
    users.forEach((user)=>{
        arrayObjectIds.push(user._id)
    })
    if(!group){
        return res.status(404).json({message:"Grupo no encontrado"})
    };
    const newData={
        ...group.doc,
        participants:[...group.participants,...arrayObjectIds]
    };
    await Group.findByIdAndUpdate(id,newData)
    res.status(200).send({message:"Participantes agregados correctemente"})

}

async function banParticipants(req,res) {
    const {group_id, user_id} = req.body;
    const group = await Group.findById(group_id);
    const newParticipants = group.participants.filter(
        (participant) => participant.toString() !==user_id
    );
    const newData = {
        ...group._doc,
        participants:newParticipants
    }
    await Group.findByIdAndUpdate(group_id, newData);
    res.status(200).send({msg: "Usuario Eliminado"})

    
}





export const GroupController ={
    create,
    getAll,
    getGroup,
    updateGroup,
    exitGroup,
    addParticipants,
    banParticipants
}