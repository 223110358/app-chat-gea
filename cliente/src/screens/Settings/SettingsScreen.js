import { SafeAreaView } from "react-native-safe-area-context";
import { Options, UserInfo } from "../../components/Settings";
import { useAuth } from "../../hooks";

export function SettingsScreen() {
    const {user,logout,accessToken,updateUser} = useAuth();
    return(
        <SafeAreaView>
            <UserInfo user={user}/>
            <Options
            accessToken={accessToken}
            logout={logout}
            updateUser={updateUser}
            ></Options>
        </SafeAreaView>
    )
}