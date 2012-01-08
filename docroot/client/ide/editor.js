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
		var filename = me.initialConfig.fsPath.split('/').pop();
		var config = {
			border: false,
			bodyBorder: false,
			title: filename,
			layout: 'fit',
			items: {
				xtype: 'ux-codemirror',
				border: false,
				bodyBorder: false,
				id: 'editor-'+id,
				language: this.initialConfig.language || 'jst',
				value: ''
			}
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.tbar = new Ext.Toolbar({
			items: [
				{
					text: 'Save'
				},
				{
					text: 'Revert'
				},
				'->',
				{
					text: 'Preview',
					handler: function() {
					}
				}
			]
		})
		this.bbar = new Ext.Toolbar({
			items: [
				'File: ',
				this.initialConfig.fsPath,
				'-',
				'Mode: ',
				this.initialConfig.language || 'Jst'
			]
		});
		ide.Editor.superclass.initComponent.apply(this, arguments);
		me.fsPath = me.initialConfig.fsPath;
		ide.editors[me.fsPath] = me;
		me.on({
			destroy: function() {
				delete ide.editors[me.fsPath];
			},
//			activate: function() {
//				Ext.getCmp('editor-'+id).codeEditor.focus();
////				Ext.getCmp('editor-'+id).codeEditor.refresh();
//			},
			afterrender: function() {
				rpc('Projects.getFile', {
					params: {
						path: me.fsPath
					},
					fn: function(o) {
						Ext.getCmp('editor-'+id).setValue(o.body);
					}
				})
			}
		});
	},
	setOption: function(option, value) {
		var id = this.id;
		Ext.getCmp('editor-'+id).setOption(option, value);
	},
	refresh: function() {
		var id = this.id;
		Ext.getCmp('editor-'+id).refresh();
	}
});

Ext.reg('ide-editor', ide.Editor);

ide.Editor.open = function(path) {
	if (!ide.editors[path]) {
		ide.editors[path] = ide.Workspace.addCard({
			xtype: 'ide-editor',
			closable: true,
			fsPath: path,
			tabTip: path
		});
	}
	ide.Workspace.setCard(ide.editors[path]);
};

ide.setTheme = function(theme) {
	forEach(ide.editors, function(editor) {
		editor.setOption('theme', theme);
		editor.refresh();
	});
};

ide.setLineNumbers = function(show) {
	forEach(ide.editors, function(editor) {
		editor.setOption('lineNumbers', show);
	});
};
