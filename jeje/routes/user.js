import express from "express";
import multiparty from "connect-multiparty";
import fs from "fs";
import path from "path";
import { UserController } from "../controllers/index.js";
import { mdAuth } from "../middleware/index.js";

const uploadDir = path.resolve("./uploads/avatar");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const mdUpload = multiparty({uploadDir})
const api = express.Router()

// aqui van mis endpoints
api.get("/user/me", [mdAuth.asureAuth], UserController.getMe);
api.patch("/user/me",[mdAuth.asureAuth,mdUpload],UserController.updateUser)
api.get("/user", [mdAuth.asureAuth],UserController.getUsers);
api.get("/user/:id",[mdAuth.asureAuth], UserController.getUser);
api.get("/users_except_participants_group/:group_id",[mdAuth.asureAuth],UserController.getUsersExeptParticipantsGroup)

export const userRoutes = api;