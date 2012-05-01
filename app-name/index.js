/*globals require, module, __dirname, process */
var couchapp = require('couchapp'),
	fs = require('fs'),
	path = require('path'),
	env = process.env['COUCHAPP_ENV'] || 'dev',
	
	attachmentsPath = path.join(__dirname, 'attachments'),
	componentsPath = path.join(attachmentsPath, 'components'),
	assetsPath = path.join(attachmentsPath, 'components'),
	libPath = path.join(attachmentsPath, 'lib'),
	
	_ = require(path.join(libPath, 'underscore')),
	builder = require(path.join(libPath, 'builder')),
	
	
	appName = path.basename(__dirname),
	
	designDocument = module.exports = {
		_id					: '_design/' + appName,
		rewrites			: require('./rewrites'),
		views				: require('./views'),
		shows				: require('./shows'),
		lists				: require('./lists'),
		updates				: require('./updates'),
		filters				: require('./filters'),
		validate_doc_update	: require('./validate'),
		components			: {},
		debug				: (env !== 'prod')
	},
	jsFiles = [
		"lib/jquery.js",
		"lib/underscore.js",
		"lib/backbone.js",
		"lib/component.js",
		"lib/base.js",
		
		"lib/bootstrap/js/bootstrap.js",
		
		"lib/app.js"
	],
	cssFiles = [
		"lib/bootstrap/css/bootstrap.css",
		"lib/bootstrap/css/bootstrap-responsive.css"
	];


/**
 * Load attachments
 */
couchapp.loadAttachments(designDocument, attachmentsPath);


/**
 * Load Templates
 */
designDocument.templates = couchapp.loadFiles(path.join(__dirname, 'templates'));


/**
 * Load components (templates)
 */
fs.readdirSync(componentsPath).forEach(function (component) {
	"use strict";
	var templatePath = path.join(componentsPath, component, 'templates');
	if (path.existsSync(templatePath)) {
		if (fs.statSync(templatePath).isDirectory()) {
			fs.readdirSync(templatePath).forEach(function (file) {
				var filePath = path.join(templatePath, file),
					stat = fs.statSync(filePath),
					name,
					template;
				
				if (stat.isFile()) {
					name = component + '.template.' + file.replace(path.extname(file), '');
					template = _.template(fs.readFileSync(filePath, 'utf8'));
					if (designDocument.components[name]) {
						throw new Error(name + ' is already registered!');
					}
					designDocument.components[name] = 'function () { return ' + template.source + '; }';
				}
			});
		}
	}
});


/**
 * Load libs
 */
designDocument.lib = couchapp.loadFiles(path.join(attachmentsPath, 'lib'));


/**
 * JS files
 */
jsFiles = jsFiles.concat(builder.findInDir(path.join(__dirname + '/attachments/components'), '.js'));
if (env === 'prod') {
	builder.build(attachmentsPath, jsFiles, 'assets/js/' + appName + '.js');
	jsFiles = [ 'assets/js/' + appName + '.js' ];
}
designDocument.jsFiles = jsFiles.map(function (file) {
	return file.replace(attachmentsPath + '/', '');
});


/**
 * CSS files
 */
cssFiles = cssFiles.concat(builder.findInDir(path.join(__dirname + '/attachments/components'), '.css'));
if (env === 'prod') {
	builder.build(attachmentsPath, cssFiles, 'assets/css/' + appName + '.css');
	cssFiles = [ 'assets/css/' + appName + '.css' ];
}
designDocument.cssFiles = cssFiles.map(function (file) {
	return file.replace(attachmentsPath + '/', '');
});