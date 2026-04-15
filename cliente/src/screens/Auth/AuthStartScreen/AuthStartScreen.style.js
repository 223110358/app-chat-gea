import { StyleSheet } from "react-native";

export const createStyles = (colors) => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        width: "100%",
        maxWidth: 860,
        alignSelf: "center",
        justifyContent: "center",
        paddingHorizontal: 22,
        paddingVertical: 28,
    },
    img: {
        width: "100%",
        height: 320,
        resizeMode: "contain",
        marginBottom: 24,
    },
    copy: {
        width: "100%",
        maxWidth: 520,
        alignSelf: "center",
    },
    eyebrow: {
        color: colors.primary,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 8,
    },
    title: {
        color: colors.text,
        textAlign: "center",
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 12,
    },
    description: {
        color: colors.muted,
        textAlign: "center",
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 24,
    },
    btn: {
        minHeight: 48,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 18,
    },
    btnText: {
        color: colors.primaryText,
        fontWeight: "800",
        fontSize: 16,
    },
});
