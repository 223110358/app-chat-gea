import { StyleSheet } from "react-native";

export const createStyles = (colors) => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        padding: 20,
    },
    content: {
        width: "100%",
        maxWidth: 440,
        alignSelf: "center",
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: 22,
    },
    eyebrow: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 8,
    },
    title: {
        color: colors.text,
        textAlign: "center",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 10,
    },
    info: {
        color: colors.muted,
        marginBottom: 20,
        textAlign: "center",
        lineHeight: 20,
    },
    linkButton: {
        alignItems: "center",
        marginTop: 18,
    },
    register: {
        color: colors.primary,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "800",
    },
});
