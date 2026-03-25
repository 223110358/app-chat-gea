import { ENV } from "../Utils";

export class User {
    async getMe(accesToken) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.ME}`;
            const params = {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accesToken}`,
                }
            };
            const response = await fetch(url, params);
            const result = await response.json();
            if (response.status !== 200)throw result;
            return result;
        } catch (error) {
            throw error;
        }
    }
    async updateAvatar(accessToken,imageUri) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.UPDATE_AVATAR}`;
            // first fetch the file itself to convert to blob (required by expo web)
            const responseFile = await fetch(imageUri);
            const blob = await responseFile.blob();
            const formData = new FormData();
            formData.append("avatar", blob, "avatar.jpg");
            const params = {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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
    async updateUser(accessToken, data) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.UPDATE_USER}`;
            const params = {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            };
            const res = await fetch(url, params);
            const result = await res.json();
            if (res.status !== 200) throw result;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getAll(accessToken){
        try{
            const url =`${ENV.API_URL}/${ENV.ENDPOINTS.USER}`;
            const params = {
                method:"GET",
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            };
            const response = await fetch(url, params);
            const result = await response.json();
            if(response.status !== 200) throw result;
            return result;
        }catch(error){
            throw error;
            
        }
    }
    
}