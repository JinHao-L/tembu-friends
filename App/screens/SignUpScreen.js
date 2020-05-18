import React from "react";
import {View, Button, TextInput, SafeAreaView, TouchableOpacity, Text, StyleSheet} from "react-native";
import {Colors} from "../constants/index";

export default class SignUpScreen extends React.Component {
    state = {
        username: '',
        password: '',
    };

    handleUsername = (text) => {
        this.setState({username: text})
    }

    handlePassword = (text) => {
        this.setState({password: text})
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style = {styles.box}>
                    <TextInput
                        style = {styles.input}
                        placeholder = "Username"
                        placeholderTextColor = "#9a73ef"
                        underlineColorAndroid = "transparent"
                        autoCapitalize = "none"
                        onChangeText = {this.handleUsername}
                        value = {this.state.username}
                    />

                    <TextInput
                        style = {styles.input}
                        placeholder = "Password"
                        placeholderTextColor = "#9a73ef"
                        underlineColorAndroid = "transparent"
                        autoCapitalize = "none"
                        onChangeText = {this.handlePassword}
                        maxLength = {15}
                        secureTextEntry = {true}
                        value = {this.state.password}
                    />

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Home')}
                        style={styles.submitButton}>

                        <Text style = {styles.submitButtonText}> SignUp </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    box: {
        flex: 0.3,
        justifyContent: 'center',
        borderWidth: 5,
        backgroundColor: Colors.box,
        borderRadius: 20,
    },
    submitButton: {
        backgroundColor: Colors.button,
        padding: 10,
        margin: 15,
        height: 40,
    },
    submitButtonText: {
        color: Colors.text,
        textAlign: 'center'
    },
    input: {
        borderColor: Colors.border,
        borderWidth: 1,
        margin: 15,
        height: 40,
    }
})