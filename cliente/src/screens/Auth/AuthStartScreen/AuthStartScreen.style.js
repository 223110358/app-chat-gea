import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    content: {
        flex: 1,
        margin:20,
        marginTop:0,
        justifyContent: "center",
    },
    img: {
        width: "100%",
        height: 400,
        resizeMode: "contain",
        marginVertical:20,
    },
    title:{
        color:"#1a4705",
        textAlign:"center",
        fontSize:28,
        fontWeight:"bold",
        marginBottom:20,

    },
    description:{
        color:"#ffffff",
        opacity:0.6,
        textAlign:"center",
        marginBottom:35,
    },
    btn:{
        color:"#1a4705",
        fontWeight:"600",
        fontSize:22,
        textAlign:"center",
    }
});