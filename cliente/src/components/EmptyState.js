import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks";

export function EmptyState({ title, description }) {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {description ? <Text style={styles.description}>{description}</Text> : null}
            </View>
        </View>
    );
}

const createStyles = (colors) => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    content: {
        width: "100%",
        maxWidth: 560,
        alignSelf: "center",
        marginTop: 48,
        padding: 22,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    title: {
        color: colors.text,
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 8,
    },
    description: {
        color: colors.muted,
        fontSize: 15,
        lineHeight: 21,
    },
});
