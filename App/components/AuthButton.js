import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../constants";

const AuthButton = (props) => (
  <TouchableOpacity
    style={[styles.container, props.style]}
    onPress={props.onPress}
  >
    <Text style={styles.text}> {props.children} </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.button,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 7,
  },
  text: {
    fontSize: 14,
    color: Colors.buttonText,
    textAlign: "center",
  },
});

export default AuthButton;
