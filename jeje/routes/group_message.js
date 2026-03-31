import express from "express";
import multiparty from "connect-multiparty";
import path from "path";
import fs from "fs";
import { GroupController, GroupMessageController} from "../controllers/index.js";
import { mdAuth } from "../middleware/index.js";

const groupImageUploadDir = path.join(process.cwd(), "uploads", "images");
if (!fs.existsSync(groupImageUploadDir)) {
    fs.mkdirSync(groupImageUploadDir, { recursive: true });
}

const mdUpload = multiparty({ uploadDir: groupImageUploadDir });

const api=express.Router();
api.post("/group/message",[mdAuth.asureAuth],GroupMessageController.sendText);
api.post("/group/message/image",[mdAuth.asureAuth,mdUpload],GroupMessageController.sendImage);
api.get("/group/message/:group_id",[mdAuth.asureAuth],GroupMessageController.getAll);
api.get("/group/message/last/:group_id",[mdAuth.asureAuth],GroupMessageController.getLastMessage);

export const groupMessageRoutes=api;