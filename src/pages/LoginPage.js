// ไฟล์: LoginFrom.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // <-- Import useNavigation
import LoginForm from "../components/LoginFrom";

const LoginPage = () => {
  const navigation = useNavigation(); // <-- เรียกใช้งาน Hook

  return (
    <View >
      <LoginForm/>
      {/* ... ส่วนของ UI สำหรับ email และ password ... */}
    </View>
  );
};

const styles = StyleSheet.create({
  // ... Styles อื่นๆ ...
  link: {
    // กำหนด style ให้กับ TouchableOpacity
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
    // กำหนด style ให้กับข้อความ
    color: '#6200ea',
    textDecorationLine: 'underline',
  },
});

export default LoginPage;