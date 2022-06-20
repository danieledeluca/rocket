const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const mode = require('gulp-mode')();
const webpack = require('webpack-stream');
const TerserPlugin = require('terser-webpack-plugin');
const browserSync = require('browser-sync').create();

// Paths
const paths = {
    styles: {
        src: [
            './assets/scss/**/*.scss',
        ],
        dest: './assets/css',
    },
    scripts: {
        src: [
            './assets/js/**/*.js',
        ],
        scrBundle: './assets/js/app.js',
        dest: './assets/js',
    },
};

// Options
const options = {
    styles: {
        outputStyle: 'expanded',
        outputStyleBuild: 'compressed',
        includePaths: ['node_modules'],
        suffix: '.min',
        overrideBrowserslist: ['last 2 versions'],
    },
    scripts: {
        bundleName: 'app.min.js',
    },
    webpack: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    browserSync: {
        server: true,
        files: [
            './**/*.html',
        ],
    },
};

/**
 * Start server
 */
function serve() {
    browserSync.init(options.browserSync);
}

/**
 * Compile .css files
 * @returns {object}
 */
function compileCSS() {
    return gulp
        .src(paths.styles.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(
            {
                outputStyle: mode.production() ? options.styles.outputStyleBuild : options.styles.outputStyle,
                includePaths: options.styles.includePaths,
            },
        ).on('error', sass.logError))
        .pipe(mode.production(autoprefixer({ overrideBrowserslist: options.styles.overrideBrowserslist })))
        .pipe(rename({ suffix: options.styles.suffix }))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

/**
 * Compile .js files
 * @returns {object}
 */
function compileJS() {
    if (!mode.production()) {
        options.webpack.rules = [];
    }

    return gulp
        .src(paths.scripts.scrBundle)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(webpack({
            mode: mode.production() ? 'production' : 'development',
            watch: !mode.production(),
            output: {
                filename: options.scripts.bundleName,
            },
            optimization: {
                minimize: mode.production(),
                minimizer: [
                    new TerserPlugin({
                        extractComments: false,
                        terserOptions: {
                            format: {
                                comments: false,
                            },
                        },
                    }),
                ],
            },
            module: {
                rules: options.webpack.rules,
            },
        }))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

/**
 * Watch .scss and .js files for changes
 */
function watch() {
    gulp.watch(paths.styles.src, { ignoreInitial: false }, compileCSS);
    gulp.watch(paths.scripts.src, { ignoreInitial: false }, compileJS);
}

// Tasks
exports.serve = serve;
exports.watch = gulp.parallel(serve, watch);
exports.build = gulp.parallel(compileCSS, compileJS);
