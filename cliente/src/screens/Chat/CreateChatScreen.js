import { useNavigation } from "@react-navigation/native";
import { CloseIcon, IconButton } from "native-base";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { User } from "../../api";
import { CreateChat, Search } from "../../components/Chat";
import { useAuth } from "../../hooks";

const userController = new User();
export function CreateChatScreen() {
    const navigation = useNavigation();
    const { accessToken } = useAuth();
    const[users,setUsers] = useState(null);
    const[usersResult,setUserResult] = useState(null);
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                icon={<CloseIcon  />}
                padding={5}
                onPress={navigation.goBack}
                />
            )
        });
    },[]);
    useEffect(() => {
        (async () => {
            try {
                const response = await userController.getAll(accessToken);
                console.log("Usuarios obtenidos:", response);
                setUsers(response);
                setUserResult(response);
            }
            catch (error) {
                console.error(error);
            }      
        })(); 
    },[]);
    if (!usersResult)  return null;
    return(
        <View>
            <Search data ={users} setData={setUserResult}/>
            <CreateChat.ListUsers users={usersResult} />
        </View>
    )
}