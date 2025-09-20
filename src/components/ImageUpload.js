import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button, Card, Text, ActivityIndicator } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../config/supabase";

const ImageUpload = ({
  imageUrl,
  onImageChange,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);

  // ฟังก์ชันสำหรับอัปโหลดรูปภาพ
  const uploadImage = async (imageUri) => {
    try {
      setUploading(true);
      console.log("✍️ กำลังอัปโหลดรูปภาพ:", imageUri);

      // สร้าง unique filename
      const timestamp = Date.now();
      const filename = `product_${timestamp}.jpg`;
      console.log("ℹ️ Filename:", filename);

      // แปลงไฟล์เป็นข้อมูลไบนารีสำหรับ Supabase Storage
      // โดยใช้ fetch API
      const response = await fetch(imageUri);
      const arrayBuffer = await response.arrayBuffer();

      console.log("📄 File info:", {
        size: arrayBuffer.byteLength,
        type: 'image/jpeg'
      });

      // ตรวจสอบขนาดไฟล์
      if (arrayBuffer.byteLength === 0) {
        throw new Error("ไฟล์รูปภาพมีขนาดเป็นศูนย์");
      }

      // อัปโหลดไฟล์โดยตรงไปยัง Supabase client
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filename, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) {
        console.error("❌ Upload Error:", error);
        throw error;
      }
      console.log("✔️ Upload Success:", data);

      // ตรวจสอบไฟล์ใน bucket
      const { data: fileList, error: listError } = await supabase.storage
        .from("product-images")
        .list();
      if (listError) {
        console.error("❌ List Error:", listError);
      } else {
        console.log("📂 Files in bucket:", fileList);
        const uploadedFile = fileList.find(file => file.name === filename);
        console.log("✅ Uploaded file found:", uploadedFile);
      }

      // รับ public URL จาก path ที่ได้จาก upload result
      const filePath = data.path || filename;
      console.log("ℹ️ File path from upload:", filePath);

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      console.log("🔗 Public URL:", publicUrl);

      // สำหรับ Debugging
      console.log("ℹ️ Filename used:", filename);
      console.log("✨ Bucket name:", "product-images");
      console.log("📂 File path:", filePath);
      
      // ทดสอบ URL ที่ได้มา
      try {
        const testResponse = await fetch(publicUrl, { method: 'HEAD' });
        console.log("✅ URL Test Response:", {
          status: testResponse.status,
          statusText: testResponse.statusText,
          headers: Object.fromEntries(testResponse.headers.entries())
        });
      } catch (testError) {
        console.error("❌ URL Test Error:", testError);
      }

      onImageChange(publicUrl);

    } catch (error) {
      console.error("❌ Error uploading image:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถอัปโหลดรูปภาพได้: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // ฟังก์ชันสำหรับเลือกรูปภาพจาก Gallery
  const pickImageFromGallery = () => {
    Alert.alert(
      "เลือกรูปภาพ",
      "คุณต้องการเลือกรูปภาพจากคลังภาพหรือถ่ายภาพใหม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "คลังภาพ",
          onPress: async () => {
            try {
              // ขอสิทธิ์การเข้าถึงคลังภาพ
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert("เกิดข้อผิดพลาด", "ไม่ได้รับอนุญาตให้เข้าถึงคลังภาพ");
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                uploadImage(result.assets[0].uri);
              }
            } catch (error) {
              console.error("Error picking image:", error);
              Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถเลือกรูปภาพได้");
            }
          }
        },
        {
          text: "กล้อง",
          onPress: async () => {
            try {
              // ตรวจสอบ/ขอสิทธิ์การใช้กล้อง
              const cameraAvailable = await ImagePicker.getCameraPermissionsAsync();
              if (!cameraAvailable.granted) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert(
                    "ไม่ได้รับอนุญาตให้เข้าถึงกล้อง", 
                    "คุณต้องอนุญาตให้แอปเข้าถึงกล้องเพื่อใช้คุณสมบัตินี้",
                    [
                      { text: "ยกเลิก", style: "cancel" },
                      { text: "ไปที่การตั้งค่า", onPress: () => ImagePicker.requestCameraPermissionsAsync() }
                    ]
                  );
                  return;
                }
              }

              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                exif: false,
              });

              if (!result.canceled && result.assets && result.assets[0]) {
                uploadImage(result.assets[0].uri);
              }
            } catch (error) {
              console.error("Error taking photo:", error);
              let errorMessage = "ไม่สามารถถ่ายภาพได้";
              if (error.message.includes("Camera not available")) {
                errorMessage = "กล้องไม่พร้อมใช้งาน โปรดตรวจสอบว่ามีกล้องเชื่อมต่ออยู่";
              } else if (error.message.includes("Permission")) {
                errorMessage = "ไม่ได้รับอนุญาตให้เข้าถึงกล้อง";
              }
              Alert.alert("เกิดข้อผิดพลาด", errorMessage);
            }
          }
        }
      ]
    );
  };

  // ฟังก์ชันสำหรับลบรูปภาพ
  const removeImage = () => {
    Alert.alert(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ลบ",
          style: "destructive",
          onPress: () => onImageChange("")
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Card style={styles.imageCard}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={removeImage}
              style={styles.removeButton}
              disabled={disabled}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.imageText}>รูปภาพที่เลือก</Text>
        </Card>
      ) : (
        <TouchableOpacity
          onPress={pickImageFromGallery}
          disabled={disabled || uploading}
        >
          <Card style={styles.uploadCard}>
            <View style={styles.uploadContent}>
              <ActivityIndicator
                animating={uploading}
                size="large"
                style={uploading && { marginBottom: 12 }}
              />
              <Text style={styles.uploadText}>
                {uploading ? "กำลังอัปโหลด..." : "แตะเพื่อเลือกรูปภาพ"}
              </Text>
              {uploading ? (
                <Button
                  mode="outlined"
                  disabled={true}
                  style={styles.uploadButton}
                >
                  กำลังอัปโหลด
                </Button>
              ) : (
                <Button
                  icon="image-plus"
                  mode="outlined"
                  onPress={pickImageFromGallery}
                  style={styles.uploadButton}
                >
                  เลือกรูปภาพ
                </Button>
              )}
            </View>
          </Card>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  imageCard: {
    marginBottom: 8,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageText: {
    textAlign: "center",
    marginTop: 8,
    color: "#666",
  },
  uploadCard: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  uploadContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  uploadText: {
    marginBottom: 12,
    color: "#666",
    textAlign: "center",
  },
  uploadButton: {
    borderColor: "#FF6B35",
  },
});

export default ImageUpload;