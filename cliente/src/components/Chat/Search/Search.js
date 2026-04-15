import { Input } from 'native-base';
import { View } from 'react-native';
//import {createFilter} from "reac"
import { createFilter } from "react-search-input";
import { useTheme } from '../../../hooks';
import { createStyles } from './Search.styles';

const KEYS_TO_FILTERS = ["email","firstname","lastname"];

export function Search(props) {
    const { data, setData } = props;
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const onSearch = (text) => {
        const resultSearch = data.filter(createFilter(text,KEYS_TO_FILTERS));
        setData(resultSearch)
        };
    return (
        <View style={styles.content}>
        <Input 
        placeholder="Buscar" 
        variant="unstyled"
        style={styles.input}
        placeholderTextColor={colors.muted}
        onChangeText={onSearch}
        />
        </View>
    )
}
