import "dotenv/config";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import mongoose from "mongoose";
import { server } from "./app.js";
import { io } from "./utils/socketServer.js";

const { MONGO_URI, PORT, IP_SERVER } = process.env;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI no está definido en .env");
    }

    await mongoose.connect(MONGO_URI);

    console.log("✅ Conexión exitosa a la base de datos");

    server.listen(PORT, () => {
      console.log("*******************");
      console.log("***********API REST***********");
      console.log("**********************");
      console.log(`http://${IP_SERVER}:${PORT}/api`);

      io.sockets.on("connection", (socket) => {
        console.log("usuario nuevo conectado");

        socket.on("disconnect", () => {
          console.log("Usuario desconectado");
        });

        socket.on("suscribe", (room) => {
          socket.join(room);
        });

        socket.on("unsuscribe", (room) => {
          socket.leave(room);
        });
      });
    });

  } catch (error) {
    console.error("❌ Error de conexión: ", error);
    process.exit(1);
  }
};

connectDB();