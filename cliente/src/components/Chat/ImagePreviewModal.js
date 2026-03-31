import React from "react";
import {
    View,
    Modal,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
} from "react-native";

const { width, height } = Dimensions.get("window");

const ImagePreviewModal = ({
    visible,
    imageUri,
    onSend,
    onCancel,
    isLoading = false,
}) => {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onCancel}
                        disabled={isLoading}
                    >
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
                        onPress={onSend}
                        disabled={isLoading}
                    >
                        <Text style={[styles.sendText, isLoading && styles.sendTextDisabled]}>
                            {isLoading ? "Enviando..." : "Enviar"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Imagen */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: Platform.OS === "ios" ? 50 : 12,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    cancelText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "500",
    },
    sendButton: {
        backgroundColor: "#25d366",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        minWidth: 80,
        alignItems: "center",
    },
    sendButtonDisabled: {
        backgroundColor: "#666",
    },
    sendText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    sendTextDisabled: {
        color: "#ccc",
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: width,
        height: height * 0.7,
        maxWidth: width,
        maxHeight: height * 0.7,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingBottom: Platform.OS === "ios" ? 34 : 20,
    },
    footerButton: {
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    footerIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    footerText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "500",
    },
});

export { ImagePreviewModal };