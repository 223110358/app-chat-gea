import { StyleSheet } from "react-native";

export const createStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerTitle: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerName: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "700",
    },
    headerStatus: {
        color: colors.primary,
        fontSize: 11,
    },
    messagesList: {
        width: "100%",
        maxWidth: 860,
        alignSelf: "center",
        paddingHorizontal: 12,
        paddingVertical: 16,
    },
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
    avatarContainer: {
        marginRight: 6,
        marginBottom: 2,
    },
    bubble: {
        maxWidth: "72%",
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginVertical: 1,
    },
    myBubble: {
        backgroundColor: colors.bubbleMine,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: colors.bubbleOther,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    imageBubble: {
        padding: 4,
        backgroundColor: "transparent",
    },
    messageText: {
        fontSize: 15,
        lineHeight: 21,
        color: colors.text,
    },
    myText: {
        color: colors.primaryText,
    },
    otherText: {
        color: colors.text,
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: "flex-end",
    },
    myTime: {
        color: "rgba(255,255,255,0.7)",
    },
    otherTime: {
        color: colors.muted,
    },
    messageImage: {
        width: 220,
        height: 180,
        borderRadius: 14,
    },
    inputContainer: {
        width: "100%",
        maxWidth: 860,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    input: {
        flex: 1,
        backgroundColor: colors.input,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: colors.text,
        fontSize: 15,
        maxHeight: 120,
        marginLeft: 6,
    },
    sendButton: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
    sendButtonDisabled: {
        backgroundColor: colors.surfaceAlt,
    },
    sendIcon: {
        color: colors.primaryText,
        fontSize: 16,
    },
});
