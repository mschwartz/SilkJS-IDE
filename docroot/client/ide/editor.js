/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/1/12
 * Time: 10:04 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.namespace('ide');

ide.editors = {};

ide.Editor = Ext.extend(Ext.Panel, {
	initComponent: function() {
		var me = this;
		var id = me.id;
		var config = {
			layout: 'fit',
			items: {
				xtype: 'ux-codemirror',
				id: 'editor-'+id,
				language: 'jst',
				value: ''
			}
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.bbar = new Ext.Toolbar({
			items: [
				'Mode: ',
				this.initialConfig.language || 'Jst'
			]
		});
		ide.Editor.superclass.initComponent.apply(this, arguments);
		ide.editors[me.id] = me;
	},
	setOption: function(option, value) {
		var id = this.id;
		Ext.getCmp('editor-'+id).setOption(option, value);
	}
});

Ext.reg('ide-editor', ide.Editor);

ide.setTheme = function(theme) {
	forEach(ide.editors, function(editor) {
		editor.setOption('theme', theme);
	});
};

ide.setLineNumbers = function(show) {
	forEach(ide.editors, function(editor) {
		editor.setOption('lineNumbers', show);
	});
};
