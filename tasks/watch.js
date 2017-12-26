const gulp=require('gulp');

module.exports = function(options){
	return function () {
			for (let key in options.objForWatch){
				gulp.watch(options.objForWatch[key].path,gulp.series(options.objForWatch[key].task));
			}
	};

};


