import { StyleSheet } from "react-native";

export const createStyles = (colors) => StyleSheet.create({
    viewInput: {
        gap: 12,
    },
    input: {
        minHeight: 46,
        backgroundColor: colors.input,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        color: colors.text,
        fontSize: 16,
        paddingHorizontal: 12,
    },
    btn: {
        marginTop: 8,
        minHeight: 48,
        borderRadius: 8,
        backgroundColor: colors.primary,
    },
    inputError: {
        borderColor: colors.danger,
        backgroundColor: colors.dangerSoft,
    },
});
