import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AddIcon, IconButton } from "native-base";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Chat } from "../../api";
import { ChatItem } from "../../components/Chat";
import { useAuth, useTheme } from "../../hooks";
import { screens } from "../../Utils";
import { socket } from "../../Utils/sockets";

const chatController = new Chat();

export function ChatsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { accessToken, user } = useAuth();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("recent");

    const fetchChats = useCallback(async () => {
        if (!accessToken) return;
        try {
            const response = await chatController.getAll(accessToken);
            setChats(response);
        } catch (error) {
            console.error("Error al obtener chats:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [accessToken]);

    useFocusEffect(
        useCallback(() => {
            fetchChats();
        }, [fetchChats])
    );

    useFocusEffect(
        useCallback(() => {
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
        }, [navigation])
    );

    useFocusEffect(
        useCallback(() => {
            if (route.params?.chatCreated) {
                fetchChats();
                navigation.setParams({ chatCreated: undefined });
            }
        }, [fetchChats, navigation, route.params?.chatCreated])
    );

    useEffect(() => {
        if (!chats.length || !socket) return;

        const notifyRooms = chats.map((chat) => `${chat._id}_notify`);

        notifyRooms.forEach((room) => socket.emit("suscribe", room));
        socket.on("message_notify", fetchChats);

        return () => {
            notifyRooms.forEach((room) => socket.emit("unsuscribe", room));
            socket.off("message_notify", fetchChats);
        };
    }, [chats, fetchChats]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchChats();
    };

    const handleDeleteChat = useCallback((chat) => {
        const deleteChat = async () => {
            try {
                await chatController.delete(accessToken, chat._id);
                setChats((currentChats) =>
                    currentChats.filter((item) => item._id !== chat._id)
                );
            } catch (error) {
                console.error("Error al eliminar chat:", error);
                Alert.alert("Error", "No se pudo eliminar el chat");
            }
        };

        if (Platform.OS === "web") {
            const confirmed = window.confirm(
                "Se eliminaran tambien los mensajes de esta conversacion."
            );
            if (confirmed) deleteChat();
            return;
        }

        Alert.alert(
            "Eliminar chat",
            "Se eliminaran tambien los mensajes de esta conversacion.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: deleteChat,
                },
            ]
        );
    }, [accessToken]);

    const visibleChats = useMemo(() => {
        const normalizedSearch = searchText.trim().toLowerCase();
        const filteredChats = chats.filter((chat) => {
            const otherUser =
                chat.participant_one._id === user?._id
                    ? chat.participant_two
                    : chat.participant_one;
            const displayName = `${otherUser.firstname || ""} ${otherUser.lastname || ""}`.trim();
            const haystack = [
                displayName,
                otherUser.email,
                chat.last_message?.message,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
            const matchesFilter = filter === "all" || chat.unread_count > 0;

            return matchesSearch && matchesFilter;
        });

        return filteredChats.sort((a, b) => {
            const dateA = a.last_message_date ? new Date(a.last_message_date).getTime() : 0;
            const dateB = b.last_message_date ? new Date(b.last_message_date).getTime() : 0;
            return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
        });
    }, [chats, filter, searchText, sortOrder, user?._id]);

    const renderChatItem = useCallback(({ item }) => (
        <ChatItem
            chat={item}
            currentUserId={user._id}
            onDelete={handleDeleteChat}
        />
    ), [handleDeleteChat, user?._id]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1a4705" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.controls}>
                <View style={styles.titleBlock}>
                    <Text style={styles.title}>Conversaciones</Text>
                    <Text style={styles.subtitle}>
                        {visibleChats.length} chat{visibleChats.length === 1 ? "" : "s"}
                    </Text>
                </View>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar chats"
                    placeholderTextColor="#777777"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === "all" && styles.filterButtonActive]}
                        onPress={() => setFilter("all")}
                    >
                        <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>
                            Todos
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === "unread" && styles.filterButtonActive]}
                        onPress={() => setFilter("unread")}
                    >
                        <Text style={[styles.filterText, filter === "unread" && styles.filterTextActive]}>
                            No leidos
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setSortOrder((current) => current === "recent" ? "oldest" : "recent")}
                    >
                        <Text style={styles.filterText}>
                            {sortOrder === "recent" ? "Recientes primero" : "Antiguos primero"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {chats.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No tienes chats aun</Text>
                    <Text style={styles.emptySubText}>
                        Presiona el boton + para iniciar una conversacion
                    </Text>
                </View>
            ) : visibleChats.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No hay resultados</Text>
                    <Text style={styles.emptySubText}>
                        Ajusta la busqueda o cambia el filtro activo
                    </Text>
                </View>
            ) : (
                <FlatList
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    data={visibleChats}
                    keyExtractor={(item) => item._id}
                    renderItem={renderChatItem}
                    initialNumToRender={12}
                    maxToRenderPerBatch={12}
                    windowSize={7}
                    removeClippedSubviews={Platform.OS !== "web"}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={colors.primary}
                        />
                    }
                />
            )}
        </View>
    );
}

const createStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
    },
    controls: {
        width: "100%",
        maxWidth: 760,
        paddingHorizontal: 12,
        paddingTop: 18,
        paddingBottom: 10,
    },
    titleBlock: {
        marginBottom: 12,
    },
    title: {
        color: colors.text,
        fontSize: 24,
        fontWeight: "800",
    },
    subtitle: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 2,
    },
    searchInput: {
        height: 44,
        borderRadius: 8,
        backgroundColor: colors.input,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.text,
        paddingHorizontal: 12,
        marginBottom: 10,
    },
    filterRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    filterButton: {
        minHeight: 34,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 10,
        justifyContent: "center",
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterText: {
        color: colors.muted,
        fontSize: 13,
        fontWeight: "600",
    },
    filterTextActive: {
        color: colors.primaryText,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: colors.background,
    },
    list: {
        width: "100%",
        maxWidth: 760,
    },
    listContent: {
        paddingBottom: 24,
    },
    emptyText: {
        color: colors.text,
        fontSize: 18,
        fontWeight: "600",
    },
    emptySubText: {
        color: colors.muted,
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
        paddingHorizontal: 32,
    },
});
