import { createContext, useEffect, useState } from "react";
import { Auth, User } from "../api";
import { hasExpiriedToken, initSockets } from "../Utils";


const authController = new Auth();
const userController = new User();
export const AuthContext = createContext();

export function AuthProvider(props) {
    const { children } = props;
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        initSockets();
        // Aquí puedes cargar el estado de autenticación desde almacenamiento local o una API
        // Por ejemplo, podrías usar AsyncStorage para React Native
        (async () => {
            try {
                const accessToken = await authController.getAccesToken();
                const refreshToken = await authController.getRefreshToken();
                // console.log("Access Token:", accessToken);
                // console.log("Refresh Token:", refreshToken);
                
                // Verificar expiración de tokens
                if (!accessToken || !refreshToken) {
                    logout();
                    setLoading(false);
                    return;
                }
                if (hasExpiriedToken(accessToken)) {
                    if (hasExpiriedToken(refreshToken)) {
                        logout();
                        setLoading(false);
                        return;
                    }
                    else {
                        reLogin(refreshToken);
                    }
                } else {
                    await (login(accessToken));
                }
            } catch (error) {
                console.error("Error al cargar tokens:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    const reLogin = async (refreshToken) => {
        try {
            const {accessToken} = 
            await authController.refreshAccesToken(refreshToken);
            await authController.setAccesToken(accessToken);
            await login(accessToken);
        } catch (error) {
            console.error(error);
        }
    };

    const login = async (accessToken) => {
        try {
            setLoading(true);
            const response = await userController.getMe(accessToken);
            setUser(response); // Usar la respuesta del usuario autenticado
            setToken(accessToken);
            setLoading(false);
        } catch (error) {
            console.error("Error en login:", error);
            setLoading(false);
        }
    }
    const logout = async () => {
        setUser(null);
        setToken(null);
        authController.removeTokens();
    }
    const updateUser = async (key, value) => {
        setUser({
            ...user,
            [key]: value,
        })
    }
    const data = {
        accessToken: token,
        user,
        login,
        logout,
        updateUser,
        reLogin
    };
    
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
}