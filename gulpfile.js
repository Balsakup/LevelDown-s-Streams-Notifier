let gulp = require('gulp'),
    $    = require('gulp-load-plugins')(),
    bs   = require('browser-sync').create();

gulp.task('pug', () => {
    return gulp.src('./src/pug/**/*.pug')
        .pipe($.pug({
            pretty: true
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('sass', () => {
    return gulp.src('./src/sass/**/*.sass')
        .pipe($.sass())
        .pipe($.autoprefixer())
        .pipe($.cleanCss())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('js', () => {
    return gulp.src('./src/js/**/*.js')
        .pipe($.uglify())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('server', [ 'pug', 'sass', 'js' ], () => {
    bs.init({
        server: './build'
    });

    gulp.watch('./src/pug/**', [ 'pug' ]);
    gulp.watch('./src/sass/**', [ 'sass' ]);
    gulp.watch('./src/js/**', [ 'js' ]);
    gulp.watch('./build/**').on('change', bs.reload);
});

gulp.task('default', () => {
    console.log('gulp <pug|js|sass|server>');
});