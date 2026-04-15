import { StyleSheet } from "react-native";

export const createStyles = (colors) => StyleSheet.create({
    content: {
        marginTop: 18,
        marginBottom: 24,
        gap: 10,
    },
    item: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 8,
    },
    closeItem: {
        backgroundColor: colors.dangerSoft,
        borderColor: colors.danger,
    },
    text: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "600",
    },
    itemClose: {
        textAlign: "center",
        color: colors.danger,
        fontSize: 16,
        fontWeight: "800",
    },
});
