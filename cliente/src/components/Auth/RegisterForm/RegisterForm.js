import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { Button, TextInput, View } from "react-native";
import { Auth } from "../../../api";
import { initialValues, validationSchema } from "./RegisterForm.form.js";
import { styles } from "./RegisterForm.styles.js";

const authController = new Auth();

export function RegisterForm(){
    const navigation = useNavigation();
    const formik = useFormik({
        initialValues:initialValues(),
        validationSchema:validationSchema(),
        validateOnChange:false,
        onSubmit:async (formValue)=>{
            console.log("Formulario enviado:",formValue);
            try{
                await authController.register(formValue.email,formValue.password);
                navigation.goBack()
             }catch(error){
                console.error("Error al registrar:",error)
            }
    } })
    return(
        <View>
            <View style={styles.viewInput}>
                <TextInput 
                placeholder="E-mail"
                style={[styles.input, formik.errors.email && styles.inputError]}
                variant="unstyled" 
                autoCapitalize="none"
                value={formik.values.email}
                onChangeText={(text)=>formik.setFieldValue("email",text)}
                />

            </View>
            <View>
                <TextInput 
                    placeholder="Password"
                    variant="unstyled" 
                    secureTextEntry
                    autoCapitalize="none"
                    value={formik.values.password}
                    onChangeText={(text)=>formik.setFieldValue("password",text)} 
                    style={[styles.input, formik.errors.password && styles.inputError]}
                />
            </View>
            <View style ={styles.btnContainer}>
                <Button 
                title="Crear cuenta" 
                onPress={formik.handleSubmit}
                isloading={formik.isSubmitting}
                />     
            </View>
            
        </View>
    )
}