const $ = require('gulp-load-plugins')();
const gulp=require('gulp');
const combiner = require('stream-combiner2').obj;
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });


const isDevelopment	= !process.env.NODE_ENV || process.env.NODE_ENV=='development';


module.exports=function(options){
	return function(){
		return combiner(
	gulp.src(options.from,{base:options.base}),
	$.if(isDevelopment,$.sourcemaps.init()),
	$.less({
    	plugins: [autoprefix]
  	}),
	$.if(isDevelopment,$.sourcemaps.write()),
	$.concatCss('style.css'),
	gulp.dest(options.dst)
	).on('error',$.notify.onError(function(err){
		return {
			title:'Less',
			message:err.message
		};
	}));
	
	};
	
};