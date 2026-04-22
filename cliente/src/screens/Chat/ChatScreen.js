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
import { Ionicons } from "@expo/vector-icons";
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
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [hasNewMessages, setHasNewMessages] = useState(false);
    const flatListRef = useRef(null);

    // Estado para el modal de preview de imagen
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const [isSendingImage, setIsSendingImage] = useState(false);

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

    useEffect(() => {
        if (!socket || !chatId) return;

        socket.emit("suscribe", chatId);

        const onMessage = (newMessage) => {
            setMessages((prev) => {
                if (prev.some((msg) => msg._id === newMessage._id)) {
                    return prev;
                }
                return [newMessage, ...prev];
            });
            setTimeout(() => scrollToBottom(), 100);
        };

        socket.on("message", onMessage);

        return () => {
            socket.off("message", onMessage);
            socket.emit("unsuscribe", chatId);
        };
    }, [chatId]);

    const loadMessages = async () => {
        try {
            const result = await chatMessageController.getAll(accessToken, chatId);
            const arr = Array.isArray(result) ? result : result.messages || [];
            setMessages(arr.reverse());
            setHasNewMessages(false);
            setIsAtBottom(true);
        } catch (error) {
            console.error("Error al cargar mensajes:", error);
        }
    };

    const scrollToBottom = () => {
        flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
        });
        setHasNewMessages(false);
        setIsAtBottom(true);
    };

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const isBottom = contentOffset.y <= 20;
        setIsAtBottom(isBottom);
        if (isBottom) {
            setHasNewMessages(false);
        } else {
            setHasNewMessages(true);
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages.length]);

    const sendMessage = async () => {
        if (!inputText.trim()) return;
        const text = inputText.trim();
        setInputText("");

        try {
            await chatMessageController.send(accessToken, chatId, text);
            await loadMessages();
            scrollToBottom();
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    const handleCameraPress = async () => {
        try {
            // Solicitar permisos de cámara
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permiso denegado", "Necesitamos acceso a tu cámara para enviar fotos");
                return;
            }

            const options = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: Platform.OS !== "web", // El editor de expo no funciona bien en web
                aspect: [4, 3],
                quality: 0.7,
                cameraType: ImagePicker.CameraType.back,
            };

            let result;
            
            if (Platform.OS === "web") {
                // En web, a veces launchCameraAsync no está soportado o abre galería
                // Intentamos launchCameraAsync, pero con un manejo de error más amigable
                try {
                    // Algunas versiones de expo-image-picker en web requieren este permiso explícito
                    // para abrir el diálogo de captura
                    result = await ImagePicker.launchCameraAsync(options);
                } catch (webError) {
                    console.error("Web Camera Error:", webError);
                    // Si falla, es probable que el navegador bloquee el acceso directo
                    // Mostramos un mensaje al usuario para que use la galería o revise permisos
                    Alert.alert(
                        "Cámara no disponible",
                        "El navegador no permitió abrir la cámara directamente. Por favor, selecciona una foto de tu equipo."
                    );
                    result = await ImagePicker.launchImageLibraryAsync(options);
                }
            } else {
                result = await ImagePicker.launchCameraAsync(options);
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImageUri(result.assets[0].uri);
                setPreviewModalVisible(true);
            }
        } catch (error) {
            console.error("Error al acceder a medios:", error);
            Alert.alert(
                "Error",
                "No se pudo acceder a la cámara o galería en este dispositivo."
            );
        }
    };

    const handleGalleryPress = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería para enviar fotos");
                return;
            }

            const options = {
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            };

            const result = await ImagePicker.launchImageLibraryAsync(options);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImageUri(result.assets[0].uri);
                setPreviewModalVisible(true);
            }
        } catch (error) {
            console.error("Error al abrir la galería:", error);
            Alert.alert("Error", "No se pudo abrir la galería en este dispositivo");
        }
    };

    const sendImage = async (imageUri) => {
        try {
            await chatMessageController.sendImage(accessToken, chatId, imageUri);
            await loadMessages();
            Alert.alert("Imagen enviada", "La imagen se ha enviado correctamente");
            scrollToBottom();
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
                                    const normalized = msg.replace(/\\/g, "/");

                                    if (normalized.startsWith("http") || normalized.startsWith("file:") || normalized.startsWith("blob:")) {
                                        return normalized;
                                    }
                                    if (normalized.startsWith("/uploads/")) {
                                        return `${ENV.BASE_PATH}${normalized}`;
                                    }
                                    if (normalized.startsWith("uploads/")) {
                                        return `${ENV.BASE_PATH}/${normalized}`;
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
                scrollEventThrottle={16}
                onContentSizeChange={() => {
                    if (isAtBottom) {
                        flatListRef.current?.scrollToOffset({
                            offset: 0,
                            animated: true,
                        });
                    }
                }}
            />

            {hasNewMessages && (
                <TouchableOpacity
                    style={styles.scrollToBottomButton}
                    onPress={scrollToBottom}
                >
                    <Ionicons name="chevron-down" size={24} color="#ffffff" />
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
                    returnKeyType="send"
                    onSubmitEditing={sendMessage}
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
