import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon, IconButton } from "native-base";
export function IconBack() {
    const navigation = useNavigation();
    return (
        <IconButton 
            icon={<ChevronLeftIcon 
                padding={0}  />}
            onPress={() => navigation.goBack()}
        />
        
    );
}