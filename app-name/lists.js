var lists = module.exports = {};


lists.index = function (head, req) {
	
	start({
		"headers": {
			"Content-Type": "text/html"
		}
	 });
	
	log('head:', head);
	log(head);
	log('req');
	log(req);
	
	var _ = require('lib/underscore'),
		data = [],
		context = {
			name: this._id.split('/').pop(),
			version: this._rev,
			bootstrap: {
				db: _.pick(req.info, 'update_seq'),
				userCtx: _.pick(req.userCtx, 'name', 'roles'),
				data: data
			},
			components: _.clone(this.components)
		},
		doc,
		row;
		
	while (row = getRow()) {
		doc = row.value;
		if (!data.hasOwnProperty(doc.type)) {
			data[doc.type] = [];
		}
		data[doc.type].push(doc);
	}
		
	send(_.template(this.templates.index, context));
};