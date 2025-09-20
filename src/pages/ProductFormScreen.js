 import React from "react";
 import { View, StyleSheet } from "react-native";
 import ProductForm from "../components/ProductForm";
 const ProductFormScreen = ({ navigation, route }) => {
 const { product } = route.params || {};
 // const { selectedLocation, fromMapPicker } = route.params || {}; // N/>N/O.O>//? />// O>
 const handleSave = (savedProduct) => {
    console.log("ProductFormScreen handleSave:", savedProduct);
 if (savedProduct) {
 // O>./O> O//N//?/O ON .O>N/O - .N O//?/ /? N .? ProductsScreen
      navigation.navigate("Products", { 
        refresh: true,
        newProduct: savedProduct 
      });
    } else {
 // O>/ .> O>
      navigation.navigate("Products", { 
        refresh: true 
      });
    }
  };
 const handleCancel = () => {
    navigation.goBack();
  };
 return (
 <View style={styles.container}>
 <ProductForm
 product={product}
 onSave={handleSave}
 onCancel={handleCancel}
 navigation={navigation}
 // selectedLocation={selectedLocation} // N/>N/O.O>//? />// O>
 // fromMapPicker={fromMapPicker} // N/>N/O.O>//? />// O>
 />
 </View>
  );
 };
 const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 });
 export default ProductFormScreen;