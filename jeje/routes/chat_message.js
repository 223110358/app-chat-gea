import express from "express"
import multiparty from "connect-multiparty"
import fs from "fs"
import path from "path"
import { ChatMessageController } from "../controllers/index.js"
import { mdAuth } from "../middleware/index.js"

const uploadDir = path.resolve("./uploads/image");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const mdUpload = multiparty({ uploadDir });
const api = express.Router();

api.post("/chat/message",[mdAuth.asureAuth],ChatMessageController.send)
api.post("/chat/message/image",[mdAuth.asureAuth,mdUpload],ChatMessageController.sendImage)
api.get("/chat/message/:chat_id",[mdAuth.asureAuth],ChatMessageController.getAll)
api.get("/chat/message/total/:chat_id",[mdAuth.asureAuth],ChatMessageController.getTotalMessage)
api.get("/chat/message/last/:chat_id",[mdAuth.asureAuth],ChatMessageController.getLastMessage)

export const ChatMessageRoutes=api;