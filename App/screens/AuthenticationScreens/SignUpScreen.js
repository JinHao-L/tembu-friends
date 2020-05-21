import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import 'firebase/firestore';
import firebase from 'firebase';

import { Colors } from '../../constants';
import { AuthButton } from '../../components';

const emailSignature = '@u.nus.edu';

class SignUpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            nusEmail: '',
            password: '',
            errorMessage: '',
            loading: false,
        };
    }

    onLoginSuccess = () => {
        this.setState({
            displayName: '',
            nusEmail: '',
            password: '',
        });
        this.props.navigation.navigate('Root');
    };

    onLoginFailure(errorMessage) {
        this.setState({ error: errorMessage, loading: false });
    }

    renderLoading() {
        if (this.state.loading) {
            return (
                <View>
                    <ActivityIndicator size={'large'} />
                </View>
            );
        }
    }

    async signUp() {
        this.setState({ loading: true });
        const { nusEmail, password } = this.state;
        if (!(password.length && nusEmail.length)) {
            this.onLoginFailure.bind(this)('Please fill up all fields');
        } else if (!nusEmail.includes(emailSignature)) {
            this.onLoginFailure.bind(this)('Please enter valid NUS email');
        } else {
            await firebase
                .auth()
                .createUserWithEmailAndPassword(nusEmail, password)
                .then(this.onLoginSuccess.bind(this))
                .catch((err) => {
                    let errCode = err.code;
                    let errMessage = err.message;
                    if (errCode === 'auth/weak-password') {
                        this.onLoginFailure.bind(this)('Weak Password!');
                    } else {
                        this.onLoginFailure.bind(this)(errMessage);
                    }
                });
        }
    }

    handleName(text) {
        this.setState({ displayName: text });
    }

    handleEmail(text) {
        this.setState({ nusEmail: text });
    }

    handlePassword(text) {
        this.setState({ password: text });
    }

    render() {
        const { displayName, nusEmail, password } = this.state;

        return (
            <View style={styles.container}>
                <Image source={require('../../assets/images/robot-dev.png')} style={styles.logo} />
                <Text style={styles.title}>Tembu Friends</Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderStyle="#b1b1b1"
                        underlineColorAndroid="transparent"
                        returnKeyType="next"
                        textContentType="name"
                        value={displayName}
                        onChangeText={this.handleName.bind(this)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="NUS Email"
                        placeholderTextColor="#b1b1b1"
                        underlineColorAndroid="transparent"
                        returnKeyType="next"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        value={nusEmail}
                        onChangeText={this.handleEmail.bind(this)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#b1b1b1"
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        returnKeyType="done"
                        textContentType="newPassword"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={this.handlePassword.bind(this)}
                    />
                </View>
                {this.renderLoading()}
                <Text style={styles.error}>{this.state.error}</Text>
                <AuthButton
                    onPress={() => this.signUp()}
                    style={[styles.button, { position: 'relative', top: 10 }]}
                >
                    Sign Up
                </AuthButton>
                <View style={{ marginTop: 10 }}>
                    <Text
                        style={{ fontWeight: '200', fontSize: 17, textAlign: 'center' }}
                        onPress={() => this.props.navigation.navigate('SignIn')}
                    >
                        Already have an Account?
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    logo: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 20,
        marginLeft: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: 'green',
    },
    form: {
        width: '86%',
        marginTop: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        borderColor: Colors.border,
        borderWidth: 1,
        backgroundColor: '#fff',
        marginTop: 10,
        height: 30,
        width: 200,
    },
    button: {
        margin: 5,
        width: 67,
    },
    error: {
        fontSize: 18,
        textAlign: 'center',
        color: 'red',
        width: '80%',
    },
});

export default SignUpScreen;
