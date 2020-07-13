import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, Alert, FlatList, ActivityIndicator } from 'react-native';
import { Button, Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

import { Colors } from '../constants/index';
import { MAIN_FONT, MainText, Popup } from '../components';
import { withFirebase } from '../helper/Firebase';
import ReadMore from 'react-native-read-more-text';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

const formatDate = (timestamp) => {
    if (timestamp) {
        const dateTimeFormat = timestamp.toDate();
        let day = dateTimeFormat.getDate();
        day = day < 10 ? '0' + day : day;
        const month = months[dateTimeFormat.getMonth()];

        let hours = dateTimeFormat.getHours();
        let minutes = dateTimeFormat.getMinutes();
        const ampm = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const time = hours + ':' + minutes + ampm;

        return day + ' ' + month + ' at ' + time;
    } else {
        return null;
    }
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class NotificationScreen extends Component {
    state = {
        notifications: null,
        limit: 10,
        lastLoaded: null,
        loading: false,
        refreshing: false,
        allNotificationsLoaded: false,

        notificationOptionsVisible: false,
        notificationOptionsProps: null,
    };

    componentDidMount() {
        this.retrieveNotifications();
    }

    retrieveNotifications = () => {
        this.setState({ refreshing: true, allNotificationsLoaded: false });

        return this.props.firebase
            .getUserNotifications(this.props.userData.uid)
            .orderBy('timeCreated', 'desc')
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving notifications', documents.length);
                return documents.map((document) => document.data());
            })
            .then((notifications) => {
                let lastLoaded = notifications[notifications.length - 1].timeCreated;

                return this.setState({
                    notifications: notifications,
                    lastLoaded: lastLoaded,
                    refreshing: false,
                    allNotificationsLoaded: notifications.length === 0,
                });
            })
            .catch((error) => {
                this.setState({ notifications: [], refreshing: false });
                console.log(error);
            });
    };
    retrieveMoreNotifications = () => {
        if (this.state.allNotificationsLoaded || this.state.loading || this.state.refreshing) {
            return;
        }
        this.setState({ loading: true });

        return this.props.firebase
            .getUserNotifications(this.props.userData.uid)
            .orderBy('timeCreated', 'desc')
            .startAfter(this.state.lastLoaded)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving more notifications', documents.length);
                if (documents.length !== 0) {
                    let notifications = documents.map((document) => document.data());
                    let lastLoaded = notifications[notifications.length - 1].timeCreated;

                    this.setState({
                        notifications: [...this.state.notifications, ...notifications],
                        lastLoaded: lastLoaded,
                        loading: false,
                    });
                } else {
                    this.setState({ loading: false, allNotificationsLoaded: true });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log(error);
            });
    };

    goToProfile = (uid) => {
        if (!uid || uid === 'deleted') {
            console.log('User does not exist');
        } else if (uid === this.props.userData.uid) {
            this.props.navigation.push('MyProfile');
        } else {
            this.props.navigation.push('UserProfile', { user_uid: uid });
        }
    };

    markAsRead = ({ id, seen, index }) => {
        if (seen) {
            return;
        }
        this.setState((prevState) => {
            const updated = prevState.notifications;
            updated[index].seen = true;
            return { notifications: updated };
        });
        return this.props.firebase.updateNotification(this.props.userData.uid, id, { seen: true });
    };
    removeNotification = ({ id, index }) => {
        this.setState(
            {
                notifications: [
                    ...this.state.notifications.slice(0, index),
                    ...this.state.notifications.slice(index + 1),
                ],
            },
            () => {
                if (id === this.state.lastLoaded) {
                    this.setState({
                        lastLoaded: this.state.notifications[this.state.notifications.length - 1]
                            .timeCreated,
                    });
                }
                console.log('Deleting notification');
                return this.props.firebase
                    .deleteNotification(this.props.userData.uid, id)
                    .catch((error) => console.log(error));
            }
        );
    };
    reportNotification = ({ id, reported, index }) => {
        Alert.alert('Work in progress', 'Not available');
        // if (reported) {
        //     return;
        // }
        // this.setState((prevState) => {
        //     const updated = prevState.notifications;
        //     updated[index].reported = true;
        //     return { notifications: updated };
        // });
        // return this.props.firebase.reportNotification(this.props.userData.uid, id);
    };

    renderNotification = (notification, index) => {
        const {
            message,
            notification_id,
            seen,
            timeCreated,
            type = 'FriendRequest' | 'FriendAccepted' | 'Post',
            uid,
            sender_img,
            sender_uid,
            reported = false,
        } = notification;
        const notificationOptionsProps = {
            id: notification_id,
            seen: seen,
            index: index,
            reported: reported,
        };
        let iconName;
        switch (type) {
            case 'FriendRequest':
                iconName = 'account-plus';
                break;
            case 'FriendAccepted':
                iconName = 'account-multiple';
                break;
            case 'Post':
                iconName = 'text';
                break;
            default:
                iconName = 'account';
                break;
        }
        return (
            <ListItem
                containerStyle={seen ? styles.notificationItemSeen : styles.notificationItem}
                title={message}
                titleStyle={seen ? styles.notificationTextSeen : styles.notificationText}
                subtitle={formatDate(timeCreated)}
                subtitleStyle={styles.dateTimeText}
                bottomDivider={true}
                leftAvatar={{
                    rounded: true,
                    source: sender_img
                        ? { uri: sender_img }
                        : require('../assets/images/default/profile.png'),
                    showAccessory: true,
                    accessory: {
                        name: iconName,
                        type: 'material-community',
                        underlayColor: Colors.appWhite,
                        color: Colors.appGreen,
                        style: { backgroundColor: Colors.appWhite, borderRadius: 50 },
                        // color: Colors.appGreen,
                        // underlayColor: Colors.appWhite,
                    },
                    onPress: sender_uid
                        ? () => {
                              this.goToProfile(sender_uid);
                          }
                        : undefined,
                    overlayContainerStyle: {
                        backgroundColor: Colors.appWhite,
                    },
                    size: 'medium',
                }}
                onPress={() => {
                    if (!seen) {
                        this.markAsRead(notificationOptionsProps);
                    }
                    this.goToProfile(uid);
                }}
                onLongPress={() =>
                    this.setState({
                        notificationOptionsVisible: true,
                        notificationOptionsProps: notificationOptionsProps,
                    })
                }
            />
        );
    };
    renderEmptyNotifications = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <MainText>All cleared</MainText>
                <MainText>No new notification</MainText>
            </View>
        );
    };
    renderFooter = () => {
        if (this.state.loading) {
            return <ActivityIndicator color={Colors.appGreen} />;
        } else {
            return null;
        }
    };

    renderNotificationOptions = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.notificationOptionsVisible}
                title={'Options'}
                body={
                    <View>
                        {!this.state.notificationOptionsProps?.seen && (
                            <View>
                                <Button
                                    title={'Mark as read'}
                                    type={'clear'}
                                    titleStyle={styles.optionsTitle}
                                    icon={{
                                        name: 'done',
                                        color: Colors.statusGreen,
                                        size: 25,
                                        containerStyle: { paddingHorizontal: 10 },
                                    }}
                                    buttonStyle={{ justifyContent: 'flex-start' }}
                                    containerStyle={{ borderRadius: 0 }}
                                    onPress={() => {
                                        this.markAsRead(this.state.notificationOptionsProps);
                                        this.setState({
                                            notificationOptionsVisible: false,
                                            notificationOptionsProps: null,
                                        });
                                    }}
                                />
                                <Popup.Separator />
                            </View>
                        )}
                        <Button
                            title={'Remove this notification'}
                            type={'clear'}
                            titleStyle={styles.optionsTitle}
                            icon={{
                                name: 'delete',
                                color: Colors.statusRed,
                                size: 25,
                                containerStyle: { paddingHorizontal: 10 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            onPress={() => {
                                this.removeNotification(this.state.notificationOptionsProps);
                                this.setState({
                                    notificationOptionsVisible: false,
                                    notificationOptionsProps: null,
                                });
                            }}
                        />
                        <Popup.Separator />
                        <Button
                            title={'Report notification bug'}
                            type={'clear'}
                            titleStyle={styles.optionsTitle}
                            icon={{
                                name: 'bug-report',
                                color: Colors.statusYellow,
                                size: 25,
                                containerStyle: { paddingHorizontal: 10 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            // TODO:
                            onPress={() => {
                                this.reportNotification(this.state.notificationOptionsProps);
                                this.setState({
                                    notificationOptionsVisible: false,
                                    notificationOptionsProps: null,
                                });
                            }}
                        />
                    </View>
                }
                buttonText={'Cancel'}
                callback={() => {
                    this.setState({
                        notificationOptionsVisible: false,
                        notificationOptionsProps: null,
                    });
                }}
            />
        );
    };

    render() {
        const { notifications, refreshing } = this.state;
        if (notifications === null) {
            return (
                <View
                    style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}
                >
                    <ActivityIndicator color={Colors.appGreen} />
                </View>
            );
        }

        return (
            <SafeAreaView style={styles.container}>
                {this.renderNotificationOptions()}
                <FlatList
                    data={notifications}
                    renderItem={({ item, index }) => this.renderNotification(item, index)}
                    keyExtractor={(notification) => notification.notification_id}
                    ListEmptyComponent={this.renderEmptyNotifications}
                    ListFooterComponent={this.renderFooter}
                    refreshing={refreshing}
                    onRefresh={this.retrieveNotifications}
                    onEndReached={this.retrieveMoreNotifications}
                    onEndReachedThreshold={0.1}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.appGreen,
        paddingBottom: 10,
        paddingTop: 20,
    },
    container: {
        backgroundColor: Colors.appWhite,
        flex: 1,
    },
    dateTimeText: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
        color: Colors.appDarkGray,
    },
    notificationIconContainer: {
        marginRight: 12,
    },
    notificationItemSeen: {
        backgroundColor: Colors.appLightGray,
    },
    notificationItem: {
        borderRightWidth: 5,
        borderColor: Colors.appGreen,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        backgroundColor: Colors.appWhite,
    },
    notificationText: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: '200',
        color: Colors.appBlack,
    },
    notificationTextSeen: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: '100',
        color: Colors.appDarkGray,
    },
    optionsTitle: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appBlack,
        flexShrink: 1,
        textAlign: 'left',
    },
});

export default connect(mapStateToProps)(withFirebase(NotificationScreen));
