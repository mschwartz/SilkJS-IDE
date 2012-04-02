/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 1/1/12
 * Time: 8:35 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.namespace('Ext.ux.form');

Ext.ux.form.CodeMirror = Ext.extend(Ext.form.TextArea, {
	language: 'txt',
	hideLabel: true,
	codeMirrorPath: IDEConfig.CodeMirror,
	fromTextArea: function() {
		if (this.codeEditor) {
			return;
		}
		var mode;
		switch (this.language.toLowerCase()) {
			case 'css':
				mode = 'css';
				break;
            case 'less':
                mode = 'text/less';
                break;
			case 'js':
            case 'sjs':
				mode = 'text/javascript';
				break;
			case 'php':
				mode = 'php';
				break;
			case 'htm':
			case 'html':
			case 'xml':
				mode = 'text/html';
				break;
			case 'jst':
				mode = 'application/x-ejs';
				break;
            case 'coffee':
                mode = 'coffeescript';
                break;
			default:
				mode = 'text/plain';
				break;

		}
		var me = this;
		var initialized = false;
		me.hlLine = null;
		this.codeEditor = CodeMirror.fromTextArea(Ext.get(this.id).dom, {
			value: me.initialConfig.value,
            extraKeys: {
                'Ctrl-S': function(cm) { alert('save'); },
                'Ctrl-E': function(cm) {
                    var start = cm.getCursor(true), end = cm.getCursor(false);
                    var l = cm.getCursor();
                    if (start.ch === end.ch && start.line === end.line) {
                        start = {
                            line: l.line,
                            ch: 0
                        };
                        end = {
                            line: l.line+1,
                            ch: 0
                        }
                    }
                    else {
                        start.ch = end.ch = 0;
                    }
                    cm.replaceRange('', start, end);
//                    CodeMirror.commands.deleteLine(instance);
                },
                'Ctrl-D': function(cm) {
                    var start = cm.getCursor(true), end = cm.getCursor(false);
                    var l = cm.getCursor();
                    if (start.ch === end.ch && start.line === end.line) {
                        start = {
                            line: l.line,
                            ch: 0
                        };
                        end = {
                            line: l.line+1,
                            ch: 0
                        }
                    }
                    var selection = cm.getRange(start, end);
                    cm.replaceRange(selection+selection, start, end);
                    cm.setCursor(l.line+1, l.ch);
                }
            },
			mode: mode,
			path: this.codeMirrorPath + '/js/',
			textWrapping: false,
			lineNumbers: true,
			indentUnit: 4,
			electricChars: false,
			enterMode: 'keep',
			tabMode: 'shift',
			onChange: this.initialConfig.changeHandler,
//			theme: 'cobalt',
			smartIndent: true/*,
			onCursorActivity: function() {
//				if (initialized) {
					me.codeEditor.setLineClass(me.hlLine, null);
					me.hlLine = me.codeEditor.setLineClass(me.codeEditor.getCursor().line, "CodeMirror-current-line");
//				}
			},
			initCallback: function() {
				console.log('initCallback');
				me.initialized = true;
				(function() {
					if (me.codeEditor) {
						var el = Ext.get(me.codeEditor.wrapping);
						el.setSize(me.initialwidth, me.initialHeight);
						Ext.get(me.id).setSize(me.initialWidth, me.initialHeight);
					}
				}).defer(10);
				pwp.log('initalize');
				me.fireEvent('initialize', true);
			}*/
		});
		var el = this.el;
		var w = this.ownerCt.getWidth();
		var h = this.ownerCt.getHeight();
//		Ext.fly(this.codeEditor.getWrapperElement()).setSize(this.lastWidth, this.lastHeight);
		Ext.fly(this.codeEditor.getScrollerElement()).setSize(this.lastWidth, this.lastHeight);
		var ed = this.codeEditor;
		ed.setValue(this.value);
		me.hlLine = ed.setLineClass(0, "CodeMirror-current-line");
		ed.refresh();
//		(function() {
//			me.hlLine = ed.setLineClass(0, "CodeMirror-current-line");
//			initialized = true;
//			ed.focus();
//		}).defer(10);
	},
	toTextArea: function() {
		if (this.codeEditor) {
			this.codeEditor.toTextArea();
			this.codeEditor = null;
		}
	},
	initComponent: function() {
		if (this.codeMirrorPath === null) {
			throw 'Ext.ux.form.CodeMirror: codeMirrorPath required';
		}
		this.codeEditor = null;
		this.initialized = true;
		this.initialWidth = 0;
		this.initialHeight = 0;
		if (this.hideLabel) {
			this.separator = '';
		}
		Ext.ux.form.CodeMirror.superclass.initComponent.apply(this, arguments);
		this.addEvents('initialize');
		this.on({
			resize: function(ta, width, height) {
//				console.log('resize');
//				console.log(width + ' ' + height);
				var el = this.el;
//				var w = this.ownerCt.getWidth();
//				var h = this.ownerCt.getHeight();
//				Ext.fly(this.codeEditor.getWrapperElement()).setSize(w, h);
				width = width || this.lastWidth;
				height = height || this.lastHeight;
				this.lastWidth = width;
				this.lastHeight = height;
				Ext.fly(this.codeEditor.getScrollerElement()).setSize(width, height);
				this.codeEditor.refresh();
				return;
				console.log(width + ' ' + height);
				width = width || this.lastWidth;
				height = height || this.lastHeight;
				this.lastWidth = width;
				this.lastHeight = height;
				if (this.codeEditor) {
					Ext.fly(this.codeEditor.getWrapperElement()).setSize(width, height);
					Ext.fly(this.codeEditor.getScrollerElement()).setSize(this.lastWidth, this.lastHeight);
					this.codeEditor.refresh();
					if (this.hlLine) {
						this.hlLine = this.codeEditor.setLineClass(this.codeEditor.getCursor().line, "CodeMirror-current-line");
					}
				}
				return true;
			},
			afterrender: function() {
				this.el.dom.focus();    // fix Chrome 15 double click selects all bug.
				this.fromTextArea();
				this.codeEditor.setValue(this.initialConfig.value);
			}
		});
	},
	getValue: function() {
		return this.codeEditor ? this.codeEditor.getValue() : this.value;
	},
	setValue: function(v) {
		if (this.codeEditor) {
			this.codeEditor.setValue(v);
			this.codeEditor.refresh();
		}
		this.value = v;
	},
    clearHistory: function() {
        this.codeEditor && this.codeEditor.clearHistory();
    },
	setOption: function(option, value) {
		this.codeEditor && this.codeEditor.setOption(option, value);
	},
	validate: function() {
		this.getValue();
		Ext.ux.form.CodeMirror.superclass.validate.apply(this, arguments);
	},
	refresh: function() {
		this.codeEditor && this.codeEditor.refresh();
	}
});
Ext.reg('ux-codemirror', Ext.ux.form.CodeMirror);
