import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useAuth, useTheme } from "../../hooks";
import { ENV } from "../../Utils/constas.js";
import { socket } from "../../Utils/sockets.js";
import { createStyles } from "./ChatScreen.styles.js";
import { FloatingMenu } from "../../components/Chat/FloatingMenu.js";
import { ImagePreviewModal } from "../../components/Chat/ImagePreviewModal.js";

const chatMessageController = new ChatMessage();

export function ChatScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { chatId, otherUser } = route.params;
    const { accessToken, user } = useAuth();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const flatListRef = useRef(null);

    // Estado para el modal de preview de imagen
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const [isSendingImage, setIsSendingImage] = useState(false);

    useEffect(() => {
        if (!otherUser) return;
        navigation.setOptions({
            headerShown: true,
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            title: "",
            headerTitle: () => (
                <View style={styles.headerTitle}>
                    <Avatar
                        size="sm"
                        bg={colors.primary}
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
    }, [colors, navigation, otherUser, styles]);

    const loadMessages = useCallback(async () => {
        try {
            const result = await chatMessageController.getAll(accessToken, chatId);
            const arr = Array.isArray(result) ? result : result.messages || [];
            setMessages(arr.reverse());
        } catch (error) {
            console.error("Error al cargar mensajes:", error);
        }
    }, [accessToken, chatId]);

    useEffect(() => {
        loadMessages();
        socket?.emit("suscribe", chatId);

        const onMessage = (message) => {
            setMessages((prev) => {
                const exists = prev.some((item) => item._id === message._id);
                return exists ? prev : [message, ...prev];
            });
        };

        socket?.on("message", onMessage);

        return () => {
            socket?.emit("unsuscribe", chatId);
            socket?.off("message", onMessage);
        };
    }, [chatId, loadMessages]);

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
            // Mostrar la imagen localmente para responsive UX
            const tempMessage = {
                _id: Date.now().toString(),
                message: imageUri,
                type: "IMAGE",
                user: { _id: user._id },
                createdAt: new Date(),
            };
            setMessages((prev) => [tempMessage, ...prev]);

            // Enviar imagen al backend
            await chatMessageController.sendImage(accessToken, chatId, imageUri);

            // Recargar mensajes reales desde servidor
            await loadMessages();

            Alert.alert("Imagen enviada", "La imagen se ha enviado correctamente");
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
                                bg={colors.primary}
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

    if (!otherUser) {
        return (
            <View style={styles.container}>
                <Text style={styles.messageText}>No se pudo cargar la informacion del chat.</Text>
            </View>
        );
    }

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
                    placeholderTextColor={colors.muted}
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
