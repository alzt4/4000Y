const path = require('path');
module.exports = {
    entry: {
        viewSub: '../client/src/viewSub.js',
        assnSub: '../client/src/assnSub.js',
        newSub: '../client/src/newSub.js',
        newAssn: '../client/src/newAssn.js',
        editAssn: '../client/src/editAssn.js',
        manageCourses: '../client/src/manageCourses.js',
        newCourse: '../client/src/newCourse.js',
        instructorHome: '../client/src/instructorHome.js',
        viewCourse: '../client/src/viewCourse.js',
        editCourse: '../client/src/editCourse.js'

    },
    devtool: 'eval-source-map',
    mode: "development",
    output: {
        path: path.resolve(__dirname, '../client/dist/js'),
        filename: "[name].js",
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: () => [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    }

};