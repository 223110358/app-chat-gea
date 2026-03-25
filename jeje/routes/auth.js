import express from "express";
import{ AuthController } from "../controllers/index.js";
import { mdAuth } from "../middleware/index.js";
const api = express.Router();


//rutas o end points

api.post("/auth/register",AuthController.register)
api.post("/auth/login",AuthController.login)
api.post("/auth/refresh_access_token", AuthController.refreshAccessToken);
//api.get("/auth/test_md",[mdAuth.asureAuth],(req,res)=>{
   // console.log("Datos del usuario")
   // console.log(req.user)
   // console.log("gggggg")
   // res.status(200).send({msg:"ok middlware"})
//})

export const authRoutes=api