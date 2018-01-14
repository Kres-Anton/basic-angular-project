const $ = require('gulp-load-plugins')();
const gulp=require('gulp');
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const logger = require('gulplog');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const NODE_ENV=process.env.NODE_ENV || 'development';
let isProduction = NODE_ENV!=='development';
let config = {};
config.plugins =[];


config.plugins.push(new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        path.resolve(__dirname, 'src') // каталог с исходными файлами
    ),
    new webpack.NoEmitOnErrorsPlugin(),
  	new webpack.DefinePlugin({
    		NODE_ENV:JSON.stringify(NODE_ENV)
    		}),
    new ImageminPlugin({
      disable: false,
      optipng: {
        optimizationLevel: 7
      },
      gifsicle: {
        optimizationLevel: 3
      },
      jpegtran: {
        progressive: true
      },
      svgo: {
                plugins: [{
                    removeViewBox: false
                }]
            },
      pngquant: {
                speed: 1,
                quality: 98
            },
      plugins: []
    })
    );

if (isProduction){
	config.plugins.push(new UglifyJSPlugin());
}


module.exports = function (options,callback) {
	return function(callback){
		
		function done(err,stats){
			firstBuildReady = true;
			
			if (err){
				return;
			}
			
			logger[stats.hasErrors() ? 'error' : 'info'](stats.toString({
				colors:true
			}));
		}
	
let options = {
    entry: {
        'app': './src/main.ts',
        'polyfills':'./src/polyfills.ts'
      },
   output:{
       publicPath: '/',
       filename: isProduction? "[name].[hash].js" : "[name].js"
   },
   
  watch: !isProduction,
    
  watchOptions : {
    	aggregateTimeout : 100
    },
    
   devtool: isProduction ? false : 'cheap-inline-module-source-map',
   
   resolve: {
    extensions: ['.ts', '.js', '.less', '.css']
  },
   module:{
       rules:[   
           {
               test: /\.ts$/,
               exclude: /node_modules/,
               use: [
                 {
                    loader: 'awesome-typescript-loader',
                    options: { configFileName: path.resolve(__dirname, '../tsconfig.json') }
                  } ,
                   'angular2-template-loader'
               ]
            },
            { 
            	test: /\.less$/, use : [
               {
               	loader:'css-to-string-loader'
               },
               {
               	loader:'css-loader'
               },
               {
               	loader:'resolve-url-loader'
               },
             	{
            		loader: 'postcss-loader',options:{
            											sourceMap:true,
											     		plugins: [
											          		autoprefixer({
											            		browsers: ['last 2 version']
											          		})
											        	]
											     	}
            	},
            	{
            		loader: 'less-loader', options: {
                    								sourceMap: true,
                    								relativeUrls: false
               										}
            	}
            	]	
            },
            {
        		test: /\.(woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        		loader: 'file-loader', options:{
        			name:'../fonts/[name].[hash].[ext]'
        		}
      		},
      		{
        		test: /\.(png|jpe?g|gif|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        		loader: 'file-loader', options:{
        			name:'../images/[name].[hash].[ext]'
        		}
      		},
      		{test: /\.json$/,
      		 loader: 'json-loader'
      		},
      		{
      			test: /\.html/,
      		 loader: 'raw-loader'
      		}
       ]
   },
   plugins: config.plugins
};	

  if (!isProduction) {
    // tslint support
    options.module.rules.push({
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader'
    });
  }

	return gulp.src('./src/app/**/*.*')
		.pipe($.plumber({
			errorHendler:$.notify.onError(err =>({
				title:'webpack',
				message:err.message
			}))
		}))
		.pipe(webpackStream(options,null,done))
		.pipe(gulp.dest('./frontend/js'))
		.on('data',function(){
			if(firstBuildReady){
				callback();
			}
		});

};
};
