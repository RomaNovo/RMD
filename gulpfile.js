const gulp   		 = require('gulp'),
	pug          = require('gulp-pug'),
	sass   		 = require('gulp-sass'),
	rigger 		 = require('gulp-rigger'),
	browserSync  = require('browser-sync'),
	notify       = require('gulp-notify'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano      = require('gulp-cssnano'),
	tinypng      = require('gulp-tinypng-compress'),
	plumber 	 = require('gulp-plumber');

gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.sass')
	.pipe(plumber({ errorHandler: onError }))
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true}))
	.pipe(cssnano())
	.pipe(gulp.dest('src/css'))
	.on('end', browserSync.reload) //change on(pipe(browserSync.reload({stream:true})))
});

 gulp.task('pug', function() {
    return gulp
        .src('src/*.pug')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream:true}))

 });

 gulp.task('css-build', function() {
 	gulp.src('src/css/*.css')
 	.pipe(gulp.dest('dist/css/'))
 });

 gulp.task('js-build', function() {
 	gulp.src('src/js/*.js')
 	.pipe(gulp.dest('dist/js'))
 	.pipe(browserSync.reload({stream: true}))
 })

gulp.task('browser-sync', function() {
	browserSync({
		server: {
		  baseDir: 'dist'
		},
		notify: false
	});
});

gulp.task('img:build', function () {
	gulp.src('src/assets/img/*.{png,jpg,jpeg}')
		.pipe(tinypng({
			key: 'TH1zDBpzhsTJlsXk2STZbK34mkpZyBnt',
			log: true
		}))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
    return gulp
        .src('src/assets/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));

});

gulp.task('watch', ['browser-sync','img:build','fonts','sass','css-build','pug', 'js-build'], function() {
	gulp.watch('src/sass/**/*.sass', function(event, cb) {
	      setTimeout(function(){gulp.start('sass');},500) // задача выполниться через 500 миллисекунд и файл успеет сохраниться на диске
	});
	gulp.watch('src/sass/**/*.sass', ['sass']);
	gulp.watch('src/css/*.css', ['css-build']);
	gulp.watch('src/js/*.js', ['js-build']);
	gulp.watch('src/**/*.pug', ['pug']);
});

gulp.task('default', ['watch']);

var onError = function(err) {
    notify.onError({
        title:    "Error in " + err.plugin,
        message: err.message
    })(err);
    this.emit('end');
};
