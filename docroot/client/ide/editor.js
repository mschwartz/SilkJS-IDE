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
                changeHandler: function() { me.setModified(true); },
				value: ''
			}
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.tbar = new Ext.Toolbar({
			items: [
				{
					text: 'Save',
					icon: ide.icons.save,
					handler: function() {
						rpc('Projects.putFile', {
							params: {
								path: me.initialConfig.fsPath,
								content: Ext.getCmp('editor-'+id).getValue()
							},
							fn: function(o) {
                                me.setModified(false);
								ide.Notify('Saved ' + me.initialConfig.fsPath);
							}
						});
					}
				},
				{
					text: 'Revert',
					icon: ide.icons.revert,
                    handler: function() {
                        if (me.isModified) {
                            Ext.MessageBox.confirm('Unsaved changes', 'All changes will be lost', function(btn) {
                                if (btn === 'yes') {
                                    me.loadFile(function() {
                                        ide.Notify('File reverted');
                                    });
                                }
                            })
                        }
                    }
				},
				'->',
				{
					text: 'Preview',
					icon: ide.icons.preview,
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
                Ext.getCmp('ide-tree').refresh();
			},
            beforeclose: function() {
                var me = this;
                if (!me.isModified) {
                    return;
                }
                Ext.MessageBox.confirm('Close without saving?', 'All changes will be lost', function(btn) {
                    if (btn === 'yes') {
                       me.destroy();
                    }
                });
                return false;
            },
			afterrender: function() {
                me.editor = Ext.getCmp('editor-'+id);
                me.loadFile();
			}
		});
        me.isModified = false;
        me.filename = filename;
	},
    loadFile: function(callback) {
        var me = this;
        rpc('Projects.getFile', {
            params: {
                path: me.fsPath
            },
            fn: function(o) {
                me.editor.setValue(o.body);
                me.editor.clearHistory();
                me.setModified(false);
                callback && callback();
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
	},
    setModified: function(flag) {
        if (flag === this.isModified) {
            return;
        }
        this.isModified = flag;
        var me = this;
        var title = me.filename;
        if (flag) {
            title = '<i>' + title+'</i>';
        }
        me.setTitle(title);
        Ext.getCmp('ide-tree').refresh();
    }
});

Ext.reg('ide-editor', ide.Editor);

ide.Editor.open = function(path) {
    var extension = path.split('.').pop();
    var tab = ide.editors[path];
	if (!tab) {
		tab = ide.Workspace.addCard({
			xtype: 'ide-editor',
            language: extension,
			closable: true,
			fsPath: path,
			tabTip: path
		});
        ide.editors[path] = tab;
    }
	ide.Workspace.setCard(tab);
};

ide.Editor.rename = function(oldPath, newPath) {
	var tab = ide.editors[oldPath];
	if (tab) {
		delete ide.editors[oldPath];
		ide.editors.newPath = tab;
		tab.setTitle(newPath.split('/').pop());
	}
};

ide.Editor.delete = function(path) {
    var tab = ide.editors[path];
    if (tab) {
        tab.destroy();
    }
};

ide.Editor.isOpen = function(path) {
    return !!ide.editors[path];
};
ide.Editor.isModified = function(path) {
    var tab = ide.editors[path];
    return tab && tab.isModified;
}

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
