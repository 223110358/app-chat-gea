import { io } from "socket.io-client";
import { ENV } from "./constas";

export let socket = null;

export function initSockets() {
    socket = io(ENV.SOCKET_URL);
}