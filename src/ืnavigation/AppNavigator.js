// navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//นำเข้า Component หน้าจอที่เราสร้างไว้
import HomeScreen from "../pages/HomeScreen";
import DetailsScreen from "../pages/DetailsScreen";
import LoginPage from "../pages/LoginPage";
import DataScreen from "../pages/DataScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen
          name="Data"
          component={DataScreen}
          options={{ title: "Data" }}
        />
        <Stack.Screen
            name="Home"    
            component={HomeScreen}
            options={{ title: "หน้าหลักของฉัน" }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ title: "รายละเอียด" }}
        />
        <Stack.Screen
          name="login"
          component={LoginPage}
          options={{ title: "เข้าสู่ระบบ" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default AppNavigator;
