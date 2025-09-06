import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";

export const Summary = ({ proptData }) => {
    const[price, setPrice] = useState(0);

    useEffect(() => {

        const calculatePrice = (quantity) => {
            const uniPrice = 50;
            const total = quantity * uniPrice;
            setPrice(total);
            console.log(`ราคาราวม: ${total} บาท`);
        };

        calculatePrice(proptData);
    }, [proptData]);

    return (
        <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>This is Summary Component {price}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    summaryContainer: {
        padding: 20,
        backgroundColor: "#ede8e8",
        alignItems: "center",
    },
    summaryText: {
        fontSize: 18,
        color: "#333",
    },
});

export default Summary;