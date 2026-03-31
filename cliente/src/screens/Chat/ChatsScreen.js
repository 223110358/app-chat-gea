// src/screens/Chat/ChatsScreen.js
import { useNavigation } from "@react-navigation/native";
import { AddIcon, IconButton } from "native-base";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Chat } from "../../api";
import { ChatItem } from "../../components/Chat";
import { useAuth } from "../../hooks";
import { screens } from "../../Utils";

const chatController = new Chat();

export function ChatsScreen() {
    const navigation = useNavigation();
    const { accessToken, user } = useAuth();

    // chats: arreglo de chats obtenidos del backend
    // loading: controla el spinner inicial
    // refreshing: controla el pull-to-refresh
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Configura el botón "+" en el header para navegar a CreateChatScreen
    // Se ejecuta una sola vez al montar (array vacío de dependencias)
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon={<AddIcon />}
                    padding={5}
                    onPress={() =>
                        navigation.navigate(screens.tab.chats.createChatScreen)
                    }
                />
            ),
        });
    }, []);

    // Carga los chats al montar la pantalla
    useEffect(() => {
        fetchChats();
    }, []);

    /**
     * Llama al endpoint GET /api/chat.
     * El backend usa el JWT para identificar al usuario y devuelve
     * solo sus chats con los participantes populados.
     */
    const fetchChats = async () => {
        try {
            const response = await chatController.getAll(accessToken);
            setChats(response);
        } catch (error) {
            console.error("Error al obtener chats:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Llamado por el RefreshControl al hacer pull-to-refresh
    const handleRefresh = () => {
        setRefreshing(true);
        fetchChats();
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1a4705" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {chats.length === 0 ? (
                // Estado vacío: guía al usuario a crear su primer chat
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No tienes chats aún</Text>
                    <Text style={styles.emptySubText}>
                        Presiona el botón + para iniciar una conversación
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={chats}
                    // _id es el identificador único de MongoDB, ideal como key
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <ChatItem chat={item} currentUserId={user._id} />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor="#1a4705"
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
    },
    emptyText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
    },
    emptySubText: {
        color: "#888888",
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
        paddingHorizontal: 32,
    },
});