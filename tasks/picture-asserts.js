const $ = require('gulp-load-plugins')();
const gulp=require('gulp');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

module.exports = function(options){
	
	return function(){
		return gulp.src(options.from,{since:gulp.lastRun(options.taskName)})
			.pipe($.newer(options.dst))
			.pipe($.imagemin([
			    $.imagemin.gifsicle({interlaced: true}),
			    $.imagemin.jpegtran({progressive: true}),
			    $.imagemin.optipng({optimizationLevel: 5}),
			    $.imagemin.svgo({
			        plugins: [
			            {removeViewBox: true},
			            {cleanupIDs: false},
			            imageminJpegtran(),
						imageminPngquant({quality: '65-80'})
			        ]
			    })
			]))
			.pipe($.debug({title:'picture:asserts'}))
			.pipe(gulp.dest(options.dst));
	};
};
