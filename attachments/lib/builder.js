/*globals require, exports, console, __dirname */
var fs = require('fs'),
	path = require('path'),
	uglify = require("uglify-js"),
	cssmin = require("cssmin"),
	
	
	/**
	 * Concat
	 */
	concat = exports.concat = function (basePath, files, toFile) {
		
		toFile = path.join(basePath, toFile);
		
		console.log(toFile);
		
		var dirname = path.dirname(toFile),
			data;
	
		if (!path.existsSync(dirname)) {
			throw new Error('"' + dirname +'" does not exists!');
		}
	
		data = files.map(function (file) {
			var filePath = path.join(basePath, file);
			
			if (path.existsSync(filePath)) {
				return fs.readFileSync(filePath, 'utf8');
			} else {
				throw new Error('Error unable to find file: "' + filePath + '"');
			}
		});
		
		fs.writeFileSync(toFile, data.join('\n'));
	},
	
	
	/**
	 * Minify
	 */
	minify = exports.minify = function (basePath, fromFile, toFile) {
		fromFile = path.join(basePath, fromFile);
		toFile = path.join(basePath, toFile);
		
		var dirname = path.dirname(toFile),
			extName = path.extname(toFile),
			fileContents,
			jsp,
			pro,
			ast;
	
		if (!path.existsSync(dirname)) {
			throw new Error('"' + dirname +'" does not exists!');
		}
	
		if (!path.existsSync(fromFile)) {
			throw new Error('"' + fromFile +'" does not exists!');
		}
		
		fileContents = fs.readFileSync(fromFile, 'utf8');
		
		// JS
		if (extName === '.js') {
			jsp = uglify.parser;
			pro = uglify.uglify;
			ast = jsp.parse(fileContents); // parse code and get the initial AST
			ast = pro.ast_mangle(ast); // get a new AST with mangled names
			ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
			fileContents = pro.gen_code(ast); // compressed code here
			
		// CSS
		} else if (extName === '.css') {
			fileContents = cssmin.cssmin(fileContents);
		}
		
		fs.writeFileSync(toFile, fileContents);
	},
	
	
	/**
	 * Build
	 */
	build = exports.build = function (basePath, files, toFile) {
		var extName,
			minFile;
		
		// Concat files
		concat(basePath, files, toFile);
		
		extName = path.extname(toFile);
		minFile = toFile.replace(extName, '.min' + extName);
		
		// Minify
		minify(basePath, toFile, minFile);
	};