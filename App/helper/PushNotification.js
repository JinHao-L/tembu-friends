import React from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { Colors } from '../constants';

const PushNotifications = {
    registerAsync: async () => {
        const { status } = await Notifications.getPermissionsAsync();
        let finalStatus = status;

        if (status !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                    allowAnnouncements: true,
                },
            });
            finalStatus = status;
        }
        console.log('Notification Permission', finalStatus);
        if (finalStatus !== 'granted') {
            return;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: Colors.appGreen,
                lockscreenVisibility: true,
            });
        }

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        return Notifications.getExpoPushTokenAsync();
    },

    sendPostNotification: async (displayName, expoPushToken) => {
        if (!expoPushToken) {
            console.log('No push token');
            return;
        }

        const message = {
            to: expoPushToken,
            title: 'New Post',
            body: `${displayName} posted on your wall`,
            sound: 'default',
            priority: 'high',
            channelId: 'default',
        };

        return fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
            .then((response) => console.log('Success', response.ok))
            .catch((error) => console.log('Post Notification Error', error));
    },
    sendFriendRequestNotification: async (displayName, expoPushToken) => {
        if (!expoPushToken) {
            console.log('No push token');
            return;
        }

        const message = {
            to: expoPushToken,
            title: 'Friend Request',
            body: `${displayName} sent you a friend request`,
            sound: 'default',
            priority: 'high',
            channelId: 'default',
        };

        return fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
            .then((response) => console.log('Success', response.statusText))
            .catch((error) => console.log('Friend Request Notification Error', error));
    },
    sendAcceptFriendNotification: async (displayName, expoPushToken) => {
        if (!expoPushToken) {
            return;
        }

        const message = {
            to: expoPushToken,
            title: 'New Friend',
            body: `${displayName} accepted your friend request`,
            sound: 'default',
            priority: 'high',
            channelId: 'default',
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
            .then((response) => console.log('Success', response.statusText))
            .catch((error) => console.log('Friend Accept Notification Error', error));
    },
};

export default PushNotifications;
