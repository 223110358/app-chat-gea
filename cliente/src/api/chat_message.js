import { Platform } from "react-native";
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

            const filename = imageUri.split("/").pop().split("?")[0] || "photo.jpg";
            const match = /\.(\w+)$/.exec(filename);
            const extension = match ? match[1].toLowerCase() : "jpg";
            const type = `image/${extension === "jpg" ? "jpeg" : extension}`;

            if (Platform.OS === "web") {
                // En WEB necesitamos convertir el URI a Blob
                const response = await fetch(imageUri);
                const blob = await response.blob();
                formData.append("image", blob, filename);
            } else {
                // En Móvil usamos el formato especial de React Native
                formData.append("image", {
                    uri: imageUri,
                    name: filename,
                    type: type,
                });
            }
            
            formData.append("chat_id", chatId);

            const params = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Accept": "application/json",
                },
                body: formData,
            };

            const response = await fetch(url, params);
            const result = await response.json();
            if (response.status !== 200) throw result;
            return result;
        } catch (error) {
            console.error("Error al enviar imagen:", error);
            throw error;
        }
    }
}