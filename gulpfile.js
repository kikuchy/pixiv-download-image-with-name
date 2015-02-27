'use strict';

var gulp = require('gulp');
var del = require('del');
var eslint = require('gulp-eslint');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var zip = require('gulp-zip');

// 一時ファイルを削除
gulp.task('clean', function (cb) {
    return del([
        'packaging/**',
        'dist/**'
    ], cb);
});

// 実行前にlintしておく
gulp.task('lint', function () {
    return gulp.src('lib/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('watch', ['build'], function () {
    gulp.watch('lib/*.js', ['lint']);
});

// Extensionに含めるファイル群をコピー
gulp.task('build', ['clean', 'lint'], function () {
    gulp.src('css/*.css').pipe(
        gulp.dest('packaging/css')
    );
    gulp.src('icons/*.png').pipe(
        gulp.dest('packaging/icons')
    );
    gulp.src('lib/backgrounds.js').pipe(
        gulp.dest('packaging/lib')
    );
    gulp.src(['manifest.json', 'options.html', 'options.js']).pipe(
        gulp.dest('packaging/')
    );
    return browserify({
        entries: ['./lib/trigger.js']
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./packaging/includes'));
});

gulp.task('distribute', ['build'], function () {
    var manifest = require('./manifest.json');
    return gulp.src('packaging/**/*')
        .pipe(zip(manifest.name + '_' + manifest.version + '.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', function () {
    return gulp.start('build');
});
