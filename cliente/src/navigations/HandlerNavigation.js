import { AuthNavigation } from './stacks';

import { useAuth } from '../hooks/useAuth';
import AppNavigation from './AppNavigation.js';

export function HandlerNavigation() {
    const { user } = useAuth(); //TODO: cambiar por la logica de autenticacion
    return user ? <AppNavigation/> : <AuthNavigation/>
    
}