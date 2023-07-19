const path = require("path");

module.exports = {
    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "less",
            patterns: [
                // 自己对应文件路径，全局变量路径，不能使用路径别名
                path.resolve(__dirname, "./src/assets/style/themeColor.less"),
            ],
        },
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.(xlsx|xls)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]', // 保留原始文件名和扩展名
                                outputPath: 'assets', // 输出文件的文件夹路径，可以根据需要更改
                            },
                        },
                    ],
                },
            ],
        },
    }
};
