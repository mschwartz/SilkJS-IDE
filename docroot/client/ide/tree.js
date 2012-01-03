/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/1/12
 * Time: 10:24 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.namespace('ide');

ide.Tree = Ext.extend(Ext.tree.TreePanel, {
	initComponent: function() {
		var me = this;
		var config = {
			title: 'Project',
			animate: true,
			useArrows: true,
			autoScroll: true,
			rootVisible: true,
			containerScroll: true,
			root: new Ext.tree.TreeNode({
				expanded: true,
				icon: '/img/famfam/application.png',
				leaf: false,
				text: 'Unnamed Project'
			}),
			listeners: {
				afterrender: function() {
					me.refresh();
				},
				click: function(node) {

				},
				contextmenu: function(node, e) {
					e.stopEvent();
				}
			}
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ide.Tree.superclass.initComponent.apply(this, arguments);
	},
	refresh: function() {
		var me = this;
		var root = me.root;
		while (root.firstChild) {
			var c = root.firstChild;
			root.removeChild(c);
			c.destroy();
		}
		var client = new Ext.tree.TreeNode({
			text: 'Client',
			icon: '/img/famfam/folder.png',
			leaf: false
		});
		root.appendChild(client);
		var assets = new Ext.tree.TreeNode({
			text: 'assets',
			icon: '/img/famfam/folder.png',
			leaf: false
		});
		client.appendChild(assets);
		var stylesheets = new Ext.tree.TreeNode({
			text: 'css',
			icon: '/img/famfam/folder.png',
			leaf: false
		});
		assets.appendChild(stylesheets);
		var javascripts = new Ext.tree.TreeNode({
			text: 'js',
			icon: '/img/famfam/folder.png',
			leaf: false
		});
		assets.appendChild(javascripts);
		var images = new Ext.tree.TreeNode({
			text: 'img',
			icon: '/img/famfam/folder.png',
			leaf: false
		});
		assets.appendChild(images);
		var static = new Ext.tree.TreeNode({
			text: 'static',
			icon: '/img/famfam/folder.png',
			leaf: false
		});
		assets.appendChild(static);

		var server = new Ext.tree.TreeNode({
			text: 'Server',
			icon: '/img/famfam/folder.png',
			leaf: false
		});
		root.appendChild(server);
		var snippets = new Ext.tree.TreeNode({
			text: 'Snippets',
			icon: '/img/famfam/folder.png',
			leaf: false
		});
		server.appendChild(snippets);
		var pages = new Ext.tree.TreeNode({
			text: 'Pages',
			icon: '/img/famfam/folder.png',
			leaf: false
		});
		server.appendChild(pages);
		var page = new Ext.tree.TreeNode({
			text: 'index.jst',
			icon: '/img/famfam/page_white.png',
			leaf: true
		});
		pages.appendChild(page);
		root.expand(true);
	}
});
Ext.reg('ide-tree', ide.Tree);