import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../hooks";

const FloatingMenu = ({ onCameraPress, onGalleryPress }) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const [isOpen, setIsOpen] = useState(false);
    const [scaleAnim] = useState(new Animated.Value(0));

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

    const toggleMenu = () => {
        if (isOpen) closeMenu();
        else openMenu();
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
            {isOpen && (
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={closeMenu}
                    activeOpacity={1}
                />
            )}

            <Animated.View
                style={[
                    styles.menu,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: scaleAnim,
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleCameraPress}
                >
                    <View style={styles.menuItemIcon}>
                        <MaterialCommunityIcons name="camera" size={20} color={colors.primaryText} />
                    </View>
                    <Text style={styles.menuItemText}>Camara</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleGalleryPress}
                >
                    <View style={styles.menuItemIcon}>
                        <MaterialCommunityIcons name="image" size={20} color={colors.primaryText} />
                    </View>
                    <Text style={styles.menuItemText}>Galeria</Text>
                </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
                style={styles.fab}
                onPress={toggleMenu}
                activeOpacity={0.7}
            >
                <MaterialCommunityIcons name="paperclip" size={22} color={colors.text} />
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (colors) => StyleSheet.create({
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
        width: 42,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.border,
    },
    menu: {
        position: "absolute",
        bottom: 50,
        left: 0,
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingVertical: 8,
        borderColor: colors.border,
        borderWidth: 1,
        minWidth: 140,
        zIndex: 101,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginHorizontal: 4,
        borderRadius: 8,
    },
    menuItemIcon: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.primary,
        borderRadius: 8,
        marginRight: 12,
    },
    menuItemText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "600",
    },
});

export { FloatingMenu };
