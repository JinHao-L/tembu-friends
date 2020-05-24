import * as Linking from 'expo-linking';
//TODO: Correct the link config
export default {
    prefixes: [Linking.makeUrl('/')],
    config: {
        Auth: {
            path: 'auth',
            screens: {
                SignUp: 'register',
                SignIn: 'login',
                ForgetPassword: 'pwreset',
            },
        },
        Root: {
            path: 'root',
            screens: {
                Home: 'home',
                FloorPlan: 'floorplan',
                Links: 'links',
            },
        },
    },
};
