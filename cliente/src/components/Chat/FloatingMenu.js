import React, { useState } from "react";
import {
    View,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const FloatingMenu = ({ onCameraPress, onGalleryPress }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scaleAnim] = useState(new Animated.Value(0));

    const toggleMenu = () => {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    const openMenu = () => {
        setIsOpen(true);
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    };

    const closeMenu = () => {
        Animated.spring(scaleAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start(() => setIsOpen(false));
    };

    const handleCameraPress = () => {
        closeMenu();
        onCameraPress();
    };

    const handleGalleryPress = () => {
        closeMenu();
        onGalleryPress();
    };

    return (
        <View style={styles.container}>
            {/* Overlay */}
            {isOpen && (
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={closeMenu}
                    activeOpacity={1}
                />
            )}

            {/* Menú flotante */}
            <Animated.View
                style={[
                    styles.menu,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: scaleAnim,
                    },
                ]}
            >
                {/* Opción Cámara */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleCameraPress}
                >
                    <View style={styles.menuItemIcon}>
                        <MaterialCommunityIcons name="camera" size={20} color="#fff" />
                    </View>
                    <Text style={styles.menuItemText}>Cámara</Text>
                </TouchableOpacity>

                {/* Opción Galería */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleGalleryPress}
                >
                    <View style={styles.menuItemIcon}>
                        <MaterialCommunityIcons name="image" size={20} color="#fff" />
                    </View>
                    <Text style={styles.menuItemText}>Galería</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Botón flotante */}
            <TouchableOpacity
                style={styles.fab}
                onPress={toggleMenu}
                activeOpacity={0.7}
            >
                <Text style={styles.fabIcon}>📎</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    overlay: {
        position: "absolute",
        top: -300,
        left: -300,
        right: -300,
        bottom: -300,
        zIndex: 100,
    },
    fab: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "transparent",
    },
    fabIcon: {
        fontSize: 20,
        color: "#fff",
    },
    menu: {
        position: "absolute",
        bottom: 50,
        left: 0,
        backgroundColor: "#2a2d38",
        borderRadius: 16,
        paddingVertical: 8,
        borderColor: "#3a3d48",
        borderWidth: 1,
        minWidth: 140,
        zIndex: 101,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginHorizontal: 4,
        borderRadius: 12,
    },
    menuItemIcon: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1e2029",
        borderRadius: 10,
        marginRight: 12,
    },
    menuIcon: {
        fontSize: 18,
    },
    menuItemText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "500",
    },
});

export { FloatingMenu };
