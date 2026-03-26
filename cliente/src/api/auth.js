import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "../Utils/constas.js";

export class Auth {
    async register(email, password) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.AUTH.REGISTER}`;
            console.log("Intentando conectar a:", url)
            const params = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            }
            const response = await fetch(url, params);
            const contentType = response.headers.get("content-type") || "";
            const text = await response.text();
            if (!contentType.includes("application/json")) {
                throw new Error(
                    `HTTP ${response.status} ${response.statusText}: Unexpected non-JSON response:\n${text.slice(0,1000)}`
                );
            }
            const result = JSON.parse(text);
            if (!response.ok) throw result;
            return result;
        }

        catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.AUTH.LOGIN}`;
            const params = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email,password}),
            };
            const response = await fetch(url, params);
            const contentType = response.headers.get("content-type") || "";
            const text = await response.text();
            if (!contentType.includes("application/json")) {
                throw new Error(
                    `HTTP ${response.status} ${response.statusText}: Unexpected non-JSON response:\n${text.slice(0,1000)}`
                );
            }
            const result = JSON.parse(text);
            if (!response.ok) throw result;
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async refreshAccesToken(refreshToken){
        try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.AUTH.REFRESH_ACCESS_TOKEN}`;
            const params = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({refreshToken}),
            };
            const response = await fetch(url, params);
            const results = await response.json();
            if (response.status !== 200) throw results;
            return results;
        } catch (error) {
            throw error;
        }
    }
    async setAccesToken(token){
        await AsyncStorage.setItem(ENV.JWT.ACCESS,token)
    }
    async getAccesToken() {
        return await AsyncStorage.getItem(ENV.JWT.ACCESS)
    }
    async setRefreshToken(token){
        await AsyncStorage.setItem(ENV.JWT.REFRESH,token)
    }
    async getRefreshToken(){
        return await AsyncStorage.getItem(ENV.JWT.REFRESH)
    }
    async removeTokens(){
        await AsyncStorage.removeItem(ENV.JWT.ACCESS)
        await AsyncStorage.removeItem(ENV.JWT.REFRESH)
    }
}