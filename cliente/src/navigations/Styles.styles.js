import { StyleSheet } from "react-native";

export const createNavigationStyles = (colors) => StyleSheet.create({
    stackContent: {
        backgroundColor: colors.background,
    },
    stackHeader: {
        backgroundColor: colors.surface,
    },
    stackHeaderTitle: {
        color: colors.text,
    },
    modalContent: {
        backgroundColor: colors.background,
    },
    modalHeader: {
        backgroundColor: colors.surface,
    },
    modalHeaderTitle: {
        color: colors.text,
    },
});

// Export default para compatibilidad
export const styles = createNavigationStyles({
    background: "#000000",
    surface: "#1a1a1a",
    text: "#ffffff",
});
