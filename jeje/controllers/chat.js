import { Chat, ChatMessage } from "../models/index.js";

/**
 * Crear chat
 * - participant_one: viene del token (req.user)
 * - participant_two: viene del frontend
 * - Evita chats duplicados
 */
async function create(req, res) {
    const { user_id } = req.user;
    const { participant_id_two } = req.body;

    if (!participant_id_two) {
        return res.status(400).send({ msg: "participant_id_two es requerido" });
    }

    try {
        // Buscar si ya existe el chat (orden normal)
        const foundOne = await Chat.findOne({
            participant_one: user_id,
            participant_two: participant_id_two,
        });

        if (foundOne) {
            return res.status(200).send(foundOne);
        }

        // Buscar si existe en orden inverso
        const foundTwo = await Chat.findOne({
            participant_one: participant_id_two,
            participant_two: user_id,
        });

        if (foundTwo) {
            return res.status(200).send(foundTwo);
        }

        // Crear nuevo chat
        const newChat = new Chat({
            participant_one: user_id,
            participant_two: participant_id_two,
        });

        const chatStorage = await newChat.save();

        return res.status(200).send(chatStorage);

    } catch (error) {
        console.error("Error al crear el chat", error);
        return res.status(500).send({ msg: "Error interno en el servidor" });
    }
}

/**
 * Obtener todos los chats del usuario
 */
async function getAll(req, res) {
    try {
        const { user_id } = req.user;

        const chats = await Chat.find({
            $or: [
                { participant_one: user_id },
                { participant_two: user_id }
            ]
        })
            .populate("participant_one")
            .populate("participant_two");

        const arrayChats = [];

        for await (const chat of chats) {
            const lastMessage = await ChatMessage.findOne({ chat: chat._id })
                .sort({ createAt: -1 });

            arrayChats.push({
                ...chat._doc,
                last_message_date: lastMessage?.createAt || null,
            });
        }

        return res.status(200).send(arrayChats);

    } catch (error) {
        console.error("Error al obtener los chats", error);
        return res.status(500).send({
            msg: "Error interno del servidor al obtener los chats"
        });
    }
}

/**
 * Eliminar chat
 */
async function deleteChat(req, res) {
    const chat_id = req.params.id;

    try {
        const deleted = await Chat.findByIdAndDelete(chat_id);

        if (!deleted) {
            return res.status(404).send({ msg: "Chat no encontrado" });
        }

        return res.status(200).send({ msg: "Chat eliminado" });

    } catch (error) {
        console.error("[deleteChat] Error:", error);

        if (error.name === "CastError") {
            return res.status(400).send({ msg: "Id del chat no es válido" });
        }

        return res.status(500).send({
            msg: "Error en el servidor al eliminar el chat"
        });
    }
}

/**
 * Obtener un chat por ID
 */
async function getChat(req, res) {
    const chat_id = req.params.id;

    try {
        const chatStorage = await Chat.findById(chat_id)
            .populate("participant_one")
            .populate("participant_two");

        if (!chatStorage) {
            return res.status(404).send({ msg: "Chat no encontrado" });
        }

        return res.status(200).send(chatStorage);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Error al obtener chat" });
    }
}

export const ChatController = {
    create,
    getAll,
    deleteChat,
    getChat,
};