import express from "express"
import http from "http"
import { initSocketServer } from "./utils/socketServer.js"
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { authRoutes, userRoutes,ChatRoutes,ChatMessageRoutes, groupRoutes, groupMessageRoutes} from "./routes/index.js";


const app=express();
const server = http.createServer(app);
initSocketServer(server);
//configuracion de body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

//Configuracion de carpeta estatica
app.use("/uploads",express.static("uploads"))

// configuracion de las cabezeras HTTP
app.use(cors());
//Configuraion de morgan 
app.use(morgan("dev"));

app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",ChatRoutes)
app.use("/api",ChatMessageRoutes)
app.use("/api",groupRoutes)
app.use("/api",groupMessageRoutes)

export {server}