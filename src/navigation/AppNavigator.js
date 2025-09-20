import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { useAuth } from "../AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import HomeScreen from "../pages/HomeScreen";
import LoginPage from "../pages/LoginPage";
import DataScreen from "../pages/DataScreen";
import DetailsScreen from "../pages/DetailsScreen";
import RegisterScreen from "../pages/RegisterScreen";
import ForgetPasswordScreen from "../pages/ForgetPasswordScreen";
import ProductsScreen from "../pages/ProductsScreen";
import ProductFormScreen from "../pages/ProductFormScreen";
import ProductDetailScreen from "../pages/ProductDetailScreen";
import MapPickerScreen from "../pages/MapPickerScreen";

const Stack = createNativeStackNavigator();

// Auth Stack สำหรับผู้ใช้ที่ยังไม่ได้ล็อกอิน
const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{
          title: "เข้าสู่ระบบ",
          headerShown: false // ซ่อนแถบนำทางด้านบน
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "สร้างบัญชีใหม่",
          headerBackTitle: "ย้อนกลับ"
        }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPasswordScreen}
        options={{
          title: "ลืมรหัสผ่าน",
          headerBackTitle: "ย้อนกลับ"
        }}
      />
    </Stack.Navigator>
  );
};

// Main Stack สำหรับผู้ใช้ที่ล็อกอินแล้ว
const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="Products">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "หน้าหลัก",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: "รายละเอียด",
          headerBackTitle: "ย้อนกลับ"
        }}
      />
      <Stack.Screen
        name="Data"
        component={DataScreen}
        options={{
          title: "หน้าข้อมูล",
          headerBackTitle: "ย้อนกลับ"
        }}
      />
      <Stack.Screen
        name="DataDetail"
        component={DataDetailScreen}
        options={{
          title: "รายละเอียดข้อมูล",
          headerBackTitle: "ย้อนกลับ"
        }}
      />
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={({ navigation }) => ({
          title: "ประกาศซื้อขาย",
          headerBackTitle: "ย้อนกลับ",
          headerRight: () => (
            <IconButton
              icon="plus-circle-outline"
              size={30}
              onPress={() => navigation.navigate("ProductForm")}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={({ route }) => ({
          title: route.params?.product ? "แก้ไขประกาศ" : "สร้างประกาศใหม่",
          headerBackTitle: "ย้อนกลับ"
        })}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: "รายละเอียดประกาศ",
          headerBackTitle: "ย้อนกลับ"
        }}
      />
      <Stack.Screen
        name="MapPicker"
        component={MapPickerScreen}
        options={{
          title: "เลือกตำแหน่ง",
          headerBackTitle: "ย้อนกลับ"
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>

    
  );
};
export default AppNavigator;
