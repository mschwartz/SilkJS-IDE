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
			animate: false,
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
				dblclick: function(node) {
					var a = node.attributes;
					switch (a.type) {
						case 'file':
							ide.Editor.open(a.fsPath);
							break;
					}
				},
				contextmenu: function(node, e) {
					e.stopEvent();
					var a = node.attributes;
					var items = [];
					switch (a.type) {
						case 'project':
							items.push({
								text: 'Rename...',
								handler: function() {

								}
							});
							break;
						case 'file':
							items.push({
								text: 'Open',
								handler: function() {
									ide.Editor.open(a.fsPath);
								}
							});
							items.push({
								text: 'Rename...',
								handler: function() {
									console.dir(a);
									Ext.MessageBox.prompt('Rename ' + a.text, 'New filename', function(btn, fn) {
										if (btn == 'ok') {
											var oldPath = a.fsPath;
											var newPath = oldPath.split('/');
											var oldName = newPath.pop();
											var extension = oldName.split('.').pop();
											if (fn.indexOf('.') == -1) {
												fn += '.' + extension;
											}
											else {
												fn = fn.split('.');
												var newExtension = fn.pop();
												fn = fn.join('.');
												if (newExtension != extension) {
													fn += '.' + extension;
												}
											}
											newPath.push(fn);
											newPath = newPath.join('/');
											rpc('Projects.renameFile', {
												params: {
													oldPath: a.fsPath,
													newPath: newPath
												},
												fn: function(o) {
													if (!o.success) {
														ide.ErrorDialog(o.message);
													}
													else {
														ide.Editor.rename(oldPath, newPath);
													}
													me.refresh();
												}
											});
										}
									});
								}
							});
							items.push({
								text: 'Delete...',
								handler: function() {
									console.dir(a);
									Ext.MessageBox.confirm('Are you sure?', 'Delete file ' + a.text, function(btn) {
										if (btn === 'yes') {
											rpc('Projects.deleteFile', {
												params: {
													path: a.fsPath
												},
												fn: function(o) {
													if (o.success) {
														node.remove(true);
													}
													else {
														ide.ErrorDialog(o.message);
													}
												}
											});
										}
									});
								}
							});
							break;
						case 'dir':
							items.push({
								text: 'New',
								menu: [
									{
										text: 'Jst file...',
										handler: function() {
											console.dir(a);
											Ext.MessageBox.prompt('New Jst file', 'File name', function(btn, fn) {
												if (btn == 'ok') {
													fn = fn.replace(/\.jst$/i, '') + '.jst';
													rpc('Projects.putFile', {
														params: {
															create: true,
															path: a.fsPath + '/' + fn,
															content: ''
														},
														fn: function(o) {
															if (o.success) {
																me.refresh();
															}
															else {
																ide.ErrorDialog(o.message);
															}
														}
													});
												}
											});
										}
									},
									{
										text: 'CoffeScript file...',
										handler: function() {

										}
									},
									{
										text: 'Markdown file...',
										handler: function() {

										}
									},
									{
										text: 'CSS file...',
										handler: function() {

										}
									}
								]
							});
							items.push({
								text: 'Rename...',
								handler: function() {

								}
							});
							items.push({
								text: 'Upload...',
								handler: function() {

								}
							});
							break;
					}
					var menu = new Ext.menu.Menu({
						items: items
					});
					menu.showAt(e.getXY());
				}
			},
			bbar: new Ext.Toolbar({
				items: [
					{
						text: 'Refresh',
						handler: function() {
							me.refresh();
						}
					}
				]
			})
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ide.Tree.superclass.initComponent.apply(this, arguments);
		me.refreshing = false;
	},
	refresh: function() {
		var me = this;
		if (me.refreshing) {
			return;
		}
		me.refreshing = true;
		me.disable();
		rpc('Projects.treeData', {
			params: {},
			fn: function(o) {
				var root = new Ext.tree.TreeNode({
					text: o.title,
					type: 'project',
					icon: '/img/famfam/application.png',
					leaf: o.children.length,
					fsPath: '/'
				});
				function recurse(children, parent) {
					children.sort(function(a,b) {
						var alc = a.title.toLowerCase()
						blc = b.title.toLowerCase();
						if (alc === blc) {
							return 0;
						}
						if (alc > blc) {
							return 1;
						}
						return -1;
					});
					forEach(children, function(child) {
						var node = new Ext.tree.TreeNode({
							text: child.title,
							type: child.type,
							icon: child.type == 'dir' ? '/img/famfam/folder.png' : '/img/famfam/page_white.png',
							leaf: child.children.length,
							fsPath: child.fsPath
						});
						parent.appendChild(node);
						recurse(child.children, node);
					});
				}
				recurse(o.children, root);
//				var root = me.root;
//				while (root.firstChild) {
//					var c = root.firstChild;
//					root.removeChild(c);
//					c.destroy();
//				}
//				root.setText(o.title);
//				var client = new Ext.tree.TreeNode({
//					text: 'Client',
//					icon: '/img/famfam/folder.png',
//					leaf: false
//				});
//				root.appendChild(client);
//				var assets = new Ext.tree.TreeNode({
//					text: 'assets',
//					icon: '/img/famfam/folder.png',
//					leaf: false
//				});
//				client.appendChild(assets);
//				var stylesheets = new Ext.tree.TreeNode({
//					text: 'css',
//					icon: '/img/famfam/folder.png',
//					leaf: false
//				});
//				assets.appendChild(stylesheets);
//				var javascripts = new Ext.tree.TreeNode({
//					text: 'js',
//					icon: '/img/famfam/folder.png',
//					leaf: false
//				});
//				assets.appendChild(javascripts);
//				var images = new Ext.tree.TreeNode({
//					text: 'img',
//					icon: '/img/famfam/folder.png',
//					leaf: false
//				});
//				assets.appendChild(images);
//				var static = new Ext.tree.TreeNode({
//					text: 'static',
//					icon: '/img/famfam/folder.png',
//					leaf: false
//				});
//				assets.appendChild(static);
//
//				var server = new Ext.tree.TreeNode({
//					text: 'Server',
//					icon: '/img/famfam/folder.png',
//					leaf: false
//				});
//				root.appendChild(server);
//				var snippets = new Ext.tree.TreeNode({
//					text: 'Snippets',
//					icon: '/img/famfam/folder.png',
//					leaf: false
//				});
//				server.appendChild(snippets);
//				var pages = new Ext.tree.TreeNode({
//					text: 'Pages',
//					icon: '/img/famfam/folder.png',
//					leaf: false
//				});
//				server.appendChild(pages);
//				var page = new Ext.tree.TreeNode({
//					text: 'index.jst',
//					icon: '/img/famfam/page_white.png',
//					leaf: true
//				});
//				pages.appendChild(page);
				me.setRootNode(root);
				me.enable();
				root.expand(true);
				me.refreshing = false;
			}
		})
	}
});
Ext.reg('ide-tree', ide.Tree);