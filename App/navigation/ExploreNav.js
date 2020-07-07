// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import Icon from 'react-native-vector-icons/Ionicons';
//
// import { ExploreScreen } from '../screens';
// import { Colors } from '../constants';
// import { MAIN_FONT } from '../components';
// import { ModuleEdit, MyProfile, PostCreate, ProfileEdit, UserProfile } from '../screens/Profile';
//
// const ExploreStack = createStackNavigator();
// const INITIAL_ROUTE_NAME = 'Explore';
//
// function ExploreNav() {
//     return (
//         <ExploreStack.Navigator
//             initialRouteName={INITIAL_ROUTE_NAME}
//             screenOptions={{
//                 headerStyle: {
//                     backgroundColor: Colors.appGreen,
//                 },
//                 headerTintColor: Colors.appWhite,
//                 headerPressColorAndroid: Colors.appWhite,
//                 headerTitleAlign: 'left',
//                 headerTitleStyle: {
//                     fontFamily: MAIN_FONT,
//                     fontSize: 24,
//                 },
//                 headerTitleContainerStyle: {
//                     left: 0,
//                     marginLeft: 40,
//                 },
//                 headerBackImage: () => (
//                     <Icon name={'ios-arrow-back'} size={28} color={Colors.appWhite} />
//                 ),
//                 headerLeftContainerStyle: { marginLeft: 5 },
//             }}
//         >
//             <ExploreStack.Screen
//                 name="Explore"
//                 component={ExploreScreen}
//                 options={{ headerShown: false }}
//             />
//
//             <ExploreStack.Screen
//                 name="MyProfile"
//                 component={MyProfile}
//                 options={{ headerTitle: 'My Profile' }}
//             />
//             <ExploreStack.Screen
//                 name="ProfileEdit"
//                 component={ProfileEdit}
//                 options={{ headerTitle: 'Edit Profile' }}
//             />
//             <ExploreStack.Screen
//                 name="ModuleEdit"
//                 component={ModuleEdit}
//                 options={{ headerTitle: 'Edit Modules' }}
//             />
//             <ExploreStack.Screen
//                 name="UserProfile"
//                 component={UserProfile}
//                 options={{ headerTitle: 'Profile' }}
//             />
//             <ExploreStack.Screen
//                 name="PostCreate"
//                 component={PostCreate}
//                 options={{ headerTitle: 'Write Post' }}
//             />
//         </ExploreStack.Navigator>
//     );
// }
//
// export default ExploreNav;
