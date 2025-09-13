// screens/HomeScreen.js
import { View,  StyleSheet } from 'react-native';
import {Button,Text} from 'react-native-paper';
import React from 'react';
 
 
const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>หน้าหลัก(Home Screen)</Text>
            <Button
                title="ไปที่หน้ารายละเอียด"
                mode = "contained"
                style = {styles.button}
                onPress={() => navigation.navigate('Details', {
                    itemId: 101,
                    title: "บทความแรก",
                })
            }
            >
                ไปที่หน้ารายละเอียด
            </Button>
            <Button
                title="ไปที่หน้ารายละเอียด"
                mode = "contained"
                style = {styles.button}
                    name="DataScreen"
                onPress={() => navigation.navigate('Data')
 
                }
            >
                    ไปที่หน้าข้อมูล
                </Button>
           
        </View>
 
    );
};
 
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        marginBottom: 10,
 
    }
});
 
export default HomeScreen;
 
 