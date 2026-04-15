import { createContext, useCallback, useEffect, useState } from "react";
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

    const login = useCallback(async (accessToken) => {
        try {
            setLoading(true);
            const response = await userController.getMe(accessToken);
            setUser(response);
            setToken(accessToken);
        } catch (error) {
            console.error("Error en login:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setUser(null);
        setToken(null);
        await authController.removeTokens();
    }, []);

    const reLogin = useCallback(async (refreshToken) => {
        try {
            const { accessToken } = await authController.refreshAccesToken(refreshToken);
            await authController.setAccesToken(accessToken);
            await login(accessToken);
        } catch (error) {
            console.error(error);
            await logout();
        }
    }, [login, logout]);

    useEffect(() => {
        initSockets();

        (async () => {
            try {
                const accessToken = await authController.getAccesToken();
                const refreshToken = await authController.getRefreshToken();

                if (!accessToken || !refreshToken) {
                    await logout();
                    return;
                }

                if (hasExpiriedToken(accessToken)) {
                    if (hasExpiriedToken(refreshToken)) {
                        await logout();
                        return;
                    }

                    await reLogin(refreshToken);
                    return;
                }

                await login(accessToken);
            } catch (error) {
                console.error("Error al cargar tokens:", error);
                await logout();
            } finally {
                setLoading(false);
            }
        })();
    }, [login, logout, reLogin]);

    const updateUser = useCallback((key, value) => {
        setUser((currentUser) => ({
            ...currentUser,
            [key]: value,
        }));
    }, []);

    const data = {
        accessToken: token,
        loading,
        user,
        login,
        logout,
        updateUser,
        reLogin,
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
}
