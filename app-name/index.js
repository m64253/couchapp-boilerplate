/*globals require, module, __dirname */
var couchapp = require('couchapp'),
	fs = require('fs'),
	path = require('path'),
	
	basePath = path.join(__dirname, '../'),
	attachmentsPath = path.join(basePath, 'attachments'),
	componentsPath = path.join(attachmentsPath, 'components'),
	assetsPath = path.join(attachmentsPath, 'components'),
	libPath = path.join(attachmentsPath, 'lib'),
	
	_ = require(path.join(libPath, 'underscore')),
	builder = require(path.join(libPath, 'builder')),
	
	designName = path.basename(__dirname),
	
	designDocument = module.exports = {
		_id			: '_design/' + designName,
		rewrites	: require('./rewrites'),
		views		: require('./views'),
		shows		: require('./shows'),
		lists		: require('./lists'),
		filters		: require('./filters'),
		components	: {}
	};


/**
 * Load attachments
 */
couchapp.loadAttachments(designDocument, attachmentsPath);


/**
 * Load Templates
 */
designDocument.templates = couchapp.loadFiles(path.join(basePath, 'templates'));


/**
 * Load components (templates)
 */
fs.readdirSync(componentsPath).forEach(function (component) {
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
						throw Error(name + ' is already registered!');
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
 * Build
 */
builder.build(attachmentsPath, require('./js.json'), 'assets/js/' + designName + '.js');
builder.build(attachmentsPath, require('./css.json'), 'assets/css/' + designName + '.css');