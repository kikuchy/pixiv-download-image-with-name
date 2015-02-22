'use strict'

var gulp = require('gulp');
var del = require('del');
var eslint = require('gulp-eslint');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var exec = require('gulp-exec');

// Extensionに含める静的ファイル群をコピー
gulp.task('copy', function () {
    gulp.src('css/*.css').pipe(
        gulp.dest('packaging/css')
    );
    gulp.src('icons/*.png').pipe(
        gulp.dest('packaging/icons')
    );
    gulp.src('lib/backgrounds.js').pipe(
        gulp.dest('packaging/lib')
    );
    return gulp.src(['manifest.json', 'options.html', 'options.js']).pipe(
        gulp.dest('packaging/')
    );
});

// 以前は分割したファイルを単純に結合していたのでconcat。
// 今はduoを使っているのでduoとかにした方が良かったかもしれない。
gulp.task('concat', function () {
    return gulp.src('lib/trigger.js')
        .pipe(exec('./node_modules/.bin/duo -o tmp <%= file.path %>; mkdir -p packaging/includes; mv tmp/lib/trigger.js packaging/includes/main.js; rm -rf tmp components', function (err, stdout, stderr){
        console.log(stdout);
        }));
});

// 一時ファイルを削除
gulp.task('clean', function (cb) {
    del([
        'packaging/**'
    ], cb);
});

gulp.task('lint', function () {
    gulp.src('lib/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('watch', ['copy', 'concat'], function () {
    gulp.watch('lib/*.js', ['lint', 'concat']);
});

gulp.task('default', ['clean', 'lint'], function () {
    gulp.start('copy');
    gulp.start('concat');
});
