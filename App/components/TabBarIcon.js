import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import Colors from 'constant/Colors';

export default function TabBarIcon(property) {
    const { name, focused } = property;
    return <Icon name={name} size={30} color={focused ? Colors.appGreen : Colors.appGray2} />;
}
