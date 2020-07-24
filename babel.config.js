module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo', 'module:react-native-dotenv'],
        plugins: [
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        assets: './App/assets',
                        components: './App/components',
                        constant: './App/constant',
                        helper: './App/helper',
                        navigation: './App/navigation',
                        redux: './App/redux',
                        screens: './App/screens',
                    },
                },
            ],
        ],
    };
};
