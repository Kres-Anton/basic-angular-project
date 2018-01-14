const $ = require('gulp-load-plugins')();
const gulp=require('gulp');

module.exports = function(options){
	
	return function(){
		return gulp.src(options.from,{since:gulp.lastRun(options.taskName)})
			.pipe($.newer(options.base))
			.pipe($.debug({title:'asserts'}))
			.pipe(gulp.dest(options.dst));
	};
};
