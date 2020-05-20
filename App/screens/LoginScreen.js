import React, { Component } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { onSignIn } from "../auth";
import { Colors } from "../constants";
import { AuthButton } from "../components";

class LoginScreen extends Component {
  state = {
    username: "",
    password: "",
  };

  handleUsername = (text) => {
    this.setState({ username: text });
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  login = (user, pass) => {
    if (this.state.username.length && this.state.password.length) {
      alert(
        "Under Development: \nusername entered: " +
          user +
          "\npassword entered: " +
          pass
      );
      this.props.navigation.navigate("Root", { username: user });
    } else {
      alert("Please enter valid username and password");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/robot-prod.png")}
          style={styles.logo}
        />
        <TextInput
          style={styles.input}
          placeholder=" Username"
          placeholderStyle={styles.inputDefault}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={this.handleUsername}
          value={this.state.username}
        />

        <TextInput
          style={styles.input}
          placeholder=" Password"
          placeholderStyle={styles.inputDefault}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={this.handlePassword}
          maxLength={15}
          secureTextEntry={true}
          value={this.state.password}
        />

        <View style={styles.buttonContainer}>
          <AuthButton
            onPress={() => this.login(this.state.username, this.state.password)}
            style={styles.button}
          >
            Login
          </AuthButton>

          <AuthButton
            onPress={() => this.props.navigation.navigate("SignUp")}
            style={styles.button}
          >
            Register
          </AuthButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  logo: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  input: {
    borderColor: Colors.border,
    borderWidth: 1,
    backgroundColor: "#fff",
    margin: 10,
    height: 30,
    width: 200,
  },
  inputDefault: {
    color: "#565756",
  },
  buttonContainer: {
    position: "relative",
    top: 10,
  },
  button: {
    margin: 5,
    width: 67,
  },
});

export default LoginScreen;
