var rewrites = module.exports = [];

rewrites.push({
	from	: "/",
	to		: '_list/index/bootstrap'
});

rewrites.push({
	from	: "/assets/:version/css/*",
	to		: '/assets/css/*'
});
rewrites.push({
	from	: "/assets/:version/js/*",
	to		: '/assets/js/*'
});
rewrites.push({
	from	: "/assets/:version/img/*",
	to		: '/assets/img/*'
});