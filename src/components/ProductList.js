import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    Alert,
    Dimensions,
} from "react-native";
import {
    Text,
    ActivityIndicator,
    Searchbar,
    Chip,
    Button,
    FAB,
    IconButton,
} from "react-native-paper";
import { supabase } from "../config/supabase";
import ProductCard from "./ProductCard";

const { width } = Dimensions.get('window');

const ProductList = ({
    onProductPress,
    onProductEdit,
    onProductDelete,
    onAddProduct,
    showAddButton = true
}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        console.log("✍️ ProductList mounted - loading data");
        loadCategories();
        loadProducts();
    }, []);

    useEffect(() => {
        // รีเซ็ตการแสดงผลเมื่อมีการค้นหาหรือเปลี่ยนหมวดหมู่
        setPage(0);
        setProducts([]);
        setHasMore(true);
        loadProducts(true);
    }, [searchQuery, selectedCategory]);

    const loadCategories = async () => {
        try {
            console.log("✍️ กำลังโหลด categories...");
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("name");
            if (error) {
                console.error("❌ Categories Error:", error);
                throw error;
            }
            console.log("✔️ Categories loaded:", data);
            setCategories(data || []);
        } catch (error) {
            console.error("❌ Error loading categories:", error);
            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลหมวดหมู่ได้: " + error.message);
        }
    };

    const loadProducts = async (reset = false) => {
        try {
            console.log("✍️ กำลังโหลด products...", { reset, page, searchQuery, selectedCategory });
            if (reset) {
                setLoading(true);
            }
            let query = supabase
                .from("products")
                .select(`
          *,
          category:categories(*)
        `)
                .order("created_at", { ascending: false })
                .range(
                    reset ? 0 : page * ITEMS_PER_PAGE,
                    reset ? ITEMS_PER_PAGE - 1 : (page + 1) * ITEMS_PER_PAGE - 1
                );

            // Filter by search query
            if (searchQuery.trim()) {
                query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
            }

            // Filter by category
            if (selectedCategory) {
                query = query.eq("category_id", selectedCategory);
            }

            const { data, error } = await query;
            if (error) {
                console.error("❌ Products Error:", error);
                throw error;
            }
            console.log("✔️ Products loaded:", data);

            if (reset) {
                setProducts(data || []);
            } else {
                setProducts(prev => {
                    const existingIds = new Set(prev.map(item => item.id));
                    const newItems = (data || []).filter(item => !existingIds.has(item.id));
                    return [...prev, ...newItems];
                });
            }
            setHasMore((data || []).length === ITEMS_PER_PAGE);
        } catch (error) {
            console.error("❌ Error loading products:", error);
            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลประกาศได้: " + error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(0);
        setProducts([]);
        setHasMore(true);
        loadProducts(true);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
            loadProducts();
        }
    };

    const handleProductDelete = async (product) => {
        Alert.alert(
            "ยืนยันการลบ",
            `คุณแน่ใจหรือไม่ว่าต้องการลบประกาศ "${product.name}" นี้?`,
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ลบ",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from("products")
                                .delete()
                                .eq("id", product.id);
                            if (error) throw error;
                            // ลบสินค้าออกจาก list
                            setProducts(prev => prev.filter(p => p.id !== product.id));
                            if (onProductDelete) {
                                onProductDelete(product);
                            }
                        } catch (error) {
                            console.error("Error deleting product:", error);
                            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถลบประกาศได้");
                        }
                    }
                }
            ]
        );
    };

    const renderProduct = ({ item }) => (
        <ProductCard
            product={item}
            onPress={() => onProductPress(item)}
            onEdit={() => onProductEdit(item)}
            onDelete={() => handleProductDelete(item)}
        />
    );

    const renderGridItem = ({ item, index }) => (
        <View style={styles.gridItem}>
            <ProductCard
                product={item}
                onPress={() => onProductPress(item)}
                onEdit={() => onProductEdit(item)}
                onDelete={() => handleProductDelete(item)}
            />
        </View>
    );

    const renderCategoryChip = (category) => (
        <Chip
            key={category.id}
            selected={selectedCategory === category.id}
            onPress={() =>
                setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                )
            }
            style={styles.categoryChip}
        >
            <Text style={selectedCategory === category.id ? styles.selectedChipText : styles.chipText}>
                {category.name}
            </Text>
        </Chip>
    );

    const renderFooter = () => {
        if (!loading || page === 0) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" />
                <Text style={styles.footerText}>กำลังโหลด...</Text>
            </View>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {searchQuery || selectedCategory
                    ? "ไม่พบประกาศที่ตรงกับการค้นหา"
                    : "ยังไม่มีประกาศในขณะนี้"
                }
            </Text>
            {!searchQuery && !selectedCategory && showAddButton && (
                <Button
                    mode="contained"
                    onPress={onAddProduct}
                    style={styles.addButton}
                >
                    สร้างประกาศ
                </Button>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header with Search */}
            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                    <Searchbar
                        placeholder="ค้นหาสินค้า"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        inputStyle={styles.searchInput}
                        icon="magnify"
                        elevation={0}
                    />
                    <IconButton
                        icon="filter-variant"
                        size={24}
                        onPress={() => {
                            // TODO: Implement filter modal
                            Alert.alert("ยังไม่พร้อมใช้งาน", "ฟังก์ชันการกรองกำลังอยู่ระหว่างการพัฒนา");
                        }}
                        style={styles.filterButton}
                    />
                </View>

                {/* Category Filter */}
                {categories.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryContainer}
                    >
                        <Chip
                            selected={selectedCategory === null}
                            onPress={() => setSelectedCategory(null)}
                            style={[styles.categoryChip, selectedCategory === null && styles.selectedChip]}
                        >
                            <Text style={selectedCategory === null ? styles.selectedChipText : styles.chipText}>
                                ทั้งหมด
                            </Text>
                        </Chip>
                        {categories.map(renderCategoryChip)}
                    </ScrollView>
                )}
            </View>

            {/* Product Grid */}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderGridItem}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
                columnWrapperStyle={styles.row}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={!loading ? renderEmpty : null}
                showsVerticalScrollIndicator={false}
            />

            {/* Add Product FAB - ย้ายไปอยู่ใน Navigation Header แล้ว */}
            {/* {showAddButton && (
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={onAddProduct}
        />
      )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    headerContainer: {
        backgroundColor: "#FFFFFF",
        paddingBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    searchBar: {
        flex: 1,
        marginRight: 8,
        elevation: 0,
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
    },
    searchInput: {
        fontSize: 14,
    },
    filterButton: {
        margin: 0,
    },
    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    categoryChip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: "#F8F9FA",
        borderWidth: 1,
        borderColor: "#E9ECEF",
    },
    selectedChip: {
        backgroundColor: "#FF6B35",
        borderColor: "#FF6B35",
    },
    chipText: {
        color: "#6C757D",
        fontSize: 12,
    },
    selectedChipText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
    },
    gridContainer: {
        padding: 16,
    },
    row: {
        justifyContent: "space-between",
    },
    gridItem: {
        flex: 1,
        maxWidth: "48%",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
    },
    footerText: {
        marginLeft: 8,
        color: "#6C757D",
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: "#6C757D",
        textAlign: "center",
        marginBottom: 16,
    },
    addButton: {
        marginTop: 8,
        backgroundColor: "#FF6B35",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#FF6B35",
        borderRadius: 16,
    },
});

export default ProductList;