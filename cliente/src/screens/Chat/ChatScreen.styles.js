import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111318",
    },

    // Header
    headerTitle: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerName: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    headerStatus: {
        color: "#4ade80",
        fontSize: 11,
    },

    // Lista de mensajes
    messagesList: {
        paddingHorizontal: 12,
        paddingVertical: 16,
    },

    // Filas
    messageRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginVertical: 2,
    },
    myRow: {
        justifyContent: "flex-end",
    },
    otherRow: {
        justifyContent: "flex-start",
    },

    // Avatar
    avatarContainer: {
        marginRight: 6,
        marginBottom: 2,
    },

    // Burbujas
    bubble: {
        maxWidth: "72%",
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginVertical: 1,
    },
    myBubble: {
        backgroundColor: "#2f6feb",
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: "#1e2029",
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: "#2a2d38",
    },
    imageBubble: {
        padding: 4,
        backgroundColor: "transparent",
    },

    // Texto mensajes
    messageText: {
        fontSize: 15,
        lineHeight: 21,
    },
    myText: {
        color: "#ffffff",
    },
    otherText: {
        color: "#d1d5db",
    },

    // Hora
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: "flex-end",
    },
    myTime: {
        color: "rgba(255,255,255,0.45)",
    },
    otherTime: {
        color: "rgba(255,255,255,0.25)",
    },

    // Imagen en mensaje
    messageImage: {
        width: 220,
        height: 180,
        borderRadius: 14,
    },

    // Separador de fecha
    dateSeparator: {
        alignItems: "center",
        marginVertical: 12,
    },
    dateSeparatorText: {
        color: "#4b5263",
        fontSize: 11,
        backgroundColor: "#1a1c23",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },

    // Input
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#111318",
        borderTopWidth: 1,
        borderTopColor: "#1e2029",
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
    },
    iconText: {
        fontSize: 20,
    },
    input: {
        flex: 1,
        backgroundColor: "#1e2029",
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: "#ffffff",
        fontSize: 15,
        maxHeight: 120,
        marginLeft: 6,
    },
    sendButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#2f6feb",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
    sendButtonDisabled: {
        backgroundColor: "#1e2029",
    },
    sendIcon: {
        color: "#ffffff",
        fontSize: 16,
    },
});