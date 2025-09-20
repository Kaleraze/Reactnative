import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    Linking,
} from "react-native";
import {
    Card,
    Text,
    Button,
    Chip,
    IconButton,
    ActivityIndicator,
} from "react-native-paper";
import { useAuth } from "../AuthContext";

const ProductDetailScreen = ({ navigation, route }) => {
    const { product: initialProduct } = route.params;
    const { user } = useAuth();
    const [product, setProduct] = useState(initialProduct);
    const [loading, setLoading] = useState(false);

    const isOwner = user?.id === product?.created_by;

    useEffect(() => {
        if (initialProduct) {
            setProduct(initialProduct);
        }
    }, [initialProduct]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("th-TH", {
            style: "currency",
            currency: "THB",
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleEdit = () => {
        navigation.navigate("ProductForm", { product });
    };

    const handleDelete = () => {
        Alert.alert(
            "ยืนยันการลบ",
            `คุณแน่ใจหรือไม่ว่าต้องการลบประกาศ "${product.name}" นี้?`,
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ลบ",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            // TODO: Implement delete functionality
                            // const { error } = await supabase
                            //   .from("products")
                            //   .delete()
                            //   .eq("id", product.id);
                            //
                            // if (error) throw error;
                            Alert.alert("ลบสำเร็จ", "ประกาศถูกลบเรียบร้อยแล้ว", [
                                { text: "ตกลง", onPress: () => navigation.goBack() }
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

    const handleCall = () => {
        // TODO: Implement call functionality
        Alert.alert("ยังไม่พร้อมใช้งาน", "ฟังก์ชันการโทรยังอยู่ระหว่างการพัฒนา");
    };

    const handleMessage = () => {
        // TODO: Implement message functionality
        Alert.alert("ยังไม่พร้อมใช้งาน", "ฟังก์ชันการส่งข้อความยังอยู่ระหว่างการพัฒนา");
    };

    const handleShare = () => {
        // TODO: Implement share functionality
        Alert.alert("ยังไม่พร้อมใช้งาน", "ฟังก์ชันการแชร์ยังอยู่ระหว่างการพัฒนา");
    };

    // const handleLocationPress = () => { // ฟังก์ชันแสดงแผนที่
    //   if (product.location_lat && product.location_lng) {
    //     const url = `http://maps.google.com/maps?q=${product.location_lat},${product.location_lng}`;
    //     Linking.openURL(url).catch(() => {
    //       Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถเปิดแผนที่ได้");
    //     });
    //   }
    // };

    if (!product) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" />
                <Text style={styles.loadingText}>กำลังโหลด...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.imageContainer}>
                {/* รูปภาพสินค้า */}
                {product.image_url && (
                    <Image source={{ uri: product.image_url }} style={styles.image} />
                )}
                {product.category && (
                    <Chip style={styles.categoryChip}>
                        <Text style={styles.categoryText}>{product.category.name}</Text>
                    </Chip>
                )}
            </View>

            <View style={styles.content}>
                {/* ชื่อสินค้า */}
                <Text variant="headlineMedium" style={styles.title}>{product.name}</Text>

                {/* ราคา */}
                <Text variant="headlineLarge" style={styles.price}>{formatPrice(product.price)}</Text>

                {/* รายละเอียด */}
                {product.description && (
                    <Card style={styles.descriptionCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.sectionTitle}>
                                รายละเอียด
                            </Text>
                            <Text style={styles.description}>{product.description}</Text>
                        </Card.Content>
                    </Card>
                )}

                {/* ข้อมูลการติดต่อ - ที่อยู่ */}
                {/* {product.location_address && (
          <Card style={styles.locationCard}>
            <Card.Content>
              <View style={styles.locationContainer}>
                <IconButton icon="map-marker" size={30} iconColor="#666" />
                <View style={styles.locationTextContainer}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    สถานที่นัดรับสินค้า
                  </Text>
                  <Text style={styles.locationAddress}>{product.location_address}</Text>
                  {product.location_lat && product.location_lng && (
                    <Text style={styles.locationCoords}>
                      ละติจูด: {product.location_lat.toFixed(6)}, 
                      ลองจิจูด: {product.location_lng.toFixed(6)}
                    </Text>
                  )}
                </View>
              </View>
            </Card.Content>
          </Card>
        )} */}

                {/* ข้อมูลการลงขาย */}
                <Card style={styles.infoCard}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            ข้อมูลการลงขาย
                        </Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>ลงประกาศเมื่อ:</Text>
                            <Text style={styles.infoValue}>{formatDate(product.created_at)}</Text>
                        </View>
                        {product.updated_at !== product.created_at && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>แก้ไขล่าสุด:</Text>
                                <Text style={styles.infoValue}>{formatDate(product.updated_at)}</Text>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                {/* ปุ่มติดต่อผู้ขาย (แสดงเมื่อไม่ใช่เจ้าของ) */}
                {!isOwner && (
                    <View style={styles.contactButtons}>
                        <Button
                            mode="contained"
                            icon="phone"
                            onPress={handleCall}
                            style={styles.contactButton}
                        >
                            โทร
                        </Button>
                        <Button
                            mode="contained"
                            icon="chat-processing"
                            onPress={handleMessage}
                            style={styles.contactButton}
                        >
                            แชท
                        </Button>
                    </View>
                )}

                {/* ปุ่มสำหรับเจ้าของ (แสดงเมื่อเป็นเจ้าของ) */}
                {isOwner && (
                    <View style={styles.ownerButtons}>
                        <Button
                            mode="contained"
                            icon="pencil"
                            onPress={handleEdit}
                            style={styles.ownerButton}
                        >
                            แก้ไขประกาศ
                        </Button>
                        <Button
                            mode="contained"
                            icon="delete"
                            onPress={handleDelete}
                            buttonColor="red"
                            loading={loading}
                        >
                            {loading ? "กำลังลบ..." : "ลบประกาศ"}
                        </Button>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 16,
        color: "#666",
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        position: "relative",
    },
    image: {
        width: "100%",
        height: 300,
        resizeMode: "cover",
    },
    categoryChip: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "rgba(98, 0, 234, 0.9)",
    },
    categoryText: {
        color: "white",
        fontSize: 14,
    },
    content: {
        padding: 16,
    },
    title: {
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    price: {
        fontWeight: "bold",
        color: "#FF6B35",
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    descriptionCard: {
        marginBottom: 16,
    },
    description: {
        lineHeight: 24,
        color: "#555",
    },
    locationCard: {
        marginBottom: 16,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    locationTextContainer: {
        flex: 1,
        marginLeft: 8,
    },
    locationAddress: {
        color: "#333",
        marginBottom: 4,
    },
    locationCoords: {
        color: "#666",
        fontStyle: "italic",
    },
    infoCard: {
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    infoLabel: {
        color: "#666",
    },
    infoValue: {
        color: "#333",
        fontWeight: "500",
    },
    contactButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    contactButton: {
        flex: 1,
        marginHorizontal: 4,
    },
    ownerButtons: {
        marginTop: 16,
    },
    ownerButton: {
        marginBottom: 12,
    },
});

export default ProductDetailScreen;