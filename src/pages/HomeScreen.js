import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, Appbar } from "react-native-paper";
import { useAuth } from "../AuthContext";

const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "ยืนยันการออกจากระบบ",
      "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
      [
        {
          text: "ยกเลิก",
          style: "cancel"
        },
        {
          text: "ออกจากระบบ",
          style: "destructive",
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert("เกิดข้อผิดพลาด", error.message);
            } else {
              Alert.alert("สำเร็จ", "ออกจากระบบเรียบร้อยแล้ว");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="หน้าหลัก" color="white" />
        <Appbar.Action icon="logout" onPress={handleLogout} color="white" />
      </Appbar.Header>
      
      <View style={styles.content}>
        <Text style={styles.text}>ยินดีต้อนรับสู่แอปพลิเคชัน</Text>
        {user && (
          <Text style={styles.userText}>คุณเข้าสู่ระบบในชื่อ: {user.email}</Text>
        )}
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() =>
              navigation.navigate("Details", {
                itemId: 101,
                title: "ตัวอย่าง",
              })
            }
          >
            ไปที่หน้ารายละเอียด
          </Button>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate("Data")}
          >
            ไปที่หน้าข้อมูล
          </Button>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate("Products")}
          >
            ไปที่หน้าประกาศ
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6200ea',
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  userText: {
    fontSize: 16,
    marginBottom: 30,
    color: "#666",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  button: {
    marginBottom: 15,
  },
});

export default HomeScreen;
