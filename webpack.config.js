const webpack = require('webpack');
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
        path.resolve(__dirname, 'src')
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



module.exports = {
    entry: {
        'app': './src/main.ts',
        'polyfills':'./src/polyfills.ts'
      },
   output:{
   	   path: path.resolve(__dirname, 'frontend'),
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
                    options: { configFileName: path.resolve(__dirname, './tsconfig.json') }
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
               										}
            	}
            	]	
            },
            {
        		test: /\.(woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        		loader: 'file-loader', options:{
        			name:'./fonts/[name].[hash].[ext]'
        		}
      		},
      		{
        		test: /\.(png|jpe?g|gif|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        		loader: 'file-loader', options:{
        			name:'./images/[name].[hash].[ext]'
        		}
      		},
      		{test: /\.json$/,
      		 loader: 'json-loader'
      		}
       ]
   },
   plugins: config.plugins
};