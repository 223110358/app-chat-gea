import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Text, TouchableOpacity, View } from 'react-native';
import { User } from '../../../api';
import { screens } from "../../../Utils";
import { styles } from './Options.styles';

export function Options(props) {
    const{accessToken,logout,updateUser} = props;
    const navigation = useNavigation();
    const openGallery = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        try {
          const userApi = new User();
          const updatedUser = await userApi.updateAvatar(accessToken, imageUri);
          if (updatedUser && updatedUser.avatar) {
            updateUser("avatar", updatedUser.avatar);
          } else {
            console.warn("updateAvatar returned no user data", updatedUser);
          }
        }catch (error) {
          console.error("Error al subir imagen", error);
        }
    }
  }
  const goToChangeFirstname = () => {
    navigation.navigate(screens.tab.settings.changeFirstnameScreen);
  }
  const goToChangeLastname = () => {
    navigation.navigate(screens.tab.settings.changeLastnameScreen);
  }
  return (
    <View style={styles.content}>
      <TouchableOpacity style={styles.item} onPress={openGallery}>
        <Text style={styles.text} >Cambiar foto de perfil</Text>
      </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={goToChangeFirstname}>
        <Text style={styles.text}>Cambiar nombre</Text>
      </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={goToChangeLastname}>
        <Text style={styles.text}>Cambiar apellido</Text>
      </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
        <Text style={styles.itemClose} onPress={logout}
        
        >Cerrar sesion</Text>
      </TouchableOpacity>
    </View>
  )
}