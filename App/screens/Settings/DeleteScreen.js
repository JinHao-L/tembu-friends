import React, { Component } from 'react';
import { View, StyleSheet, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { withFirebase } from '../../helper/Firebase';
import { Colors, Layout } from '../../constants';
import { AuthButton, FormInput, MainText, ErrorMessage } from '../../components';

const mapStateToProps = (state) => {
    return { userData: state.userData, friendSubscriber: state.friendSubscriber };
};

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
        keyboardHeight: 0,
        keyboardShown: false,
    };
    passwordRef = React.createRef();
    confirmationRef = React.createRef();

    clearError = () => {
        this.setState({
            emailError: '',
            passwordError: '',
            confirmationError: '',
            generalError: '',
        });
    };

    clearInputs = () => {
        this.setState({
            nusEmail: '',
            password: '',
            confirmation: '',
        });
    };

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide
        );
    }

    _keyboardDidShow = (event) => {
        this.setState({
            keyboardShown: true,
            keyboardHeight: event.endCoordinates.height,
        });
    };

    _keyboardDidHide = () => {
        this.setState({
            keyboardShown: false,
            keyboardHeight: 0,
        });
    };

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
    }

    onDeleteSuccess = () => {
        this.clearInputs();
    };

    onDeleteFailure = (error) => {
        let errorCode = error.code;
        let errorMessage = error.message;

        switch (errorCode) {
            case 'auth/user-mismatch': // Indicates the email is invalid.
                this.setState({ generalError: 'Wrong User' });
                break;
            case 'auth/invalid-email': // Indicates the email is invalid.
                this.setState({ emailError: 'Invalid email address' });
                break;
            case 'auth/user-not-found': // Indicates the email is invalid.
                this.setState({ emailError: 'Invalid email address' });
                break;
            case 'auth/wrong-password': // Indicates the email is invalid.
                this.setState({ passwordError: 'Invalid password' });
                break;
            default:
                // Others
                this.setState({ generalError: 'Unknown error' });
                console.warn('Unknown error: ' + errorCode + ' ' + errorMessage);
                break;
        }
    };

    handlePasswordVisibility = () => {
        this.setState((prevState) => ({
            passwordIcon: prevState.passwordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
            passwordHidden: !prevState.passwordHidden,
        }));
    };
    handleEmail = (text) => {
        this.setState({ nusEmail: text });
    };
    handlePassword = (text) => {
        this.setState({
            password: text,
        });
    };
    handleConfirmation = (text) => {
        this.setState({
            confirmation: text,
        });
    };

    delete = async () => {
        const { nusEmail, password } = this.state;
        this.setState({ isLoading: true });

        const user = this.props.firebase.getCurrentUser();

        console.log('Get credential');
        const credential = this.props.firebase.createCredential(nusEmail, password);

        console.log('Re-authenticating');
        return user
            .reauthenticateWithCredential(credential)
            .then((result) => {
                if (result) {
                    this.props.friendSubscriber();
                    console.log('Deleting');
                    return user.delete();
                }
            })
            .then(() => {
                console.log('Cleaning Up');
                this.onDeleteSuccess();
                console.log('Signing out');
                return this.props.firebase.signOut();
            })
            .catch(this.onDeleteFailure)
            .finally(() => this.setState({ isLoading: false }));
    };

    validateInputAndDelete = () => {
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
                confirmationError: "Type 'DELETE' to confirm deletion",
            });
            return null;
        }
        console.log('Valid Input');
        if (!emailError && !passwordError && !confirmationError) {
            // console.log('delete');
            return this.delete();
        }
    };

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
            <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View
                        style={[
                            styles.container,
                            {
                                paddingBottom:
                                    Platform.OS === 'ios' ? this.state.keyboardHeight : undefined,
                                justifyContent: keyboardShown ? 'flex-end' : 'center',
                            },
                        ]}
                    >
                        <View style={{ marginBottom: 5 }}>
                            <View style={styles.titleContainer}>
                                <MainText style={styles.title}>Delete Account</MainText>
                                <MainText style={styles.subtitle}>
                                    We are sorry to see you go...
                                </MainText>
                            </View>
                            <View style={styles.form}>
                                <FormInput
                                    containerStyle={styles.box}
                                    isError={emailError}
                                    errorMessage={emailError}
                                    placeholder="NUS email address"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    textContentType="emailAddress"
                                    autoCapitalize="none"
                                    value={nusEmail}
                                    onChangeText={this.handleEmail}
                                    onFocus={this.clearError}
                                    onSubmitEditing={() => this.passwordRef.focus()}
                                />

                                <FormInput
                                    inputRef={(input) => (this.passwordRef = input)}
                                    containerStyle={styles.box}
                                    isError={passwordError}
                                    errorMessage={passwordError}
                                    placeholder="Password"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    textContentType="password"
                                    onChangeText={this.handlePassword}
                                    onFocus={this.clearError}
                                    secureTextEntry={passwordHidden}
                                    value={password}
                                    rightIcon={
                                        <Icon
                                            type={'ionicon'}
                                            name={passwordIcon}
                                            size={28}
                                            color={Colors.appGray2}
                                            containerStyle={{ marginRight: 5 }}
                                            onPress={this.handlePasswordVisibility}
                                        />
                                    }
                                    onSubmitEditing={() => this.confirmationRef.focus()}
                                />
                                <FormInput
                                    inputRef={(input) => (this.confirmationRef = input)}
                                    containerStyle={styles.box}
                                    isError={confirmationError}
                                    errorMessage={confirmationError}
                                    placeholder="To confirm type 'DELETE'"
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    textContentType="none"
                                    onChangeText={this.handleConfirmation}
                                    onFocus={this.clearError}
                                    value={confirmation}
                                    onSubmitEditing={this.validateInputAndDelete}
                                />
                                <AuthButton
                                    onPress={this.validateInputAndDelete}
                                    style={styles.button}
                                    loading={isLoading}
                                >
                                    Delete My Account
                                </AuthButton>
                                <ErrorMessage
                                    style={{ textAlign: 'center' }}
                                    error={generalError ? generalError : ' '}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
        alignItems: 'center',
    },
    title: {
        paddingLeft: 40,
        fontSize: 35,
        color: Colors.appGreen,
        marginBottom: 10,
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 15,
        paddingLeft: 40,
        color: Colors.appBlack,
        marginBottom: 10,
        textAlign: 'left',
    },
    titleContainer: {
        justifyContent: 'flex-end',
        width: Layout.window.width,
    },
    form: {
        justifyContent: 'center',
        marginHorizontal: 40,
    },
    box: {
        marginTop: 5,
    },
    button: {
        color: Colors.appRed,
        marginTop: 10,
    },
});

export default connect(mapStateToProps)(withFirebase(SignUpScreen));
