import { useNavigation } from "@react-navigation/native";
import { memo, useState } from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../../hooks";
import { ENV, screens } from "../../../Utils";

function navigateFromRoot(navigation, screen, params) {
  let navigator = navigation;
  let parent = navigation.getParent?.();
  while (parent) {
    navigator = parent;
    parent = parent.getParent?.();
  }
  navigator.navigate(screen, params);
}

function ChatItemComponent({ chat, currentUserId, onDelete }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // NUEVO ESTADO: Controla si el menú está visible o no
  const [menuVisible, setMenuVisible] = useState(false);

  const otherUser =
    chat.participant_one._id === currentUserId
      ? chat.participant_two
      : chat.participant_one;

  const avatarUri = otherUser.avatar
    ? `${ENV.BASE_PATH}/uploads/${otherUser.avatar}`
    : null;

  const lastMessageText = chat.last_message
    ? chat.last_message.type === "IMAGE"
      ? "Imagen"
      : chat.last_message.message
    : "Sin mensajes todavía";

  const lastMessageDate = chat.last_message_date
    ? new Date(chat.last_message_date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const displayName =
    `${otherUser.firstname || ""} ${otherUser.lastname || ""}`.trim() ||
    otherUser.email;

  // Función para manejar el clic en el botón de eliminar
  const handleDelete = () => {
    setMenuVisible(false); // Cerramos el menú
    onDelete(chat); // Ejecutamos la eliminación
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        // Si el menú está abierto y hacen clic fuera, solo lo cerramos
        if (menuVisible) {
          setMenuVisible(false);
          return;
        }
        // Si no, navegamos al chat normalmente
        navigateFromRoot(navigation, screens.global.chatScreen, {
          chatId: chat._id,
          otherUser,
        });
      }}
    >
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

      <View style={styles.info}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email} numberOfLines={1}>
          {lastMessageText}
        </Text>
      </View>

      <View style={styles.meta}>
        <Text style={styles.time}>{lastMessageDate}</Text>

        <View style={styles.actions}>
          {chat.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unread_count}</Text>
            </View>
          )}

          {/* Botón de 3 puntos */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation?.(); // Evita que se dispare el onPress del contenedor padre en la web
              setMenuVisible(!menuVisible); // Alterna la visibilidad
            }}
            style={styles.menuButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={styles.dots}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* MENÚ DESPLEGABLE (Visible solo si menuVisible es true) */}
        {menuVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={(e) => {
                e.stopPropagation?.();
                handleDelete();
              }}
            >
              <Text style={styles.dropdownText}>Eliminar chat</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Pressable>
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

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 80,
      paddingHorizontal: 16,
      marginHorizontal: 12,
      marginVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      // Añadimos zIndex relativo para que los menús no se escondan detrás de otros chats
      zIndex: 1,
    },
    avatarWrapper: { marginRight: 12 },
    avatar: { width: 52, height: 52, borderRadius: 26 },
    avatarPlaceholder: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primaryStrong,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarLetter: {
      color: colors.primaryText,
      fontSize: 18,
      fontWeight: "bold",
    },
    info: { flex: 1 },
    name: { color: colors.text, fontSize: 16, fontWeight: "700" },
    email: { color: colors.muted, fontSize: 13, marginTop: 2 },
    meta: {
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: 50,
      paddingVertical: 4,
      // zIndex alto para que el menú flote por encima
      zIndex: 2,
    },
    time: { color: colors.muted, fontSize: 11 },
    actions: {
      flexDirection: "row",
      alignItems: "center",
    },
    unreadBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    unreadText: { color: colors.primaryText, fontSize: 10, fontWeight: "bold" },
    menuButton: {
      padding: 5,
    },
    dots: {
      fontSize: 24,
      color: colors.text,
      fontWeight: "bold",
      textAlign: "center",
    },
    // ESTILOS DEL NUEVO MENÚ FLOTANTE
    dropdownMenu: {
      position: "absolute",
      top: 35, // Lo coloca justo debajo de los 3 puntos
      right: 0,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      // Sombras para que parezca un menú flotante real
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
      elevation: 5,
      minWidth: 120,
      zIndex: 100, // Asegura que se vea por encima de todo en la web
    },
    dropdownItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    dropdownText: {
      color: colors.danger || "#ff4444", // Color rojo para acción destructiva
      fontSize: 14,
      fontWeight: "600",
    },
  });
