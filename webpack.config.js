const path = require('path');

module.exports = {
    mode: "development",
    entry: ['./src/main.ts'],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    externals: {
        "geolocation-storage": "WatchPosition"
    },
    output: {
        filename: 'weather-widget.js',
        path: path.resolve(__dirname, 'dist')
    }
};
