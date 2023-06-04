// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';



const config = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: '127.0.0.1',
        port: 2004,
        hot: true,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@api": path.resolve(__dirname, "src/api/"),
            "@assets": path.resolve(__dirname, "src/assets/"),
            "@components": path.resolve(__dirname, "src/components/"),
            "@hooks": path.resolve(__dirname, "src/hooks/"),
            "@store": path.resolve(__dirname, "src/store/"),
            "@ui": path.resolve(__dirname, "src/ui/"),
            "@views": path.resolve(__dirname, "src/views/"),
        },
        extensions: [".tsx", ".ts", ".jsx", ".js", ".scss", "..."],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        config.plugins.push(new MiniCssExtractPlugin());
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
