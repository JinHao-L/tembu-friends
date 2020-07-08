import React from 'react';
import 'react-native-gesture-handler/jestSetup';
import { Reanimated } from 'react-native-reanimated/mock';

mock('react-native-reanimated', () => {
    // The mock for `call` immediately calls the callback which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};

    return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
