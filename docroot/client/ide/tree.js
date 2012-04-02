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
                                icon: ide.icons.rename,
                                handler: function() {

                                }
                            });
                            items.push({
                                text: 'Properties...',
                                icon: ide.icons.properties,
                                handler: function() {

                                }
                            });
                            break;
                        case 'file':
                            items.push({
                                text: 'Edit',
                                icon: ide.icons.edit,
                                handler: function() {
                                    ide.Editor.open(a.fsPath);
                                }
                            });
                            items.push({
                                text: 'Rename...',
                                icon: ide.icons.rename,
                                handler: function() {
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
                                icon: ide.icons.delete,
                                handler: function() {
                                    Ext.MessageBox.confirm('Are you sure?', 'Delete file ' + a.text, function(btn) {
                                        if (btn === 'yes') {
                                            rpc('Projects.deleteFile', {
                                                params: {
                                                    path: a.fsPath
                                                },
                                                fn: function(o) {
                                                    if (o.success) {
                                                        node.remove(true);
                                                        ide.Editor.delete(a.fsPath);
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
                            items.push({
                                text: 'Properties...',
                                icon: ide.icons.properties,
                                handler: function() {

                                }
                            });
                            break;
                        case 'dir':
                            items.push({
                                text: 'New',
                                icon: ide.icons.new,
                                menu: [
                                    {
                                        text: 'SJS file...',
                                        handler: function() {
                                            me.newFile('New SJS File', function(fn) { return a.fsPath + '/' + fn.replace(/\.sjs$/i, '') + '.sjs'});
                                        }
                                    },
                                    {
                                        text: 'JST file...',
                                        handler: function() {
                                            me.newFile('New Jst File', function(fn) { return a.fsPath + '/' + fn.replace(/\.jst$/i, '') + '.jst'});
                                        }
                                    },
                                    {
                                        text: 'CoffeScript file...',
                                        handler: function() {
                                            me.newFile('New CoffeeScript File', function(fn) { return a.fsPath + '/' + fn.replace(/\.coffee$/i, '') + '.coffee'});
                                        }
                                    },
                                    {
                                        text: 'Markdown file...',
                                        handler: function() {
                                            me.newFile('New Markdown File', function(fn) { return a.fsPath + '/' + fn.replace(/\.md$/i, '') + '.md'});
                                        }
                                    },
                                    {
                                        text: 'CSS file...',
                                        handler: function() {
                                            me.newFile('New CSS File', function(fn) { return a.fsPath + '/' + fn.replace(/\.css$/i, '') + '.css'});
                                        }
                                    },
                                    {
                                        text: 'LESS file...',
                                        handler: function() {
                                            me.newFile('New LESS File', function(fn) { return a.fsPath + '/' + fn.replace(/\.less$/i, '') + '.less'});
                                        }
                                    }
                                ]
                            });
                            items.push({
                                text: 'Rename...',
                                icon: ide.icons.rename,
                                handler: function() {

                                }
                            });
                            items.push({
                                text: 'Upload...',
                                icon: ide.icons.upload,
                                handler: function() {

                                }
                            });
                            items.push({
                                text: 'Properties...',
                                icon: ide.icons.properties,
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
    newFile: function(prompt, fnFunc) {
        var me = this;
        Ext.MessageBox.prompt(prompt, 'File name', function(btn, fn) {
            if (btn == 'ok') {
//                fn = fn.replace(/\.jst$/i, '') + '.jst';
                fn = fnFunc(fn);
                rpc('Projects.putFile', {
                    params: {
                        create: true,
                        path: fn,
                        content: ''
                    },
                    fn: function(o) {
                        if (o.success) {
                            ide.Editor.open(fn);
                            me.refresh();
                        }
                        else {
                            ide.ErrorDialog(o.message);
                        }
                    }
                });
            }
        });
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
                        var title = child.title;
                        if (ide.Editor.isOpen(child.fsPath)) {
                            title = '<b>' + title + '</b>';
                        }
                        if (ide.Editor.isModified(child.fsPath)) {
                            title = '<i>' + title + '</i>';
                        }
                        
                        var node = new Ext.tree.TreeNode({
                            text: title,
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
                me.setRootNode(root);
                me.enable();
                root.expand(true);
                me.refreshing = false;
            }
        })
    }
});
Ext.reg('ide-tree', ide.Tree);