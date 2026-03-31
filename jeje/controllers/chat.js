import { Chat, ChatMessage } from "../models/index.js";

async function create(req,res) {
    const {participant_id_one, participant_id_two}= req.body;
    try{
        const existingChat = await Chat.findOne({
            $or: [
                { participant_one: participant_id_one, participant_two: participant_id_two },
                { participant_one: participant_id_two, participant_two: participant_id_one },
            ],
        });

        if (existingChat) {
            return res.status(200).send(existingChat);
        }

        const newChat = new Chat({
            participant_one:participant_id_one,
            participant_two:participant_id_two,
        });

        const chatStorage = await newChat.save();
        res.status(200).send(chatStorage);
    } catch(error) {
        console.error("Error al crear el servidor",error)
        res.status(500).send({msg:"Error interno en el servidor"})
    }
}

async function getAll(req,res) {
    try{
        const{ user_id }= req.user;
        const chats =await Chat.find({
            $or: [{ participant_one:user_id },{participant_two:user_id}]
        })
        .populate("participant_one")
        .populate("participant_two")
        const arrayChats=[];
        for await (const chat of chats){
            const response = await ChatMessage.findOne({chat:chat._id}).sort({
                createAt:-1
            })
            arrayChats.push({
                ...chat._doc,
                last_message_date: response?.createAt || null,
            })
        }
        res.status(200).send(chats)
    }catch(error){
        console.error("error al obtener los chats",error)
        return res.status(500).send({msg:"error interno del servidor al obtener los chats"})
    }
}
async function deleteChat(req,res) {
    const chat_id=req.params.id;

    Chat.findByIdAndDelete(chat_id).then(deleted=>{
        if(!deleted){
            return res.status(404).send({msg:"chat no encontrado"})
        }
        res.status(200).send({msg:"Chat eliminado"})
    })
    .catch(error=>{
        console.error('[deleteChat] Error: ',error)
        if(error.name=='CastError'){
            return res.status(400).send({msg:"Id del chat no es valido"})
        }
        res.status(500).semd({msg:"Error en el servidor al eliminar el chat"})
    })
}

async function getChat(req,res) {
    const chat_id = req.params.id;
    try{
        const chatStorage = await Chat.findById(chat_id)
        .populate("participant_one")
        .populate("participant_two")
        if(!chatStorage){
            return res.status(400).send({msg:"Chat no encontrado"})
        }res.status(200).send(chatStorage)
    }catch(error){
        console.log(error)
        res.status(500).send({msg:"Error al obtener chat"})

    }
}
export const ChatController={
    create,
    getAll,
    deleteChat,
    getChat,
}