/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/1/12
 * Time: 10:51 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.namespace('ide');

ide.Workspace = Ext.extend(Ext.Panel, {
	initComponent: function() {
		var me = this;
		var config = {
			layout: 'border',
			items: [
				{
					region: 'north',
					xtype: 'ide-menubar',
					height: 22
				},
				{
					region: 'west',
					width: 200,
					xtype: 'ide-tree'
				},
				{
					region: 'center',
					layout: 'fit',
					items: {
						xtype: 'ide-editor'
					}
				}
			]
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ide.Workspace.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('ide-workspace', ide.Workspace);

ide.openWorkspace = function() {
	ide.viewport.addCard({
		xtype: 'ide-workspace'
	});
};
