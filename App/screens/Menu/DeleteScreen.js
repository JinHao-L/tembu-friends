import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { withFirebase } from '../../config/Firebase';
import { Colors, Layout } from '../../constants';
import { AuthButton, FormInput, ErrorMessage, MainText } from '../../components';

class SignUpScreen extends Component {
    state = {
        // Details
        nusEmail: '',
        password: '',
        confirmation: '',

        // Control - errors
        emailError: '',
        passwordError: '',
        confirmationError: '',
        generalError: '',

        // Control - others
        isLoading: false,
        passwordIcon: 'ios-eye',
        passwordHidden: true,
        keyboardShown: false,
    };

    clearInputs() {
        this.setState({
            nusEmail: '',
            password: '',
            confirmation: '',
            emailError: '',
            passwordError: '',
            confirmationError: '',
        });
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow.bind(this)
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide.bind(this)
        );
        this.props.navigation.setOptions({
            headerStyle: {
                backgroundColor: Colors.appGreen,
            },
            headerTintColor: Colors.appWhite,
            headerTitleAlign: 'center',
        });
    }

    _keyboardDidShow(event) {
        console.log('Keyboard Shown');
        this.setState({
            keyboardShown: true,
            keyboardHeight: event.endCoordinates.height,
        });
    }

    _keyboardDidHide() {
        console.log('Keyboard Hidden');
        this.setState({
            keyboardShown: false,
        });
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
    }

    onDeleteSuccess() {
        this.clearInputs.bind(this)();
    }

    onDeleteFailure(error) {
        let errorCode = error.code;
        let errorMessage = error.message;

        switch (errorCode) {
            case 'auth/invalid-email': // Indicates the email is invalid.
                this.setState({ emailError: 'Invalid email address' });
                break;
            case 'auth/too-many-requests': // Indicates that too many requests were made to a server method.
                this.setState({ generalError: 'Server overloaded. Please try again later' });
                break;
            case 'auth/network-request-failed': // Indicates network error
                this.setState({ generalError: 'Network error' });
                break;
            default:
                // Others
                this.setState({ generalError: 'Unknown error' });
                console.warn('Unknown error: ' + errorCode + ' ' + errorMessage);
                break;
        }
    }

    handlePasswordVisibility() {
        this.setState((prevState) => ({
            passwordIcon: prevState.passwordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
            passwordHidden: !prevState.passwordHidden,
        }));
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
    handleConfirmation(text) {
        this.setState({
            confirmation: text,
        });
    }

    async delete() {
        const { nusEmail, password } = this.state;
        this.setState({ isLoading: true });

        try {
            const user = await this.props.firebase.getCurrentUser();

            console.log('Get credential');
            const credential = await this.props.firebase.createCredential(nusEmail, password);

            console.log('Re-authenticating');
            await user.reauthenticateWithCredential(credential);

            console.log('Deleting');
            await this.props.firebase.deleteUser(user.uid);
            await user.delete();

            console.log('Cleaning Up');
            this.onDeleteSuccess.bind(this)();

            console.log('Signing out');
            await this.props.firebase.signOut;
        } catch (error) {
            this.onDeleteFailure.bind(this)(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    validateInputAndDelete() {
        Keyboard.dismiss();
        const {
            password,
            nusEmail,
            confirmation,
            emailError,
            passwordError,
            confirmationError,
            isLoading,
        } = this.state;

        if (isLoading) return null;
        if (!(password && nusEmail && confirmation)) {
            this.setState({
                generalError: 'Empty field detected',
            });
            return null;
        }
        if (confirmation !== 'DELETE') {
            this.setState({
                confirmation: '',
                confirmationError: "Please write 'DELETE' to confirm deletion",
            });
        }
        console.log('VALID');
        if (!(emailError || passwordError || confirmationError)) {
            return this.delete.bind(this)();
        }
    }

    render() {
        const {
            nusEmail,
            password,
            confirmation,
            emailError,
            passwordError,
            confirmationError,
            generalError,
            passwordHidden,
            passwordIcon,
            isLoading,
            keyboardShown,
        } = this.state;

        return (
            <View
                style={[
                    styles.container,
                    {
                        paddingBottom:
                            Platform.OS === 'ios' && keyboardShown
                                ? this.state.keyboardHeight
                                : null,
                    },
                ]}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        {keyboardShown ? null : <View style={styles.header} />}
                        <View style={styles.titleContainer}>
                            <MainText style={styles.title}> Deleting...</MainText>
                            <MainText style={{ left: 40 }}>
                                This is a feature for testing purposes
                            </MainText>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.box}>
                                <FormInput
                                    style={emailError ? styles.errorInput : styles.validInput}
                                    placeholder="NUS email address"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    textContentType="emailAddress"
                                    autoCapitalize="none"
                                    value={nusEmail}
                                    onChangeText={this.handleEmail.bind(this)}
                                />
                                <ErrorMessage error={emailError ? emailError : ' '} />
                            </View>

                            <View style={styles.box}>
                                <FormInput
                                    style={passwordError ? styles.errorInput : styles.validInput}
                                    placeholder="Password"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    textContentType="none"
                                    onChangeText={this.handlePassword.bind(this)}
                                    secureTextEntry={passwordHidden}
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
                                        confirmationError ? styles.errorInput : styles.validInput
                                    }
                                    placeholder="To confirm type 'DELETE'"
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    textContentType="none"
                                    onChangeText={this.handleConfirmation.bind(this)}
                                    value={confirmation}
                                />
                                <ErrorMessage error={confirmationError ? confirmationError : ' '} />
                            </View>
                            <View style={styles.box}>
                                <AuthButton
                                    onPress={this.validateInputAndDelete.bind(this)}
                                    style={styles.button}
                                    loading={isLoading}
                                >
                                    DELETE
                                </AuthButton>
                                <ErrorMessage error={generalError ? generalError : ' '} />
                            </View>
                        </View>

                        {keyboardShown ? (
                            <View style={{ flex: 0.5 }} />
                        ) : (
                            <View style={{ flex: 1.5 }} />
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: Colors.appWhite,
    },
    title: {
        fontSize: 40,
        color: Colors.appGreen,
        marginBottom: 10,
        textAlign: 'left',
        width: Layout.window.width,
        left: 35,
    },
    header: {
        flex: 0.5,
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 10,
        marginHorizontal: 40,
    },
    nameContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    validInput: {
        borderColor: Colors.appGray,
    },
    errorInput: {
        borderColor: Colors.appRed,
    },
    box: {
        marginTop: 5,
    },
    button: {
        color: 'red',
        marginTop: 10,
    },
    haveAccountText: {
        position: 'absolute',
        bottom: 0,
        fontWeight: '200',
        fontSize: 15,
        textAlign: 'center',
        color: Colors.appBlack,
        marginBottom: 20,
    },
    hyperlink: {
        color: Colors.appGreen,
    },
});

export default withFirebase(SignUpScreen);
