import { StyleSheet } from "react-native";

export const createStyles = (colors) => StyleSheet.create({
    viewInput: {
        marginBottom: 12,
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
    btnContainer: {
        marginTop: 8,
    },
    inputError: {
        borderColor: colors.danger,
        backgroundColor: colors.dangerSoft,
    },
});
