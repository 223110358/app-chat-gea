const SERVER_IP = "localhost:8004"

export const ENV = {
    SERVER_IP: SERVER_IP,
    BASE_PATH: `http://${SERVER_IP}`,
    API_URL: `http://${SERVER_IP}/api`,
    SOCKET_URL: `http://${SERVER_IP}`,
    ENDPOINTS: {
        AUTH: {
            REGISTER: "auth/register",
            LOGIN: "auth/login",
            REFRESH_ACCESS_TOKEN: "auth/refresh_access_token",
        },
        ME: "user/me",
        USER: "user/",
        UPDATE_AVATAR: "user/me",
        UPDATE_USER: "user/me",
        CHAT: "chat",
        CHAT_MESSAGE: "chat/message",
        CHAT_MESSAGE_TOTAL: "chat/message/total",
        CHAT_MESSAGE_LAST: "chat/message/last",
    },
    JWT: {           // ← esto faltaba
        ACCESS: "access",
        REFRESH: "refresh",
    }
};