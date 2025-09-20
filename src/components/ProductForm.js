import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from "react-native";
import {
    TextInput,
    Button,
    Card,
    Text,
    ActivityIndicator,
    Chip,
    Divider,
} from "react-native-paper";
import { supabase } from "../config/supabase";
import ImageUpload from "./ImageUpload";
// import LocationPicker from "./LocationPicker"; // ฟังก์ชันแสดงแผนที่
const ProductForm = ({
    product = null, // null สำหรับสร้างใหม่, object สำหรับแก้ไข
    onSave,
    onCancel,
    navigation
    // selectedLocation, // ฟังก์ชันแสดงแผนที่
    // fromMapPicker // ฟังก์ชันแสดงแผนที่
}) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    // const [location, setLocation] = useState({ // ฟังก์ชันแสดงแผนที่
    //   lat: null,
    //   lng: null,
    //   address: ""
    // });

    // Load categories และ product data
    useEffect(() => {
        loadCategories();
        if (product) {
            loadProductData();
        }
    }, [product]);

    // สำหรับรับค่าจาก MapPicker - ฟังก์ชันแสดงแผนที่
    // useEffect(() => {
    //   if (fromMapPicker && selectedLocation) {
    //     setLocation(selectedLocation);
    //   }
    // }, [fromMapPicker, selectedLocation]);

    const loadCategories = async () => {
        try {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("name");
            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error("Error loading categories:", error);
            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลหมวดหมู่ได้");
        }
    };

    const loadProductData = () => {
        if (product) {
            setName(product.name || "");
            setDescription(product.description || "");
            setPrice(product.price?.toString() || "");
            setImageUrl(product.image_url || "");
            // setLocation({ // ฟังก์ชันแสดงแผนที่
            //   lat: product.location_lat,
            //   lng: product.location_lng,
            //   address: product.location_address || ""
            // });
            setSelectedCategory(product.category_id);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!name.trim()) {
            Alert.alert("เกิดข้อผิดพลาด", "กรุณาใส่ชื่อสินค้า");
            return;
        }
        if (!price.trim() || isNaN(parseFloat(price))) {
            Alert.alert("เกิดข้อผิดพลาด", "กรุณาใส่ราคาที่ถูกต้อง");
            return;
        }
        if (!selectedCategory) {
            Alert.alert("เกิดข้อผิดพลาด", "กรุณาเลือกหมวดหมู่สินค้า");
            return;
        }

        setLoading(true);
        try {
            const productData = {
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                category_id: selectedCategory,
                // location_lat: location.lat, // ฟังก์ชันแสดงแผนที่
                // location_lng: location.lng, // ฟังก์ชันแสดงแผนที่
                // location_address: location.address, // ฟังก์ชันแสดงแผนที่
                image_url: imageUrl,
                updated_at: new Date().toISOString()
            };

            // ตรวจสอบ RLS policies เพื่อความปลอดภัย
            const user = await supabase.auth.getUser();
            const userId = user.data.user?.id;
            console.log("✅ Current user ID:", userId);

            if (!userId) {
                throw new Error("ไม่ได้รับอนุญาต - กรุณาเข้าสู่ระบบ");
            }

            let result;
            if (product) {
                // Update existing product
                console.log("✍️ Updating product:", product.id, productData);
                const { data, error } = await supabase
                    .from("products")
                    .update(productData)
                    .eq("id", product.id)
                    .select();
                if (error) {
                    console.error("❌ Update Error:", error);
                    throw error;
                }
                if (!data || data.length === 0) {
                    console.error("❌ No rows updated - product not found or no permission");
                    throw new Error("ไม่สามารถอัปเดตข้อมูลได้");
                }
                result = data[0];
            } else {
                // Create new product
                console.log("✨ Creating product:", { ...productData, created_by: userId });
                const { data, error } = await supabase
                    .from("products")
                    .insert([{
                        ...productData,
                        created_by: userId
                    }])
                    .select();
                if (error) {
                    console.error("❌ Insert Error:", error);
                    throw error;
                }
                if (!data || data.length === 0) {
                    console.error("❌ No rows inserted - check RLS policies");
                    throw new Error("ไม่สามารถสร้างประกาศได้ - โปรดตรวจสอบสิทธิ์");
                }
                result = data[0];
            }
            console.log("✔️ Product saved successfully:", result);
            Alert.alert(
                "สำเร็จ",
                product ? "แก้ไขประกาศเรียบร้อยแล้ว" : "สร้างประกาศเรียบร้อยแล้ว",
                [{ text: "ตกลง", onPress: () => onSave && onSave(result) }]
            );
        } catch (error) {
            console.error("Error saving product:", error);
            Alert.alert("เกิดข้อผิดพลาด", error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (!product) return;
        Alert.alert(
            "ยืนยันการลบ",
            "คุณแน่ใจหรือไม่ว่าต้องการลบ?",
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ลบ",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const { error } = await supabase
                                .from("products")
                                .delete()
                                .eq("id", product.id);
                            if (error) throw error;
                            Alert.alert("สำเร็จ", "ลบประกาศเรียบร้อยแล้ว", [
                                { text: "ตกลง", onPress: () => onSave && onSave(null) }
                            ]);
                        } catch (error) {
                            console.error("Error deleting product:", error);
                            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถลบประกาศได้");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="headlineSmall" style={styles.title}>
                        {product ? "แก้ไขประกาศ" : "สร้างประกาศใหม่"}
                    </Text>

                    {/* ชื่อสินค้า */}
                    <TextInput
                        label="ชื่อสินค้า"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        mode="outlined"
                        disabled={loading}
                    />

                    {/* รายละเอียด */}
                    <TextInput
                        label="รายละเอียด"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        disabled={loading}
                    />

                    {/* ราคา */}
                    <TextInput
                        label="ราคา"
                        value={price}
                        onChangeText={setPrice}
                        style={styles.input}
                        mode="outlined"
                        keyboardType="numeric"
                        disabled={loading}
                    />

                    {/* หมวดหมู่สินค้า */}
                    <Text style={styles.sectionTitle}>หมวดหมู่สินค้า *</Text>
                    <View style={styles.chipContainer}>
                        {categories.map((category) => (
                            <Chip
                                key={category.id}
                                selected={selectedCategory === category.id}
                                onPress={() => setSelectedCategory(category.id)}
                                style={styles.chip}
                                disabled={loading}
                            >
                                {category.name}
                            </Chip>
                        ))}
                    </View>

                    {/* รูปภาพ */}
                    <Text style={styles.sectionTitle}>รูปภาพ</Text>
                    <ImageUpload
                        imageUrl={imageUrl}
                        setImageUrl={setImageUrl}
                        disabled={loading}
                    />

                    {/* Location - ฟังก์ชันแสดงแผนที่ */}
                    {/* <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>
             สถานที่นัดรับสินค้า 
          </Text>
          <LocationPicker
            location={location}
            setLocation={setLocation}
            navigation={navigation}
            disabled={loading}
          /> */}
                </Card.Content>
            </Card>

            {/* ปุ่มกด */}
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.saveButton}
                    loading={loading}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        product ? "บันทึกการแก้ไข" : "สร้างประกาศ"
                    )}
                </Button>
                <Button
                    mode="outlined"
                    onPress={onCancel}
                    style={styles.cancelButton}
                    disabled={loading}
                >
                    ยกเลิก
                </Button>
                {product && (
                    <Button
                        mode="contained"
                        buttonColor="red"
                        onPress={handleDelete}
                        style={styles.deleteButton}
                        disabled={loading}
                    >
                        ลบประกาศ
                    </Button>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    title: {
        textAlign: "center",
        marginBottom: 20,
        color: "#FF6B35",
    },
    input: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 16,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    divider: {
        marginVertical: 16,
    },
    buttonContainer: {
        marginTop: 20,
    },
    saveButton: {
        marginBottom: 12,
    },
    cancelButton: {
        marginBottom: 12,
    },
    deleteButton: {
        marginBottom: 12,
    },
});

export default ProductForm;