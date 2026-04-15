import { StyleSheet } from "react-native";

export const createStyles = (colors) => StyleSheet.create({
    content: {
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",
        paddingHorizontal: 12,
        paddingTop: 14,
        paddingBottom: 8,
    },
    input: {
        height: 44,
        backgroundColor: colors.input,
        color: colors.text,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
});
