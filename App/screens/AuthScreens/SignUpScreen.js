import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { withFirebase } from '../../config/Firebase';
import { Colors, NUSEmailSignature } from '../../constants';
import { AuthButton, FormInput, ErrorMessage, MainText } from '../../components';

const wordsOnly = /^[A-Za-z]+$/;
const passwordFormat = /^(?=.*\d)(?=.*[A-Za-z]).{8,}$/;

class SignUpScreen extends Component {
    state = {
        // Details
        firstName: '',
        lastName: '',
        nusEmail: '',
        password: '',
        confirmPassword: '',

        // Control - errors
        firstNameError: '',
        lastNameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
        generalError: '',

        // Control - others
        isLoading: false,
        passwordIcon: 'ios-eye',
        passwordVisibility: true,
        confirmPasswordIcon: 'ios-eye',
        confirmPasswordVisibility: true,
    };

    onSignUpSuccess = async (uid) => {
        const { nusEmail, firstName, lastName } = this.state;
        const userData = { email: nusEmail, firstName, lastName, displayName: firstName, uid };
        try {
            await this.props.firebase.createNewUser(userData);
        } catch (error) {
            console.log(error);
        } finally {
            this.setState({
                firstName: '',
                lastName: '',
                nusEmail: '',
                password: '',
                confirmPassword: '',
            });
        }
    };

    onSignUpFailure(error) {
        let errorCode = error.code;
        let errorMessage = error.message;

        if (errorCode === 'auth/email-already-in-use') {
            // Indicates the email used to attempt a sign up is already in use.
            this.setState({ emailError: 'Account already exists, try logging in instead' });
        } else if (errorCode === 'auth/invalid-email') {
            // Indicates the email is invalid.
            this.setState({ emailError: 'Invalid email address' });
        } else if (errorCode === 'auth/too-many-requests') {
            // Indicates that too many requests were made to a server method.
            this.setState({ generalError: 'Server overloaded. Please try again later' });
        } else if (errorCode === 'auth/network-request-failed') {
            // Indicates network error
            this.setState({ generalError: 'Network error' });
        } else {
            // Others
            this.setState({ generalError: 'Unknown error' });
            console.warn('Unknown error: ' + errorCode + ' ' + errorMessage);
        }
    }

    goToSignIn() {
        console.log('Go to sign in');
        this.props.navigation.navigate('SignIn');
    }

    handlePasswordVisibility() {
        this.setState((prevState) => ({
            passwordIcon: prevState.passwordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
            passwordVisibility: !prevState.passwordVisibility,
        }));
    }

    handleConfirmPasswordVisibility() {
        this.setState((prevState) => ({
            confirmPasswordIcon:
                prevState.confirmPasswordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
            confirmPasswordVisibility: !prevState.confirmPasswordVisibility,
        }));
    }

    handleFirstName(text) {
        this.setState({ firstName: text, firstNameError: '', generalError: '' });
    }
    handleLastName(text) {
        this.setState({ lastName: text, lastNameError: '', generalError: '' });
    }
    handleEmail(text) {
        this.setState({ nusEmail: text, emailError: '', generalError: '' });
    }
    handlePassword(text) {
        this.setState({
            password: text,
            passwordError: '',
            confirmPasswordError: '',
            generalError: '',
        });
    }
    handleConfirmPassword(text) {
        this.setState({ confirmPassword: text, confirmPasswordError: '', generalError: '' });
    }

