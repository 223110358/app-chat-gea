import { ENV } from "../Utils";

export class Chat {

    /**
     * Crear un chat
     * El backend obtiene el usuario autenticado desde el token,
     * por lo que solo necesitas enviar el otro participante
     */
    async create(accessToken, participant_id_two) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.CHAT}`;

            const params = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ participant_id_two }),
            };

            const response = await fetch(url, params);
            const result = await response.json();

            if (response.status !== 200) throw result;

            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener todos los chats del usuario autenticado
     */
    async getAll(accessToken) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.CHAT}`;

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

    async delete(accessToken, chatId) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.CHAT}/${chatId}`;
            const params = {
                method: "DELETE",
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
}
