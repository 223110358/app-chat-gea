import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    content:{
        paddingHorizontal: 10,
        marginBottom:50,
        paddingBottom: 50,
    },
    item:{
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        paddingVertical: 10,
        alignItems: "center",
    },
    name:{
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
    },
    email:{
        color: "#ffffff",
        opacity: 0.7,
        marginTop: 2,
    }
})