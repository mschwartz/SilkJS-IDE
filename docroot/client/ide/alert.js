/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/2/12
 * Time: 7:23 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.namespace('ide');

ide.AlertDialog = function(title, text) {
	var content = new Ext.Panel({
		preventBodyReset: true,
		frame: true,
		autoScroll: true,
		html: text
	});
	var dialog = new Ext.Window({
		title: title,
		modal: true,
		width: 50,
		height: 50,
		layout: 'fit',
		items: content,
		autoScroll: false,
		buttonAlign: 'center',
		buttons: [
			{
				text: 'Dismiss',
				handler: function() {
					dialog.close();
				}
			}
		]
	});
	dialog.show();
	var metrics = Ext.util.TextMetrics.measure(content.getEl(), text);
	var height = metrics.height;
	var size = ide.viewport.getSize();

	var width = metrics.width + dialog.getFrameWidth() + 20; // account for frame: true padding
	if (width < 200) {
		width = 200;
	}
	if (width > size.width * .9) {
		width = parseInt(size.width * .9, 10);
	}
	height += dialog.getFrameHeight();
	if (height > size.height * .8) {
		height = parseInt(size.height * .8, 10);
	}

	dialog.setWidth(width);
	dialog.setHeight(height);
	dialog.center();
};
