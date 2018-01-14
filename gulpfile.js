'use strict';

const gulp=require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
let reload = browserSync.reload;

const isDevelopment	= !process.env.NODE_ENV || process.env.NODE_ENV=='development';



function lazyRequireTask(taskName,path,options){
	options = options || {};
	options.taskName=taskName;
	gulp.task(taskName,function(callback){
		let task=require(path).call(this,options);
		return task(callback);
	});
}

lazyRequireTask('clean','./tasks/clean',{src:'frontend'});

lazyRequireTask('asserts','./tasks/asserts',{	from:'src/**/*.html',base:'frontend',dst:'frontend'});

//lazyRequireTask('picture:asserts','./tasks/picture-asserts',{	from:'src/app/**/*.{png,svg,jpg}',base:'frontend/',dst:'frontend/picture'});

lazyRequireTask('watch','./tasks/watch',{ 
	objForWatch : [
	{path:'./src/**/*.html',	task:'asserts'}
	] 
});

lazyRequireTask('webpack','./tasks/webpack');

gulp.task('browser-sync', function() {
	browserSync.init({server:{
		//proxy: "http://localhost:3000",
        //files: ["public/**/*.*"],
        baseDir: "./frontend",
        port: 7000
       }
	});
});





gulp.task('server',gulp.series('browser-sync'));


gulp.task('build',gulp.series('clean','webpack', gulp.parallel('asserts')));


gulp.task('dev', gulp.series('build',gulp.parallel('server','watch')));
