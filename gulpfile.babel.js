'use strict'

import gulp from 'gulp'
import babel from 'gulp-babel'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import browserSync from 'browser-sync'
import plumber from 'gulp-plumber'


const reload = browserSync.reload

gulp.task('sass', () => {
	gulp.src('app/scss/app.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
})

gulp.task('script', () => {
	gulp.src('app/script/app.js')
		.pipe(plumber())
		.pipe(babel())
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({
			stream: true
		}))
})

gulp.task('serve', ['sass', 'script'], () => {
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	})
	gulp.watch('app/*.html').on('change', browserSync.reload)
	gulp.watch('app/scss/*.scss', ['sass'])
	gulp.watch('app/script/*.js', ['script'])
})

gulp.task('default', ['sass', 'script', 'serve'])