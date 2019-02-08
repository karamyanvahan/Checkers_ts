const   gulp    = require('gulp'),
        ts      = require('gulp-typescript'),
        sass    = require('gulp-sass');
 
function tsTask() {
    return gulp.src('src/ts/index.ts')
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'index.js',
            module: 'amd'
        }))
        .pipe(gulp.dest('dist/js'));
}

function watchTs() {
    return gulp.watch('./src/ts/**/*.ts', tsTask)
}

function sassTask() {
    return gulp.src('./src/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
}

function watchSass() {
    gulp.watch('./src/sass/**/*.sass', sassTask)
}

exports.ts = tsTask;
exports.sass = sassTask;
exports.default = gulp.parallel(watchSass, watchTs)
