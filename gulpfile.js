'use strict'

var gulp = require('gulp');
var duo = require('gulp-duo');
var del = require('del');
var eslint = require('gulp-eslint');

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
    gulp.src(['options.html', 'options.js']).pipe(
        gulp.dest('packaging/')
    );
    gulp.src('manifest.json').pipe(
        gulp.dest('packaging/')
    );
});

// 以前は分割したファイルを単純に結合していたのでconcat。
// 今はduoを使っているのでduoとかにした方が良かったかもしれない。
gulp.task('concat', function () {
    gulp.src('lib/trigger.js').pipe(duo()).pipe(gulp.dest('packaging/includes/main.js'));
});

// 一時ファイルを削除
gulp.task('clean', function () {
    del([
        'packaging/**'
    ]);
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
