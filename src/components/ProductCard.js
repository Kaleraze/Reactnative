import React from "react";
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import {
    Card,
    Text,
    Button,
    Chip,
    IconButton,
} from "react-native-paper";
import { useAuth } from "../AuthContext";

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

const ProductCard = ({
    product,
    onPress,
    onEdit,
    onDelete,
    showActions = true
}) => {
    const { user } = useAuth();
    const isOwner = user?.id === product.created_by;

    // Debug: ตรวจสอบ user และ product ownership
    console.log("✅ ProductCard Debug:", {
        userId: user?.id,
        productCreatedBy: product.created_by,
        isOwner: isOwner,
        productName: product.name,
        imageUrl: product.image_url
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat("th-TH", {
            style: "currency",
            currency: "THB",
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handlePress = () => {
        if (onPress) {
            onPress(product);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(product);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(product);
        }
    };

    return (
        <Card style={styles.card} onPress={handlePress}>
            <TouchableOpacity onPress={handlePress}>
                {/* รูปภาพสินค้า */}
                {product.image_url ? (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: product.image_url }}
                            style={styles.image}
                            onError={(error) => {
                                console.error("❌ Image Load Error:", error.nativeEvent.error);
                                console.log("ℹ️ Image URL:", product.image_url);
                                console.log("✅ Error details:", error.nativeEvent);
                            }}
                            onLoad={() => {
                                console.log("✔️ Image Loaded Successfully:", product.image_url);
                            }}
                            onLoadStart={() => {
                                console.log("✍️ Image loading started:", product.image_url);
                            }}
                            onLoadEnd={() => {
                                console.log("👍 Image loading ended:", product.image_url);
                            }}
                        />
                        {/* Category Badge */}
                        {product.category && (
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{product.category.name}</Text>
                            </View>
                        )}
                        {/* Price Badge */}
                        <View style={styles.priceBadge}>
                            <Text style={styles.priceBadgeText}>{formatPrice(product.price)}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.noImageContainer}>
                        <Text style={styles.noImageText}>ไม่มีรูปภาพ</Text>
                        <Text style={styles.noImageSubText}>
                            image_url: {product.image_url || 'null'}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            <Card.Content style={styles.content}>
                {/* ชื่อสินค้า */}
                <Text variant="titleSmall" style={styles.title} numberOfLines={2}>
                    {product.name}
                </Text>

                {/* รายละเอียด */}
                {product.description && (
                    <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
                        {product.description}
                    </Text>
                )}

                {/* วันที่ลงประกาศ */}
                <Text variant="bodySmall" style={styles.dateText}>
                    {formatDate(product.created_at)}
                </Text>

                {/* ปุ่มสำหรับเจ้าของ - แสดงเมื่อเป็นเจ้าของ */}
                {showActions && isOwner && (
                    <View style={styles.actionsContainer}>
                        <IconButton
                            icon="pencil"
                            size={20}
                            onPress={handleEdit}
                            style={styles.actionButton}
                        />
                        <IconButton
                            icon="delete"
                            size={20}
                            onPress={handleDelete}
                            style={styles.actionButton}
                        />
                    </View>
                )}
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        marginBottom: 16,
        marginHorizontal: 4,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        position: "relative",
        height: 140,
    },
    image: {
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        resizeMode: "cover",
    },
    categoryBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "rgba(255, 107, 53, 0.9)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: "white",
        fontSize: 10,
        fontWeight: "600",
    },
    priceBadge: {
        position: "absolute",
        bottom: 8,
        right: 8,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priceBadgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    content: {
        padding: 12,
    },
    title: {
        fontWeight: "600",
        marginBottom: 6,
        color: "#212529",
        fontSize: 14,
        lineHeight: 18,
    },
    description: {
        color: "#6C757D",
        marginBottom: 8,
        lineHeight: 16,
        fontSize: 12,
    },
    dateText: {
        color: "#ADB5BD",
        fontSize: 10,
        marginBottom: 8,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    actionButton: {
        margin: 0,
        marginLeft: 4,
    },
    noImageContainer: {
        height: 140,
        backgroundColor: "#F8F9FA",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    noImageText: {
        color: "#6C757D",
        fontSize: 14,
        marginBottom: 4,
    },
    noImageSubText: {
        color: "#ADB5BD",
        fontSize: 10,
    },
});

export default ProductCard;