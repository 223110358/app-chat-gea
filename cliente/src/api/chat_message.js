import { ENV } from "../Utils/constas.js";

export class ChatMessage {
    async getAll(accessToken, chatId) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.CHAT_MESSAGE}/${chatId}`;
            const params = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            const response = await fetch(url, params);
            const result = await response.json();
            if (response.status !== 200) throw result;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async send(accessToken, chatId, message) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.CHAT_MESSAGE}`;
            const params = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chat_id: chatId, message, type: "TEXT" }), // ← chat_id
            };
            const response = await fetch(url, params);
            const result = await response.json();
            if (response.status !== 201) throw result; // ← 201 no 200
            return result;
        } catch (error) {
            throw error;
        }
    }
}