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
                body: JSON.stringify({ chat_id: chatId, message, type: "TEXT" }),
            };
            const response = await fetch(url, params);
            const result = await response.json();
            if (response.status !== 201) throw result;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async sendImage(accessToken, chatId, imageUri) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.CHAT_MESSAGE}/image`;
            const formData = new FormData();

            const filename = imageUri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const extension = match ? match[1].toLowerCase() : "jpg";
            const type = `image/${extension === "jpg" ? "jpeg" : extension}`;

            formData.append("chat_id", chatId);
            formData.append("image", {
                uri: imageUri,
                name: filename,
                type,
            });

            const params = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                },
                body: formData,
            };

            const response = await fetch(url, params);
            const result = await response.json();
            if (response.status !== 200) throw result;
            return result;
        } catch (error) {
            throw error;
        }
    }
}