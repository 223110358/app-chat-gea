import { jwtDecode } from "jwt-decode";
export function hasExpiriedToken(token) {
    const {exp } = jwtDecode(token);
    const currentDate =new Date().getDate();
    if (exp <= currentDate){
        return true;
    } // Convertir a segundos
    console.log(exp)
    return false
}