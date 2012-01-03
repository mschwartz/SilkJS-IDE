/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/1/12
 * Time: 9:44 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.namespace('ide');

ide.MenuBar = Ext.extend(Ext.Toolbar, {
	initComponent: function() {
		var me = this;
		var themes = ['default'];
		forEach(IDEConfig.Themes, function(theme) {
			themes.push(theme);
		});
		var config = {
			items: [
				{
					text: 'File',
					menu: [
						{
							text: 'New Project...'
						}
					]
				},
				' ',
				{
					text: 'Edit',
					menu: [
						{
							text: 'Find...'
						}
					]
				},
				' ',
				{
					text: 'View',
					menu: [
						{
							text: 'Show Line Numbers',
							checked: true,
							handler: function() {
								ide.setLineNumbers(!this.checked);
							}
						}
					]
				},
				' ',
				{
					text: 'Navigate',
					menu: [
						{
							text: 'Toggle Bookmark'
						}
					]
				},
				' ',
				{
					text: 'Code',
					menu: [
						{
							text: 'Line Comment'
						},
						{
							text: 'Block Bookmark'
						}
					]
				},
				' ',
				{
					text: 'Refactor',
					menu: [
						{
							text: 'Rename'
						}
					]
				},
				' ',
				{
					text: 'Run',
					menu: [
						{
							text: 'Run'
						},
						{
							text: 'Preview'
						}
					]
				},
				' ',
				{
					text: 'Tools',
					menu: [
						{
							text: 'Save as Template...'
						}
					]
				},
				' ',
				{
					text: 'GitHub',
					menu: [
						{
							text: 'Commit File...'
						}
					]
				},
				' ',
				{
					text: 'Window',
					menu: [
					]
				},
				'->',
				'Theme: ',
				{
					xtype: 'combo',
					width: 80,
					editable: false,
					disableKeyFilter: true,
					forceSelection: true,
					mode: 'local',
					triggerAction: 'all',
					store: themes,
					value: 'default',
					listeners: {
						select: function(combo, record) {
							ide.setTheme(record.data.field1);
						}
					}
				}
			]
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ide.MenuBar.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('ide-menubar', ide.MenuBar);