    async signUp() {
        const { nusEmail, password } = this.state;
        this.setState({ isLoading: true });
        try {
            const response = await this.props.firebase.signUpWithEmail(nusEmail, password);
            if (response.user.uid) {
                await this.onSignUpSuccess.bind(this)(response.user.uid);
            }
        } catch (error) {
            this.onSignUpFailure.bind(this)(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    validateFirstName() {
        const { firstName } = this.state;
        if (!firstName || !firstName.match(wordsOnly)) {
            this.setState({ firstNameError: 'Invalid first name' });
        }
    }

    validateLastName() {
        const { lastName } = this.state;
        if (!lastName || !lastName.match(wordsOnly)) {
            this.setState({ lastNameError: 'Invalid first name' });
        }
    }

    validateEmail() {
        const { nusEmail } = this.state;
        if (!String(nusEmail).includes(NUSEmailSignature)) {
            // Potential update: check with tembu email database here?
            this.setState({ emailError: 'Please use your NUS email' });
        }
    }

    validatePassword() {
        const { password } = this.state;
        if (!password.match(passwordFormat)) {
            this.setState({
                passwordError:
                    'Invalid password: minimum eight characters, at least one letter and one number',
            });
        }
    }

    validInputAndSignUp() {
        const {
            password,
            confirmPassword,
            firstNameError,
            lastNameError,
            emailError,
            passwordError,
            confirmPasswordError,
            firstName,
            nusEmail,
            isLoading,
        } = this.state;

        if (isLoading) return null;
        if (!(password && confirmPassword && firstName && nusEmail)) {
            this.setState({
                generalError: 'Empty field detected',
            });
            return null;
        }
        if (password !== confirmPassword) {
            this.setState({
                password: '',
                confirmPassword: '',
                confirmPasswordError: 'Passwords do not match',
            });
            return null;
        }
        console.log('VALID');
        if (
            !(
                firstNameError ||
                lastNameError ||
                emailError ||
                passwordError ||
                confirmPasswordError
            )
        ) {
            return this.signUp.bind(this)();
        }
    }

    render() {
        const {
            firstName,
            lastName,
            nusEmail,
            password,
            confirmPassword,
            firstNameError,
            lastNameError,
            emailError,
            passwordError,
            confirmPasswordError,
            generalError,
            passwordVisibility,
            passwordIcon,
            confirmPasswordVisibility,
            confirmPasswordIcon,
            isLoading,
        } = this.state;

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : -150}
                contentContainerStyle={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        <View style={styles.titleContainer}>
                            <MainText style={styles.title}> TembuFriends </MainText>
                            <MainText style={styles.intro}> Sign Up</MainText>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.nameContainer}>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <FormInput
                                        style={[
                                            firstNameError ? styles.errorInput : styles.validInput,
                                            { marginRight: 5 },
                                        ]}
                                        leftIconName="md-person"
                                        placeholder="First Name"
                                        returnKeyType="next"
                                        textContentType="name"
                                        autoCapitalize="words"
                                        value={firstName}
                                        onChangeText={this.handleFirstName.bind(this)}
                                        onSubmitEditing={this.validateFirstName.bind(this)}
                                    />
                                    <ErrorMessage error={firstNameError ? firstNameError : ' '} />
                                </View>

                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <FormInput
                                        style={[
                                            lastNameError ? styles.errorInput : styles.validInput,
                                            { marginLeft: 5 },
                                        ]}
                                        leftIconName="md-person"
                                        placeholder="Last Name"
                                        returnKeyType="next"
                                        textContentType="name"
                                        autoCapitalize="words"
                                        value={lastName}
                                        onChangeText={this.handleLastName.bind(this)}
                                        onSubmitEditing={this.validateLastName.bind(this)}
                                    />
                                    <ErrorMessage error={lastNameError ? lastNameError : ' '} />
                                </View>
                            </View>

                            <View style={styles.box}>
                                <FormInput
                                    style={emailError ? styles.errorInput : styles.validInput}
                                    leftIconName="ios-mail"
                                    placeholder="NUS email address"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    textContentType="emailAddress"
                                    autoCapitalize="none"
                                    value={nusEmail}
                                    onChangeText={this.handleEmail.bind(this)}
                                    onSubmitEditing={this.validateEmail.bind(this)}
                                />
                                <ErrorMessage error={emailError ? emailError : ' '} />
                            </View>

                            <View style={styles.box}>
                                <FormInput
                                    style={
                                        passwordError || confirmPasswordError
                                            ? styles.errorInput
                                            : styles.validInput
                                    }
                                    leftIconName="ios-lock"
                                    placeholder="Password"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    textContentType="none"
                                    onChangeText={this.handlePassword.bind(this)}
                                    onSubmitEditing={this.validatePassword.bind(this)}
                                    secureTextEntry={passwordVisibility}
                                    value={password}
                                    rightIcon={
                                        <TouchableOpacity
                                            onPress={this.handlePasswordVisibility.bind(this)}
                                        >
                                            <Ionicons
                                                name={passwordIcon}
                                                size={28}
                                                color="grey"
                                                style={{ marginRight: 5 }}
                                            />
                                        </TouchableOpacity>
                                    }
                                />
                                <ErrorMessage error={passwordError ? passwordError : ' '} />
                            </View>
                            <View style={styles.box}>
                                <FormInput
                                    style={
                                        confirmPasswordError ? styles.errorInput : styles.validInput
                                    }
                                    leftIconName="ios-lock"
                                    placeholder="Confirm password"
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    textContentType="none"
                                    onChangeText={this.handleConfirmPassword.bind(this)}
                                    secureTextEntry={confirmPasswordVisibility}
                                    value={confirmPassword}
                                    rightIcon={
                                        <TouchableOpacity
                                            onPress={this.handleConfirmPasswordVisibility.bind(
                                                this
                                            )}
                                        >
                                            <Ionicons
                                                name={confirmPasswordIcon}
                                                size={28}
                                                color="grey"
                                                style={{ marginRight: '1%' }}
                                            />
                                        </TouchableOpacity>
                                    }
                                />
                                <ErrorMessage
                                    error={confirmPasswordError ? confirmPasswordError : ' '}
                                />
                            </View>
                            <View style={styles.box}>
                                <AuthButton
                                    onPress={this.validInputAndSignUp.bind(this)}
                                    style={styles.button}
                                    loading={isLoading}
                                >
                                    Sign Up
                                </AuthButton>
                                <ErrorMessage error={generalError ? generalError : ' '} />
                            </View>
                        </View>
                        <View style={styles.bottom}>
                            <MainText style={styles.haveAccountText}>
                                Already have an account?{' '}
                                <MainText
                                    style={styles.hyperlink}
                                    onPress={this.goToSignIn.bind(this)}
                                >
                                    Login here
                                </MainText>
                            </MainText>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: 40,
        // fontWeight: '700',
        color: 'green',
        marginBottom: 10,
        textAlign: 'left',
    },
    intro: {
        fontSize: 15,
        fontWeight: '200',
        flexWrap: 'wrap',
        textAlign: 'left',
        color: 'green',
        paddingLeft: 10,
    },
    titleContainer: {
        flex: 3.5,
        justifyContent: 'flex-end',
        // alignItems: 'flex-start',
    },
    form: {
        flex: 3.5,
        justifyContent: 'center',
        marginTop: 10,
    },
    bottom: {
        flex: 1.5,
        justifyContent: 'flex-end',
        marginBottom: 36,
        alignItems: 'center',
    },
    nameContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    validInput: {
        borderColor: 'gray',
    },
    errorInput: {
        borderColor: 'red',
    },
    box: {
        flex: 1,
        // marginTop: 5,
    },
    button: {
        marginTop: 10,
    },
    haveAccountText: {
        position: 'absolute',
        bottom: 0,
        fontWeight: '200',
        fontSize: 15,
        textAlign: 'center',
        color: 'black',
        marginBottom: 20,
    },
    hyperlink: {
        color: 'green',
    },
});

export default withFirebase(SignUpScreen);
