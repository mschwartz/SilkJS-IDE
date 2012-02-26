Ext.namespace('ide');

ide.icons = function() {
	var famfam = '/img/famfam/',
		fugue = '/img/fugue/';

    return {
		save: famfam+'disk.png',
		edit: famfam+'pencil.png',
		revert: famfam+'arrow_undo.png',
		preview: famfam+'page_white_magnify.png',
		rename: famfam+'textfield_rename.png',
		delete: famfam+'delete.png',
		new: famfam+'add.png',
		upload: fugue+'drive-upload.png',
		properties: famfam+'cog.png'
    };

}();