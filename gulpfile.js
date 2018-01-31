var gulp = require('gulp');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');

var reload = browserSync.reload;

gulp.task('sass', function () {
	gulp.src('app/scss/app.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
})

gulp.task('script', function () {
	gulp.src('app/script/app.js')
		.pipe(plumber())
		.pipe(babel())
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
})

gulp.task('serve', ['sass', 'script'], function () {
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	});
	gulp.watch('app/*.html').on('change', browserSync.reload);
	gulp.watch('app/scss/*.scss', ['sass']);
	gulp.watch('app/script/*.js', ['script']);
});

gulp.task('default', ['sass', 'script', 'serve']);