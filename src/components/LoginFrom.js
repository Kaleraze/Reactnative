import { TextInput, Button, Card, Text } from "react-native-paper";
import { View,StyleSheet } from "react-native";
import { useState } from "react";
import { useAuth } from "../AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const { login } = useAuth();




  const handleSubmit = () => {

    login(email, password);

  };

return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Login</Text>
          <TextInput
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ marginBottom: 16 }}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            style={{ marginBottom: 16 }}
            value={password}
            onChangeText={setpassword}
          />
          <Button mode="contained" onPress={handleSubmit}>
            Submit
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
  },
});
 
export default LoginForm;