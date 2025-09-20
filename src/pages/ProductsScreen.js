 import React, { useEffect } from "react";
 import { View, StyleSheet } from "react-native";
 import ProductList from "../components/ProductList";
 const ProductsScreen = ({ navigation, route }) => {
  // /? refresh parameter > ProductFormScreen
  useEffect(() => {
    if (route.params?.refresh) {
      console.log("ProductsScreen received refresh signal");
      // .N refresh signal N .? ProductList
      // ProductList > refresh O//?//? N /? >N/?/ mount O//N
    }
  }, [route.params?.refresh]);
  const handleProductPress = (product) => {
    navigation.navigate("ProductDetail", { product });
  };
  const handleProductEdit = (product) => {
    navigation.navigate("ProductForm", { product });
  };
  const handleAddProduct = () => {
    navigation.navigate("ProductForm");
  };
  const handleProductDelete = (product) => {
    // ProductList > ? >/ >// N/
    console.log("Product deleted:", product.name);
  };
  return (
    <View style={styles.container}>
      <ProductList
        key={route.params?.refresh ? Date.now() : 'default'}
        onProductPress={handleProductPress}
        onProductEdit={handleProductEdit}
        onProductDelete={handleProductDelete}
        onAddProduct={handleAddProduct}
        showAddButton={true}
      />
    </View>
  );
 };
 const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 });
 export default ProductsScreen;