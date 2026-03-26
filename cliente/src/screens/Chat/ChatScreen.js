import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar } from "native-base";
import { ChatMessage } from "../../api";
import { useAuth } from "../../hooks";
import { ENV } from "../../Utils/constas.js";
import { styles } from "./ChatScreen.styles.js";

const chatMessageController = new ChatMessage();

export function ChatScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { chatId, otherUser } = route.params;
    const { accessToken, user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const flatListRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerStyle: { backgroundColor: "#0f0f1a" },
            headerTintColor: "#fff",
            title: "",
            headerTitle: () => (
                <View style={styles.headerTitle}>
                    <Avatar
                        size="sm"
                        bg="cyan.500"
                        source={{
                            uri: otherUser.avatar
                                ? `${ENV.BASE_PATH}/uploads/${otherUser.avatar}`
                                : null,
                        }}
                    >
                        {otherUser.email.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.headerName}>
                            {otherUser.firstname
                                ? `${otherUser.firstname} ${otherUser.lastname || ""}`
                                : otherUser.email}
                        </Text>
                        <Text style={styles.headerStatus}>En línea</Text>
                    </View>
                </View>
            ),
        });
    }, []);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const result = await chatMessageController.getAll(accessToken, chatId);
            const arr = Array.isArray(result) ? result : result.messages || [];
            setMessages(arr.reverse());
        } catch (error) {
            console.error("Error al cargar mensajes:", error);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;
        const text = inputText.trim();
        setInputText("");

        const tempMessage = {
            _id: Date.now().toString(),
            message: text,
            type: "TEXT",
            user: { _id: user._id },
            createdAt: new Date(),
        };
        setMessages((prev) => [tempMessage, ...prev]);

        try {
            await chatMessageController.send(accessToken, chatId, text);
            loadMessages();
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    const renderMessage = ({ item, index }) => {
        const isMe =
            item.user?._id === user._id || item.user === user._id;
        const isImage = item.type === "IMAGE";
        const showAvatar =
            !isMe &&
            (index === messages.length - 1 ||
                messages[index + 1]?.user?._id !== item.user?._id);

        return (
            <View
                style={[
                    styles.messageRow,
                    isMe ? styles.myRow : styles.otherRow,
                ]}
            >
                {/* Avatar del otro usuario */}
                {!isMe && (
                    <View style={styles.avatarContainer}>
                        {showAvatar ? (
                            <Avatar
                                size="xs"
                                bg="cyan.500"
                                source={{
                                    uri: otherUser.avatar
                                        ? `${ENV.BASE_PATH}/uploads/${otherUser.avatar}`
                                        : null,
                                }}
                            >
                                {otherUser.email.substring(0, 2).toUpperCase()}
                            </Avatar>
                        ) : (
                            <View style={{ width: 28 }} />
                        )}
                    </View>
                )}

                {/* Burbuja del mensaje */}
                <View
                    style={[
                        styles.bubble,
                        isMe ? styles.myBubble : styles.otherBubble,
                        isImage && styles.imageBubble,
                    ]}
                >
                    {isImage ? (
                        <Image
                            source={{
                                uri: `${ENV.BASE_PATH}/uploads/${item.message}`,
                            }}
                            style={styles.messageImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text
                            style={[
                                styles.messageText,
                                isMe ? styles.myText : styles.otherText,
                            ]}
                        >
                            {item.message}
                        </Text>
                    )}
                    <Text
                        style={[
                            styles.timeText,
                            isMe ? styles.myTime : styles.otherTime,
                        ]}
                    >
                        {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    const renderDateSeparator = (date) => (
        <View style={styles.dateSeparator}>
            <Text style={styles.dateSeparatorText}>
                {new Date(date).toLocaleDateString([], {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                })}
            </Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={90}
        >
            {/* Lista de mensajes */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item._id?.toString()}
                renderItem={renderMessage}
                inverted
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToOffset({
                        offset: 0,
                        animated: true,
                    })
                }
            />

            {/* Input de mensaje */}
            <View style={styles.inputContainer}>
                {/* Botón imagen (solo diseño) */}
                <TouchableOpacity style={styles.iconButton}>
                    <Text style={styles.iconText}>📎</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor="#555"
                    multiline
                />

                {/* Botón enviar */}
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        !inputText.trim() && styles.sendButtonDisabled,
                    ]}
                    onPress={sendMessage}
                    disabled={!inputText.trim()}
                >
                    <Text style={styles.sendIcon}>➤</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
