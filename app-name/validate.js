modules.exports = function (newDoc, oldDoc, userCtx) {
	// Admins - Allow
	if (userCtx.roles.indexOf('_admin') === -1) {
		throw({
			unauthorized: 'Only admins are allowed to create/update "' + newDoc.type + '" documents!'
		});
	}
};