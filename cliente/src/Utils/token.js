import { jwtDecode } from "jwt-decode";
export function hasExpiriedToken(token) {
    const {exp } = jwtDecode(token);
    const currentDate = new Date().getTime();
    const expirationDate = exp > 9999999999 ? exp : exp * 1000;
    if (expirationDate <= currentDate){
        return true;
    }
    return false
}
