/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/7/12
 * Time: 5:36 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.namespace('ide');

ide.Start = Ext.extend(Ext.Panel, {
	initComponent: function() {
		var me = this;
		var config = {
			title: 'Start Page',
			autoLoad: '/client/start.jst',
			bodyStyle: 'padding: 5px;',
			preventBodyReset: true
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.bbar = new Ext.Toolbar({
			items: [
				{
					text: 'Refresh',
					handler: function() {
						me.getUpdater().refresh();
					}
				}
			]
		})
		ide.Start.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('ide-start', ide.Start);
