import { ENV } from "../Utils/constas.js";

export class Chat {
    async create(accessToken, participant_id_one, participant_id_two) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.CHAT}`;
            const params = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ participant_id_one, participant_id_two }),
            };
            const response = await fetch(url, params);
            const result = await response.json();
            if (response.status !== 200) throw result;
            return result;
        } catch (error) {
            throw error;
        }
    }

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
}