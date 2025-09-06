
import { MyHeader } from "../Component/MyHeader";
import { View, StyleSheet, Text, Button } from "react-native";
import { useState } from "react";
import Summary from "../Component/Summary";

export const HomeScreen = () => {
    const [data, setData] = useState(0);

    return (
        <View style={styles.container}>
            <MyHeader />
            <View style={styles.body}>
                <Text style={styles.bodyText}>My data is: {data}</Text>
                <Button title="Click me" onPress={() => setData(data + 1)} />
                    <Summary proptData={data} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    body: {
        flex: 1,
        padding: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    bodyText: {
        fontSize: 18,
        color: "a333",

    },


});

export default HomeScreen;