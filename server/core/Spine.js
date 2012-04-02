/**
 * @fileoverview
 *
 * <p>Core class to handle Spine+Node+NodeData+ModuleBase records.</p>
 *
 * <p>This is one of the major core classes in the server side API.  Many of the public web service methods
 * and many of the Manager methods will call the methods in this class to perform operations on the database.</p>
 */

// the following comment is to indicate to JSLint that these global variables exist
// note the /*global has no space after the *
/*global global: true, res: true, req: true, app: true, session: true */
/*global Schema: true, Util: true */

"use strict";

/**
 * @namespace
 */
var Spine = function() {
	"use strict";

	/** @scope Spine */
	return {
		/**
		 * <p>Create a Spine table record, effectively associating one Node with another.</p>
		 *
		 * @param {object} o Spine example
		 * @returns {object} full Spine record that was stored
		 */
		link: function(o) {
			return Schema.putOne('Spine', Schema.newRecord('Spine', o));
		},

		/**
		 * <p>Remove one or more Spine table records matching the given example.</p>
		 *
		 * @param {object} o Spine example
		 * @returns {void} nothing
		 */
		unlink: function(o) {
			return Schema.remove('Spine', o);
		},

		/**
		 * <p>Count the number of Spine table records matching the given example.</p>
		 *
		 * <p>The might be used, say, to count the number of times a template is associated with pages.</p>
		 *
		 * @param {object} o Spine example
		 * @returns {int} number of Spine table records matching the example
		 */
		linkCount: function(o) {
			return SQL.getScalar('SELECT COUNT(*) FROM Spine WHERE ' + Schema.where('Spine', o).join(' AND '));
		},

		/**
		 * <p>Return a new record with default values for fields not specified in the given example.</p>
		 *
		 * <p>The returned record may be modified and stored to the database, typically as a new record,
		 * using the putOne method.</p>
		 *
		 * @param {object} o Example record with field values to override the defaults
		 * @returns {object} new record
		 */
		newRecord: function(o) {
			o = Schema.newRecord('Spine', o);
			o = Schema.newRecord('Nodes', o);
			o = Schema.newRecord(o.type, o);
			return o;
		},

		/**
		 * <p>Store a record or partial record to the database.</p>
		 *
		 * <p>If the record is a new one, the record stored to the database will have default values for
		 * any fields not specified in the given record.</p>
		 *
		 * <p>If the record is an existing one, the existing record is read from the database and the
		 * given record's fields replace the ones in the existing record.</p>
		 *
		 * <p>If the version parameter is true, the record is versioned in the database by incrementingits version field.</p>
		 *
		 * <p>NOTE It is almost certain that SQL.startTransaction() is called before this function, and
		 * this function called within a try/catch block.</p>
		 *
		 * @param {object} o record to store
		 * @param {boolean} version if true, store a new version of the record
		 * @returns {object} record that was stored, including any fields set to defaults or existing values and accurate nodeId
		 */
		putOne: function(o, version) {
			o = o.nodeId ? Util.apply(Spine.findOne({ nodeId: o.nodeId }), o) : Spine.newRecord(o);

			// this has to be done here because of the above line that finds the existing record in the
			// database.  findOne() needs to see the existing version!
			if (version) {
				if (o.nodeId) {
					o.version = SQL.getScalar('SELECT MAX(version) FROM ' + o.type + ' WHERE nodeId='+SQL.quote(o.nodeId));
				}
				o.version++;
			}

			// update editor information
			o.editor = req.userId;
			o.edited = Util.currentTime();
			o.editorIp = global.req ? req.remote_addr : '127.0.0.1';

			o = Schema.putOne('Nodes', o);		// must be done first to assure nodeId is set!
			o = Schema.putOne(o.type, o);
			// We have to assure the record returned has any JSON strings converted back to JavaScript
			// objects, in case the caller further manipulates the record.
			return Schema.putOne('Spine', o);
		},

		/**
		 * <p>Return a single record from the DB consisting of Spine+Node+NodeData and optionally ModuleBase.</P.
		 *
		 * <p>Be careful not to expect even an empty record to be returned if there is no matching record in the
		 * database!  Because this function returns false if no record found, it is trivial to do things like:</p>
		 * <code>var record = Spine.findOne({ ... status: STATUS_LIVE }) || Spine.findOne({ ... status: STATUS_DRAFT });</code>
		 *
		 * @param {object} example partial record to match in the database
		 * @returns {object} record or false if not found
		 */
		findOne: function(example) {
			var where = Schema.where('Spine', example).concat(Schema.where('Nodes', example)).concat(Schema.where(example.type, example));
			var row = SQL.getDataRow([
				'SELECT',
				'	*',
				'FROM',
				'	Spine,Nodes,' + example.type,
				'WHERE',
				'	Spine.nodeId=Nodes.nodeId',
				'	AND ' + where.join(' AND\n')
			]);
			if (!row.nodeId) {
				return false;
			}
			Schema.onLoad('Spine', row);
			Schema.onLoad('Nodes', row);
			Schema.onLoad(row.type, row);
			return row;
		},

		/**
		 * <p>Return all records from the database that match the given example.</p>
		 *
		 * @param {object} example example record to use as search parameters
		 * @returns {object} array of records
		 */
		find: function(example) {
			var where = Schema.where('Spine', example).concat(Schema.where('Nodes', example)).concat(Schema.where(example.type, example));
			var rows = SQL.getDataRows([
				'SELECT',
				'	*',
				'FROM',
				'	Spine,Nodes,' + example.type,
				'WHERE',
				'	Spine.nodeId=Nodes.nodeId',
				'	AND ' + where.join(' AND\n')
			]);
			Schema.onLoad('Spine', rows);
			Schema.onLoad('Nodes', rows);
			Schema.onLoad(rows[0].type, rows);
			return rows;
		},

		/**
		 * <p>Physically remove all records from the database that match the given example.</p>
		 *
		 * @param {object} example
		 * @returns {int} number of rows removed
		 */
		remove: function(example) {
			// record may not have a ModuleBase table, so ignore any error
			Schema.remove(example.type, example);
			Schema.remove('Nodes', example);
			return Schema.remove('Spine', example);
		},

		/**
		 * <p>Count the number of records in the database that match the given example.</p>
		 *
		 * @param {object} example partial record to match in the database
		 * @returns {int} count of matching records
		 */
		count: function(example) {
			var where = Schema.where('Spine', example).concat(Schema.where('Nodes', example)).concat(Schema.where(example.type, example));
			return SQL.getScalar([
				'SELECT',
				'	COUNT(*)',
				'FROM',
				'	Spine,Nodes,' + example.type,
				'WHERE',
				'	Spine.nodeId=Nodes.nodeId',
				'	AND ' + where.join(' AND\n')
			]);
		},

		/**
		 * <p>Get a list for ExtJS grid</p>
		 *
		 * <p>Note: if fn is provided, it will be called for each record in the returned list with
		 * the record as the only argument.</p>
		 *
		 * @param {object} example
		 * @param {function} fn optional function called to add information to each record
		 * @returns {object} object suitable for sending as JSON for ExtJS DataStores.
		 */
		list: function(example, fn) {
			var startRow = req.data.start || 0;
			var maxRows = req.data.limit || 25;
			var sort = req.data.sort || 'nodeId';
			var dir = req.data.dir || 'ASC';
			if (sort == 'nodeId') {
				sort = 'Spine.nodeId';
			}

			var where = Schema.where('Spine', example).concat(Schema.where('Nodes', example)).concat(Schema.where(example.type, example));
			var or = [], and = [];
			forEach(where, function(part) {
				if (part.indexOf(' LIKE ') !== -1) {
					or.push(part);
				}
				else {
					and.push(part);
				}
			});
			where = and;
			if (or.length > 1) {
				where.push('(' + or.join(' OR ') + ')');
			}
			else {
				where = where.concat(or);
			}
			var items = SQL.getDataRows([
				'SELECT',
				'	*',
				'FROM',
				'	Spine,Nodes,' + example.type,
				'WHERE',
				'	Spine.nodeId=Nodes.nodeId',
				'	AND ' + where.join(' AND\n'),
				'ORDER BY',
				'	' + sort + ' ' + dir + ',',
				'LIMIT',
				'	' + startRow + ',' + maxRows
			]);
			var count = SQL.getScalar([
				'SELECT',
				'	COUNT(*)',
				'FROM',
				'	Spine,Nodes,' + example.type,
				'WHERE',
				'	Spine.nodeId=Nodes.nodeId',
				'	AND ' + where.join(' AND\n')
			]);

			forEach(items, function(item) {
				fn && fn(item);
			});
			return {
				count: count,
				list: items
			};
		},

		/**
		 * <p>Return a tree of records, starting with the given example.</p>
		 *
		 * <p>Each node in the tree will have an array of children nodes.</p>
		 *
		 * @param {object} example partial record to match for first level of tree nodes
		 * @param {boolean} extended include ModuleBase table fields if true
		 * @returns {object} tree structure
		 */
		tree: function(example, extended) {
			function recurse(nodes) {
				forEach(nodes, function(node) {
					node.children = Spine.find({
						parentId: node.nodeId,
						type: example.type
					}, extended);
					recurse(node.children);
				});
				return nodes;
			}

			return recurse(Spine.find(example, extended));
		}
	};

}();

if (exports) {
    exports = Spine;
}
