module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'module:react-native-dotenv',
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        app: './App',
                        assets: './App/assets',
                        components: './App/components',
                        constant: './App/constant',
                        helper: './App/helper',
                        navigation: './App/navigation',
                        screens: './App/screens',
                    },
                },
            ],
        ],
    };
};
