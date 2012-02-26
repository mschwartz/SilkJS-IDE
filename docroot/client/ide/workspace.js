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
		var id = Ext.id();
		var config = {
			layout: 'border',
			border: false,
			bodyBorder: false,
			items: [
				{
					region: 'north',
					xtype: 'ide-menubar',
					height: 22
				},
				{
					region: 'west',
					split: true,
					width: 200,
                    id: 'ide-tree',
					xtype: 'ide-tree'
				},
				{
					region: 'center',
					id: 'editors-'+id,
//					layout: 'tabpanel',
					xtype: 'tabpanel',
					activeItem: 0,
					items: [
						{
							xtype: 'ide-start',
							closable: true
						}
					],
					listeners: {
						tabchange: function(panel, tab) {
							if (tab && tab.rendered) {
//								tab.syncSize();
								tab.refresh && tab.refresh();
							}
						}
					}
				},
				{
					region: 'south',
					id: 'south-'+id,
					split: true,
					autoHide: true,
					height: 200,
					xtype: 'tabpanel',
//					collapsible: true,
					collapseMode: 'mini',
					activeTab: 0,
					items: [
						{
							title: 'Output',
							bodyStyle: 'padding: 5px;',
							html: 'output'
						}
					]
				}
			],
			bbar: new Ext.Toolbar({
				items: [
					{
						text: 'Hide/Show',
						handler: function() {
							var cmp = me.layout.south;
							if (cmp.isCollapsed) {
								cmp.panel.expand();
							}
							else {
								cmp.panel.collapse();
							}
						}
					}
				]
			})
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ide.Workspace.superclass.initComponent.apply(this, arguments);
		me.workspaceId = id;
	}
});
Ext.reg('ide-workspace', ide.Workspace);

ide.Workspace.open = function() {
	ide.Workspace.current = ide.viewport.addCard({
		xtype: 'ide-workspace'
	});
};

ide.Workspace.addCard = function(o) {
	var id = ide.Workspace.current.workspaceId;
	return Ext.getCmp('editors-'+id).add(o);
};

ide.Workspace.setCard = function(n) {
	var id = ide.Workspace.current.workspaceId;
//	Ext.getCmp('editors-'+id).getLayout().setActiveItem(n);
	Ext.getCmp('editors-'+id).setActiveTab(n);
};

