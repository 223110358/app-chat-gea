import { useNavigation } from "@react-navigation/native";
import { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../hooks";
import { ENV, screens } from "../../../Utils";

// ============ Componente Principal ============
function ChatItemComponent({ chat, currentUserId, onDelete }) {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const styles = createStyles(colors);

    // Validar datos
    if (!chat || !chat.participant_one || !chat.participant_two) {
        return null;
    }

    // Determinar el otro usuario
    const otherUser =
        chat.participant_one._id === currentUserId
            ? chat.participant_two
            : chat.participant_one;

    // Construir URI del avatar
    const avatarUri = otherUser?.avatar
        ? `${ENV.BASE_PATH}/uploads/${otherUser.avatar}`
        : null;

    // Procesar último mensaje
    const lastMessage = chat.last_message;
    const lastMessageText = lastMessage
        ? lastMessage.type === "IMAGE"
            ? "Imagen"
            : lastMessage.message
        : "Sin mensajes todavía";

    // Formato de hora del último mensaje
    const lastMessageDate = chat.last_message_date
        ? new Date(chat.last_message_date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

    // Nombre completo del usuario
    const displayName = `${otherUser.firstname || ""} ${otherUser.lastname || ""}`.trim()
        || otherUser.email;

    const handlePress = () => {
        // Navegar directamente a ChatScreen (está en el mismo stack)
        navigation.navigate(screens.global.chatScreen, {
            chatId: chat._id,
            otherUser,
        });
    };

    const handleDelete = (event) => {
        event.stopPropagation?.();
        if (onDelete) {
            onDelete(chat);
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
                {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarLetter}>
                            {otherUser.firstname?.[0]?.toUpperCase() ?? "?"}
                        </Text>
                    </View>
                )}
            </View>

            {/* Información del chat */}
            <View style={styles.info}>
                <Text style={styles.name}>{displayName}</Text>
                <Text style={styles.email} numberOfLines={1}>{lastMessageText}</Text>
            </View>

            {/* Metadatos (hora, badge, botón) */}
            <View style={styles.meta}>
                <Text style={styles.time}>{lastMessageDate}</Text>
                {chat.unread_count > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unread_count}</Text>
                    </View>
                )}
                {onDelete && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                    >
                        <Text style={styles.deleteText}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}

// ============ Estilos Dinámicos ============
const createStyles = (colors) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            minHeight: 78,
            paddingHorizontal: 14,
            paddingVertical: 12,
            marginHorizontal: 12,
            marginVertical: 5,
            borderRadius: 8,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
        },
        avatarWrapper: {
            marginRight: 14,
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
        },
        avatarPlaceholder: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: colors.primaryStrong,
            justifyContent: "center",
            alignItems: "center",
        },
        avatarLetter: {
            color: colors.primaryText,
            fontSize: 20,
            fontWeight: "bold",
        },
        info: {
            flex: 1,
        },
        name: {
            color: colors.text,
            fontSize: 16,
            fontWeight: "700",
        },
        email: {
            color: colors.muted,
            fontSize: 13,
            marginTop: 2,
        },
        meta: {
            alignItems: "flex-end",
            marginLeft: 8,
        },
        time: {
            color: colors.muted,
            fontSize: 11,
            minHeight: 14,
        },
        unreadBadge: {
            minWidth: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 4,
        },
        unreadText: {
            color: colors.primaryText,
            fontSize: 12,
            fontWeight: "700",
        },
        deleteButton: {
            marginTop: 6,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: colors.danger,
        },
        deleteText: {
            color: colors.danger,
            fontSize: 14,
            fontWeight: "700",
        },
    });

// ============ Exportación ============
export const ChatItem = memo(ChatItemComponent);
