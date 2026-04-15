import { StyleSheet } from "react-native";

export const createStyles = (colors) => StyleSheet.create({
    content: {
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",
        paddingHorizontal: 12,
        paddingBottom: 48,
    },
    item: {
        flexDirection: "row",
        minHeight: 72,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 10,
        alignItems: "center",
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
    },
    email: {
        color: colors.muted,
        marginTop: 2,
    },
});
