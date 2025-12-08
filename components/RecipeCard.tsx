import { fallbackImg } from "@/constants/fallbackImage";
import { Feather } from "@expo/vector-icons";
import {
    Image,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

export interface Recipe {
    id: number;
    title: string;
    time: string;
    imageUri?: string;
    style?: StyleProp<ViewStyle>;
    onPress: () => void;
}

export const RecipeCard: React.FC<Recipe> = ({
    title,
    time,
    imageUri,
    style,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={[styles.recipeCardContainer, style]}
            onPress={onPress}
        >
             <Image
                    resizeMode="cover"
                    source={{
                        uri:
                            imageUri ??
                            fallbackImg,
                    }}
                    style={{
                        width: "100%",
                        aspectRatio: 1,
                        marginBottom: 10,
                    }}
                />
                <Text style={styles.recipeCardName}>{title}</Text>
                <View style={styles.timeInfoContainer}>
                    <Feather
                        name="clock"
                        size={14}
                        color="black"
                        style={{
                            margin: 0,
                        }}
                    />
                    <Text style={styles.recipeCardTime}>{time}</Text>
                </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    recipeCardContainer: {
        // Ajustado para o novo layout de View + wrap
        width: "48%", // Pouco menos de 1/3 para deixar margem
        marginBottom: 10,
        backgroundColor: "#e5e6e5ff",
        borderRadius: 8,
        alignItems: "flex-start",
        overflow: "hidden",
        justifyContent: 'space-evenly'
    },
    recipeCardImagePlaceholder: {
        width: "100%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    recipeCardName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        paddingHorizontal: 8,
        marginTop: 4,
        
    },
    recipeCardTime: {
        fontSize: 12,
        color: "#777",
    },
    timeInfoContainer: {
        marginTop: 5,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "flex-start",
        paddingHorizontal: 8,
        paddingBottom: 8,
        gap: 9,
    },
});
