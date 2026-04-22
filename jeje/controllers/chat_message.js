import { ChatMessage } from "../models/index.js";
import { io,getFilePath } from "../utils/index.js";
async function send(req, res) {
    const { chat_id, message } = req.body;
    const { user_id } = req.user;
    const chat_message = new ChatMessage({
        chat: chat_id,
        user: user_id,
        message,
        type: "TEXT"
    });
    try {
        await chat_message.save();
        const data= await chat_message.populate("user")
        io.sockets.in(chat_id).emit("message",data);
        io.sockets.in(`${chat_id}_notify`).emit("message_notify",data)
        res.status(201).send({ msg: "Mensaje enviado exitosamente" });
    }catch (error) {
        console.error("Error al guardar el mensaje:", error)
        res.status(400).send({ msg: "Error al enviar el mensaje", detail: error.message })

    }
}
async function sendImage(req,res) {
    const {chat_id}= req.body;
    const {user_id}=req.user;
    
    // Validar que la imagen existe
    if (!req.files || !req.files.image) {
        return res.status(400).send({msg: "No se encontró archivo de imagen"});
    }
    
    // multiparty devuelve un array, tomar el primer elemento
    const imageFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
    
    if (!imageFile || !imageFile.path) {
        return res.status(400).send({msg: "Archivo de imagen inválido"});
    }
    
    const chat_message= new ChatMessage({
        chat:chat_id,
        user:user_id,
        message:getFilePath(imageFile),
        type:"IMAGE"
    })
    try{
        await chat_message.save();
        const data = await chat_message.populate("user")
        io.sockets.in(chat_id).emit("message",data);
        io.sockets.in(`${chat_id}_notify`).emit("message_notify",data)
        res.status(200).send({msg:"Mensaje con imagen enviado exitosamente",data})
    }catch(error){
        console.error("error al guardar el mensaje:",error);
        res.status(400).send({msg:"Error al enviar el mensaje con imagen",details:error.message})
    }
}

async function getAll(req,res) {
    const { chat_id } = req.params;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(10, Math.min(100, parseInt(req.query.limit, 10) || 30));

    try {
        const skip = (page - 1) * limit;
        const total = await ChatMessage.countDocuments({ chat: chat_id });

        const messages = await ChatMessage.find({ chat: chat_id })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .populate("user");

        res.status(200).send({
            messages,
            page,
            limit,
            total,
            hasMore: skip + messages.length < total,
        });
    } catch(error){
        console.error("Error al obtener mensajes:", error);
        res.status(500).send({msg:"Error en el servidor"})
    }
}
async function getTotalMessage(req,res) {
    const {chat_id}=req.params;
    try{
        const total = await ChatMessage.countDocuments({chat:chat_id});
        res.status(200).send({TotalMensajes:total})    
    }catch(error){
        console.error("Error al contar los mensajes",error)
        res.status(500).send({msg:"Error al contar los mensajes ",error})
    }
}

async function getLastMessage(req,res) {
    const {chat_id}=req.params;
    try{
        const response = await ChatMessage.findOne({chat:chat_id}).sort({
            createat:-1
        });
        res.status(200).send(response || {});
    }catch (error){
        res.status(500).send({msg:"Error del servidor al solicitar el untimo mensaje"})
    }
}

export const ChatMessageController = {
    send,
    sendImage,
    getAll,
    getTotalMessage,
    getLastMessage
}