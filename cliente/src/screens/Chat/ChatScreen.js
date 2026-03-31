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
    Alert,
} from "react-native";
import { Avatar } from "native-base";
import * as ImagePicker from "expo-image-picker";
import { ChatMessage } from "../../api";
import { useAuth } from "../../hooks";
import { socket } from "../../Utils/sockets";
import { ENV } from "../../Utils/constas.js";
import { styles } from "./ChatScreen.styles.js";
import { FloatingMenu } from "../../components/Chat/FloatingMenu.js";
import { ImagePreviewModal } from "../../components/Chat/ImagePreviewModal.js";

const chatMessageController = new ChatMessage();

export function ChatScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { chatId, otherUser } = route.params;
    const { accessToken, user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const flatListRef = useRef(null);

    // Paginación
    const [page, setPage] = useState(1);
    const [limit] = useState(30);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Estado para el modal de preview de imagen
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const [isSendingImage, setIsSendingImage] = useState(false);

    // Estados para el botón de scroll to bottom
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [hasNewMessages, setHasNewMessages] = useState(false);
    const isAtBottomRef = useRef(true);
    const lastMessageCountRef = useRef(0);

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
        loadMessages(1);
    }, []);

    // Auto-scroll al bottom cuando se cargan mensajes iniciales
    useEffect(() => {
        if (messages.length > 0 && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({
                    offset: 0,
                    animated: false,
                });
                setIsAtBottom(true);
                setHasNewMessages(false);
                isAtBottomRef.current = true;
            }, 100);
        }
    }, [messages.length]);

    const loadMessages = async (pageToLoad = 1) => {
        if (isLoadingMore) return;

        try {
            setIsLoadingMore(true);

            const result = await chatMessageController.getAll(
                accessToken,
                chatId,
                pageToLoad,
                limit
            );

            const arr = Array.isArray(result.messages)
                ? result.messages
                : [];

            const ordered = arr.reverse(); // ordenar de más reciente a más antiguo

            if (pageToLoad === 1) {
                setMessages(ordered);
            } else {
                setMessages((prev) => [...prev, ...ordered]);
            }

            setPage(pageToLoad);
            setHasMore(result.hasMore ?? ordered.length === limit);
            lastMessageCountRef.current = pageToLoad === 1 ? ordered.length : messages.length + ordered.length;
        } catch (error) {
            console.error("Error al cargar mensajes:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const loadMoreMessages = () => {
        if (!hasMore || isLoadingMore) return;
        loadMessages(page + 1);
    };

    useEffect(() => {
        if (!socket || !chatId) return;

        socket.emit("suscribe", chatId);

        const onMessage = (newMessage) => {
            // Evitar duplicados
            setMessages((prev) => {
                if (prev.some((m) => m._id === newMessage._id)) {
                    return prev;
                }
                const newMessages = [newMessage, ...prev];
                // Si no está en el bottom, marcar que hay nuevos mensajes
                if (!isAtBottomRef.current) {
                    setHasNewMessages(true);
                }
                return newMessages;
            });
        };

        socket.on("message", onMessage);

        return () => {
            socket.off("message", onMessage);
            socket.emit("unsuscribe", chatId);
        };
    }, [chatId]);

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        // FlatList está invertido (inverted=true), por eso el bottom está en contentOffset.y cercano a 0
        const isAtBottom = contentOffset.y <= 20;

        setIsAtBottom(isAtBottom);
        isAtBottomRef.current = isAtBottom;

        const shouldShowButton = !isAtBottom && messages.length > 0;
        setHasNewMessages(shouldShowButton);
    };

    const scrollToBottom = () => {
        flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
        });
        setHasNewMessages(false);
        setIsAtBottom(true);
        isAtBottomRef.current = true;
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;
        const text = inputText.trim();
        setInputText("");

        try {
            await chatMessageController.send(accessToken, chatId, text);
            await loadMessages(1);
            scrollToBottom(); // Auto-scroll al enviar mensaje
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    const handleCameraPress = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedImageUri(result.assets[0].uri);
            setPreviewModalVisible(true);
        }
    };

    const handleGalleryPress = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedImageUri(result.assets[0].uri);
            setPreviewModalVisible(true);
        }
    };

    const sendImage = async (imageUri) => {
        try {
            // Enviar imagen al backend
            await chatMessageController.sendImage(accessToken, chatId, imageUri);
            // Recargar mensajes reales desde servidor
            await loadMessages(1);

            Alert.alert("Imagen enviada", "La imagen se ha enviado correctamente");
            scrollToBottom(); // Auto-scroll al enviar imagen
        } catch (error) {
            console.error("Error al enviar imagen:", error);
            Alert.alert("Error", "No se pudo enviar la imagen");
        }
    };

    const handleSendImage = async () => {
        if (!selectedImageUri) return;

        setIsSendingImage(true);
        try {
            await sendImage(selectedImageUri);
            setPreviewModalVisible(false);
            setSelectedImageUri(null);
        } catch (error) {
            console.error("Error al enviar imagen:", error);
        } finally {
            setIsSendingImage(false);
        }
    };

    const handleCancelPreview = () => {
        setPreviewModalVisible(false);
        setSelectedImageUri(null);
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
                                uri: (() => {
                                    const msg = item.message;
                                    if (!msg) return null;
                                    if (
                                        msg.startsWith("http") ||
                                        msg.startsWith("file:") ||
                                        msg.startsWith("blob:")
                                    ) {
                                        return msg;
                                    }
                                    const normalized = msg.replace(/\\/g, "/");
                                    if (normalized.includes("/uploads/")) {
                                        const subPath = normalized.split("/uploads/").pop();
                                        return `${ENV.BASE_PATH}/uploads/${subPath}`;
                                    }
                                    return `${ENV.BASE_PATH}/uploads/${normalized}`;
                                })(),
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
                onScroll={handleScroll}
                onEndReached={loadMoreMessages}
                onEndReachedThreshold={0.2}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToOffset({
                        offset: 0,
                        animated: true,
                    })
                }
            />

            {/* Botón flotante para bajar a nuevos mensajes */}
            {hasNewMessages && (
                <TouchableOpacity
                    style={styles.scrollToBottomButton}
                    onPress={scrollToBottom}
                >
                    <Text style={styles.scrollToBottomText}>↓ Nuevos mensajes</Text>
                </TouchableOpacity>
            )}

            {/* Input de mensaje */}
            <View style={styles.inputContainer}>
                {/* Menú flotante */}
                <FloatingMenu
                    onCameraPress={handleCameraPress}
                    onGalleryPress={handleGalleryPress}
                />

                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor="#555"
                    multiline={false}
                    blurOnSubmit={true}
                    onSubmitEditing={sendMessage}
                    // Se quita onKeyPress para no disparar sendMessage dos veces en Enter
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

            {/* Modal de preview de imagen */}
            <ImagePreviewModal
                visible={previewModalVisible}
                imageUri={selectedImageUri}
                onSend={handleSendImage}
                onCancel={handleCancelPreview}
                isLoading={isSendingImage}
            />
        </KeyboardAvoidingView>
    );
}
