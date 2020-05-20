import React, { Component } from "react";
import {
  View,
  Button,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { Colors } from "../constants/index";
import { AuthButton } from "../components/index";

class SignUpScreen extends Component {
  state = {
    nusNet: "",
    username: "",
    password: "",
    isSignUpSuccess: false,
  };

  handleUsername = (text) => {
    this.setState({ username: text });
  };

  handleId = (text) => {
    this.setState({ nusNet: text });
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  validateEntry = (user, netid, password) => {
    if (user.length && password.length) {
      if (netid.length !== 8 || netid.charAt(0) !== "e") {
        alert("Please enter valid nusNet id");
      } else {
        alert(
          "Under Development: \nusername entered: " +
            user +
            "\nnusnet entered: " +
            netid +
            "\npassword entered: " +
            password
        );
        this.setState({ isSignUpSuccess: true });
        // this.props.navigation.navigate('Login');
      }
    } else {
      alert("Please fill up all fields");
    }
  };

  render() {
    const { username, nusNet, password, isSignUpSuccess } = this.state;

    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/robot-dev.png")}
          style={styles.logo}
        />
        <TextInput
          style={styles.input}
          placeholder=" Username"
          // placeholderStyle = {styles.inputDefault}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={this.handleUsername}
          value={username}
        />

        <TextInput
          style={styles.input}
          placeholder=" NUSNET"
          // placeholderStyle = {styles.inputDefault}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          maxLength={8}
          onChangeText={this.handleId}
          value={nusNet}
        />

        <TextInput
          style={styles.input}
          placeholder=" Password"
          // placeholderStyle = {styles.inputDefault}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={this.handlePassword}
          maxLength={15}
          secureTextEntry={true}
          value={password}
        />

        <AuthButton
          onPress={() => this.validateEntry(username, nusNet, password)}
          style={styles.button}
        >
          Sign Up
        </AuthButton>
        {isSignUpSuccess ? (
          <Text
            style={styles.text}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            Sign Up Successful{" "}
          </Text>
        ) : null}
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
    marginLeft: 10,
  },
  input: {
    borderColor: Colors.border,
    borderWidth: 1,
    backgroundColor: "#fff",
    fontSize: 20,
    margin: 10,
    height: 30,
    width: 200,
  },
  // inputDefault: {
  //     color: "#565756",
  // },
  button: {
    // position: 'relative',
    marginTop: 10,
  },
  text: {
    fontSize: 20,
    color: "green",
  },
});

export default SignUpScreen;
