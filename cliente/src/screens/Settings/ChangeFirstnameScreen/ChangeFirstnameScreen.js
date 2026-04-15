import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { Button, Input } from "native-base";
import { StyleSheet, View } from "react-native";
import { User } from "../../../api";
import { useAuth, useTheme } from "../../../hooks";
import { initialValues, validationSchema } from "./ChangeFirstnamesScreen.form";

const userController = new User();

export function ChangeFirstnameScreen() {
    const navigation = useNavigation();
    const { accessToken, updateUser } = useAuth();
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchema(),
        validateOnChange: false,
        onSubmit: async (formValue) => {
            try {
                const dataUser = { firstname: formValue.firstname };
                await userController.updateUser(accessToken, dataUser);
                updateUser("firstname", formValue.firstname);
                navigation.goBack();
            } catch (error) {
                console.error(error);
            }
        },
    });

    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <Input
                    placeholder="Escribe tu nombre"
                    style={[styles.input, formik.errors.firstname && styles.inputError]}
                    variant="unstyled"
                    autoFocus
                    value={formik.values.firstname}
                    onChangeText={(text) => formik.setFieldValue("firstname", text)}
                    placeholderTextColor={colors.muted}
                />
                <Button
                    style={styles.btn}
                    onPress={formik.handleSubmit}
                    isLoading={formik.isSubmitting}
                >
                    Cambiar nombre
                </Button>
            </View>
        </View>
    );
}

const createStyles = (colors) => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    content: {
        width: "100%",
        maxWidth: 520,
        alignSelf: "center",
    },
    input: {
        minHeight: 46,
        backgroundColor: colors.input,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        color: colors.text,
        fontSize: 16,
        paddingHorizontal: 12,
        marginVertical: 5,
    },
    btn: {
        marginTop: 10,
        backgroundColor: colors.primary,
        borderRadius: 8,
    },
    inputError: {
        borderColor: colors.danger,
        backgroundColor: colors.dangerSoft,
    },
});
