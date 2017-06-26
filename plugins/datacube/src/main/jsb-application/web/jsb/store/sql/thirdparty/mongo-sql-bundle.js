(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MongoSQL = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Actions
 */

// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     action [, ... ]
// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     RENAME [ COLUMN ] column_name TO new_column_name
// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     RENAME CONSTRAINT constraint_name TO new_constraint_name
// ALTER TABLE [ IF EXISTS ] name
//     RENAME TO new_name
// ALTER TABLE [ IF EXISTS ] name
//     SET SCHEMA new_schema

// where action is one of:

//     ADD [ COLUMN ] column_name data_type [ COLLATE collation ] [ column_constraint [ ... ] ]
//     DROP [ COLUMN ] [ IF EXISTS ] column_name [ RESTRICT | CASCADE ]
//     ALTER [ COLUMN ] column_name [ SET DATA ] TYPE data_type [ COLLATE collation ] [ USING expression ]
//     ALTER [ COLUMN ] column_name SET DEFAULT expression
//     ALTER [ COLUMN ] column_name DROP DEFAULT
//     ALTER [ COLUMN ] column_name { SET | DROP } NOT NULL
//     ALTER [ COLUMN ] column_name SET STATISTICS integer
//     ALTER [ COLUMN ] column_name SET ( attribute_option = value [, ... ] )
//     ALTER [ COLUMN ] column_name RESET ( attribute_option [, ... ] )
//     ALTER [ COLUMN ] column_name SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN }
//     ADD table_constraint [ NOT VALID ]
//     ADD table_constraint_using_index
//     VALIDATE CONSTRAINT constraint_name
//     DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]
//     DISABLE TRIGGER [ trigger_name | ALL | USER ]
//     ENABLE TRIGGER [ trigger_name | ALL | USER ]
//     ENABLE REPLICA TRIGGER trigger_name
//     ENABLE ALWAYS TRIGGER trigger_name
//     DISABLE RULE rewrite_rule_name
//     ENABLE RULE rewrite_rule_name
//     ENABLE REPLICA RULE rewrite_rule_name
//     ENABLE ALWAYS RULE rewrite_rule_name
//     CLUSTER ON index_name
//     SET WITHOUT CLUSTER
//     SET WITH OIDS
//     SET WITHOUT OIDS
//     SET ( storage_parameter = value [, ... ] )
//     RESET ( storage_parameter [, ... ] )
//     INHERIT parent_table
//     NO INHERIT parent_table
//     OF type_name
//     NOT OF
//     OWNER TO new_owner
//     SET TABLESPACE new_tablespace

// and table_constraint_using_index is:

//     [ CONSTRAINT constraint_name ]
//     { UNIQUE | PRIMARY KEY } USING INDEX index_name
//     [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]

var actions = require('../lib/action-helpers');
var queryHelpers = require('../lib/query-helpers');
var utils = require('../lib/utils');

actions.add('renameTable', function(value, values, query){
  return 'rename to "' + value + '"';
});

actions.add('rename', function(value, values, query){
  return actions.get('renameTable').fn(value, values, query);
});

actions.add('renameConstraint', function(value, values, query){
  return (
    "rename constraint " +
    utils.quoteObject(value.from) +
    " to " +
    utils.quoteObject(value.to)
  );
});

actions.add('renameColumn', function(value, values, query){
  return (
    "rename column " +
    utils.quoteObject(value.from) +
    " to " +
    utils.quoteObject(value.to)
  );
});

actions.add('setSchema', function(value, values, query){
  return 'set schema "' + value + '"';
});

actions.add('addColumn', function(value, values, query){
  var output = ["add column"];

  output.push( utils.quoteObject(value.name) );
  output.push( value.type );

  output.push( queryHelpers.get('columnConstraint').fn(value, values, query) );

  return output.join(' ');
});

actions.add('dropColumn', function(value, values, query){
  if ( Array.isArray(value) ){
    return value.map( function( v ){
      return actions.get('dropColumn').fn( v, values, query );
    }).join(', ');
  }

  var output = ["drop column"];

  if (value.ifExists)
    output.push( 'if exists' );

  output.push( utils.quoteObject(value.name) );

  if (value.restrict)
    output.push( 'restrict' );

  else if (value.cascade)
    output.push( 'cascade' );

  return output.join(' ');
});

actions.add('alterColumn', function(value, values, query){
  if ( Array.isArray(value) ){
    return value.map( function( v ){
      return actions.get('alterColumn').fn( v, values, query );
    }).join(', ');
  }

  var output = ["alter column"];

  output.push( utils.quoteObject(value.name) );

  if (value.type)
    output.push( 'type ' + value.type );

  if (value.collation)
    output.push( 'collate ' + value.collation );

  if (value.using)
    output.push( 'using (' + value.using + ')' );

  if (value.default)
    output.push( 'set default ' + value.default );

  if (value.dropDefault)
    output.push( 'drop default' );

  if (value.notNull === true)
    output.push( 'set not null' );

  if (value.notNull === false)
    output.push( 'drop not null' );

  if (value.statistics)
    output.push( 'set statistics $' + values.push(value.statistics) );

  if (value.storage)
    output.push( 'set storage ' + value.storage );

  return output.join(' ');
});

actions.add( 'dropConstraint', function( value, values, query ){
  if ( !value ) return;

  var out = ['drop constraint'];

  if ( typeof value === 'object' ){
    if ( value.ifExists ) out.push('if exists');
    if ( value.name )     out.push('"' + value.name + '"');
    if ( value.cascade )  out.push('cascade');
    if ( value.restrict ) out.push('restrict');
  } else if ( typeof value === 'string' ){
    out.push('"' + value + '"');
  } else return;

  return out.join(' ');
});

actions.add( 'addConstraint', function( constraint, values, query ){
  return [
    'add constraint'
  , utils.quoteObject( constraint.name )
  , queryHelpers.get('columnConstraint').fn( constraint, values, query )
  ,
  ].join(' ');
});

// Single Parameter actions
[
  { name: 'enableReplicaTrigger', text: 'enable replica trigger' }
, { name: 'enableAlwaysTrigger',  text: 'enable always trigger' }
, { name: 'disableRule',          text: 'disable rule' }
, { name: 'enableRule',           text: 'enable rule' }
, { name: 'enableReplicaRule',    text: 'enable replica rule' }
, { name: 'enableAlwaysRule',     text: 'enable always rule' }
, { name: 'clusterOn',            text: 'cluster on' }
, { name: 'inherit',              text: 'inherit' }
, { name: 'noInherit',            text: 'no inherit' }
, { name: 'of',                   text: 'of' }
, { name: 'notOf',                text: 'not of' }
, { name: 'ownerTo',              text: 'owner to' }
, { name: 'setTableSpace',        text: 'set tablespace' }
].forEach(function(action){
  actions.add( action.name, function(value, values, query){
    return action.text + " " + utils.quoteObject(value);
  });
});

// Same text booleans
[
  { name: 'setWithoutCluster',  text: 'set without cluster' }
, { name: 'setWithOids',        text: 'set with oids' }
, { name: 'setWithoutOids',     text: 'set without oids' }
].forEach(function(action){
  actions.add( action.name, function(value, values, query){
    return value ? action.text : '';
  });
});

},{"../lib/action-helpers":41,"../lib/query-helpers":48,"../lib/utils":51}],2:[function(require,module,exports){

var utils = require('../lib/utils');
var defs = require('../lib/column-def-helpers');
var conditional = require('../lib/condition-builder');

defs.add('type', function(type, values, query){
  return type;
});

defs.add('primaryKey', function(primaryKey, values, query){
  if ( !primaryKey ) return '';

  var out = 'primary key';

  if ( typeof primaryKey === 'string' ){
    out += ' ("' + primaryKey + '")';
  } else if ( Array.isArray( primaryKey ) ){
    out += ' ("' + primaryKey.join('", "') + '")';
  }

  return out;
});

defs.add('references', function(reference, values, query){
  var output = "references ";
  if (typeof reference == 'string')
    return output + '"' + reference + '"';

  output += '"' + reference.table + '"';

  if (reference.column)
    output += '("' + reference.column + '")';

  if (reference.onDelete)
    output += ' on delete ' + reference.onDelete;

  if (reference.onUpdate)
    output += ' on update ' + reference.onUpdate;

  if (reference.match)
    output += ' match ' + reference.match;

  return output;
});

defs.add('notNull', function(notNull, values, query){
  return notNull ? 'not null' : 'null';
});

defs.add('null', function($null, values, query){
  if ($null === true) return 'null';
  if ($null === false) return 'not null';
  return '';
});

defs.add('unique', function(unique, values, query){
  if (unique === true) return 'unique';

  if ( typeof unique === 'string' ) return 'unique ("' + unique + '")';

  if (Array.isArray(unique))
    return 'unique (' + unique.map(function(column){
      return utils.quoteObject(column);
    }).join(', ') + ')';

  return '';
});

defs.add('default', function(def, values, query){
  return def !== undefined ? ('default ' + def) : '';
});

defs.add('check', function(check, values, query){
  return 'check (' + conditional(check, query.__defaultTable, values) + ')';
});

defs.add('noInherit', function(noInherit, values, query){
  if (noInherit) return 'no inherit';
  return '';
});

},{"../lib/column-def-helpers":42,"../lib/condition-builder":43,"../lib/utils":51}],3:[function(require,module,exports){

/**
 * Conditionals
 * TODO: update comments :/
 */

var conditionals = require('../lib/conditional-helpers');
var queryBuilder = require('../lib/query-builder');

var valuesThatUseIsOrIsNot = [
  'true', 'false', true, false, null
]

function getValueEqualityOperator(value) {
  return valuesThatUseIsOrIsNot.indexOf(value) > -1 ? 'is' : '='
}

function getValueInequalityOperator(value) {
  return valuesThatUseIsOrIsNot.indexOf(value) > -1 ? 'is not' : '!='
}

/**
 * Querying where column is equal to a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be equal to
 */
conditionals.add('$equals', function(column, value, values, collection, original){
  var equator = '=';

  return column + ' ' + getValueEqualityOperator(value) + ' ' + value;
});

/**
 * Querying where column is not equal to a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be equal to
 */
conditionals.add('$ne', function(column, value, values, collection, original){
  console.log('CALLING $ne', column, value)
  return column + ' ' + getValueInequalityOperator(value) + ' ' + value;
});

/**
 * Querying where column is greater than a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be greater than
 */
conditionals.add('$gt', function(column, value, values, collection, original){
  return column + ' > ' + value;
});

/**
 * Querying where column is greater than a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be greater than
 */
conditionals.add('$gte', function(column, value, values, collection, original){
  return column + ' >= ' + value;
});

/**
 * Querying where column is less than a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be less than
 */
conditionals.add('$lt', function(column, value, values, collection, original){
  return column + ' < ' + value;
});

/**
 * Querying where column is less than or equal to a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be lte to
 */
conditionals.add('$lte', function(column, value, values, collection, original){
  return column + ' <= ' + value;
});

/**
 * Querying where value is null
 * @param column {String}  - Column name either table.column or column
 */
conditionals.add('$null', function(column, value, values, collection, original){
  return column + ' is' + (original === false ? ' not' : '') + ' null';
});

/**
 * Querying where value is null
 * @param column {String}  - Column name either table.column or column
 */
conditionals.add('$notNull', function(column, value, values, collection, original){
  return column + ' is' + (original === false ? '' : ' not') + ' null';
});

/**
 * Querying where column is like a value
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be like
 */
conditionals.add('$like', function(column, value, values, collection, original){
  return column + ' like ' + value;
});

/**
 * Querying where column is like a value (case insensitive)
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - What the column should be like
 */
conditionals.add('$ilike', function(column, value, values, collection, original){
  return column + ' ilike ' + value;
});

/**
 * Querying where column is in a set
 *
 * Values
 * - String, no explaination necessary
 * - Array, joins escaped values with a comma
 * - Function, executes function, expects string in correct format
 *  |- Useful for sub-queries
 *
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - String|Array|Function
 */
conditionals.add('$in', { cascade: false }, function(column, set, values, collection, original){
  if (Array.isArray(set)) {
    return column + ' in (' + set.map( function(val){
      return '$' + values.push( val );
    }).join(', ') + ')';
  }

  return column + ' in (' + queryBuilder(set, values).toString() + ')';
});

/**
 * Querying where column is not in a set
 *
 * Values
 * - String, no explaination necessary
 * - Array, joins escaped values with a comma
 * - Function, executes function, expects string in correct format
 *  |- Useful for sub-queries
 *
 * @param column {String}  - Column name either table.column or column
 * @param value  {Mixed}   - String|Array|Function
 */
conditionals.add('$nin', { cascade: false }, function(column, set, values, collection, original){
  if (Array.isArray(set)) {
    return column + ' not in (' + set.map( function(val){
      return '$' + values.push( val );
    }).join(', ') + ')';
  }

  return column + ' not in (' + queryBuilder(set, values).toString() + ')';
});

conditionals.add('$custom', { cascade: false }, function(column, value, values, collection, original){
  if (Array.isArray(value))
    return conditionals.get('$custom_array').fn( column, value, values, collection );

  if (typeof value == 'object')
    return conditionals.get('$custom_object').fn( column, value, values, collection );

  throw new Error('Invalid Custom Value Input');
});

conditionals.add('$custom_array', { cascade: false }, function(column, value, values, collection, original){
  var output = value[0];
  var localToGlobalValuesIndices = {}

  return output.replace(/\$\d+/g, function(match) {
    var i = match.slice(1);

    var globalI = i in localToGlobalValuesIndices
      ? localToGlobalValuesIndices[i]
      : values.push(value[i]);

    localToGlobalValuesIndices[i] = globalI;

    return '$' + globalI;
  });
});

conditionals.add('$custom_object', { cascade: false }, function(column, value, values, collection, original){
  return conditionals.get('$custom_array').fn(column, [value.value].concat(value.values), values, collection);
});

conditionals.add('$years_ago', function(column, value, values, collection, original){
  return column + " >= now() - interval " + value + " year";
});

conditionals.add('$months_ago', function(column, value, values, collection, original){
  return column + " >= now() - interval " + value + " month";
});

conditionals.add('$days_ago', function(column, value, values, collection, original){
  return column + " >= now() - interval " + value + " day";
});

conditionals.add('$hours_ago', function(column, value, values, collection, original){
  return column + " >= now() - interval " + value + " hour";
});

conditionals.add('$minutes_ago', function(column, value, values, collection, original){
  return column + " >= now() - interval " + value + " minute";
});

conditionals.add('$seconds_ago', function(column, value, values, collection, original){
  return column + " >= now() - interval " + value + " second";
});

},{"../lib/conditional-helpers":44,"../lib/query-builder":47}],4:[function(require,module,exports){

var queryTypes = require('../lib/query-types');

queryTypes.add( 'select', [
  '{with} select {expression} {distinct}'
, '{columns} {over} {table} {alias}'
, '{joins} {join} {innerJoin} {leftJoin} {leftOuterJoin} {fullOuterJoin} {crossOuterJoin}'
, '{where} {groupBy} {having} {window} {order} {limit} {offset} {for}'
].join(' '));

queryTypes.add(
  'insert'
, '{with} insert into {table} {columns} {values} {expression} {conflict} {returning}'
);

queryTypes.add(
  'update'
, '{with} update {table} {values} {updates} {from} {where} {returning}'
);

queryTypes.add(
  'delete'
, '{with} delete from {table} {where} {returning}'
);

queryTypes.add(
  'remove'
, '{with} delete from {table} {alias} {where} {returning}'
);

queryTypes.add(
  'create-table'
, '{with} create table {ifNotExists} {table} ({definition})'
);

queryTypes.add(
  'drop-table'
, '{with} drop table {ifExists} {table} {cascade}'
);

queryTypes.add(
  'alter-table'
, 'alter table {ifExists} {only} {table} {action}'
);

queryTypes.add(
  'create-view'
, 'create {orReplace} {temporary} view {view} {columns} as {expression}'
);

queryTypes.add(
  'union'
, '{with} {queries}'
);

queryTypes.add(
  'intersect'
, '{with} {queries}'
);

queryTypes.add(
  'except'
, '{with} {queries}'
);

queryTypes.add('function', '{function}( {expression} )');
queryTypes.add('expression', '{expression}');

},{"../lib/query-types":49}],5:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var actionsHelpers = require('../../lib/action-helpers');
var utils = require('../../lib/utils');

helpers.register('action', function(actions, values, query){

  if ( !Array.isArray(actions) ) actions = [actions];

  return actions.map( function( action ){
    var output = "";

    for (var key in action){
      if (actionsHelpers.has(key)){
        output += actionsHelpers.get(key).fn(action[key], values, query);
      }
    }

    return output;
  }).join(', ');


});

},{"../../lib/action-helpers":41,"../../lib/query-helpers":48,"../../lib/utils":51}],6:[function(require,module,exports){
/**
 * Query Type: Alias
 *
 * NOTE: This reuqired some special behavior inside of the
 *       main query-builder. If you're aliasing an expression
 *       then the alias should become the __defaultTable on
 *       the current query.
 */

var helpers = require('../../lib/query-helpers');
var actions = require('../../lib/action-helpers');
var utils = require('../../lib/utils');

helpers.register('alias', function(alias, values, query){
  query.__defaultTable = query.alias;
  return '"' + alias + '"';
});

},{"../../lib/action-helpers":41,"../../lib/query-helpers":48,"../../lib/utils":51}],7:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var bools = {
  orReplace:  'or replace'
, temporary:  'temporary'
, all:        'all'
};

Object.keys( bools ).forEach( function( key ){
  helpers.register( key, function( bool, values ){
    return bool ? bools[ key ] : '';
  });
});

},{"../../lib/query-helpers":48}],8:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('cascade', function(cascade, values, query){
  return cascade ? 'cascade' : null;
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],9:[function(require,module,exports){
// [ CONSTRAINT constraint_name ]
// { NOT NULL |
//   NULL |
//   CHECK ( expression ) [ NO INHERIT ] |
//   DEFAULT default_expr |
//   UNIQUE index_parameters |
//   PRIMARY KEY index_parameters |
//   REFERENCES reftable [ ( refcolumn ) ] [ MATCH FULL | MATCH PARTIAL | MATCH SIMPLE ]
//     [ ON DELETE action ] [ ON UPDATE action ] }
// [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]

var helpers     = require('../../lib/query-helpers');
var conditional = require('../../lib/condition-builder');
var columnDefs  = require('../../lib/column-def-helpers');
var utils       = require('../../lib/utils');

helpers.register('columnConstraint', function(constraint, values, query){
  var output = [];

  // Null/Not Null
  if (constraint.null)
    output.push( columnDefs.get('null').fn(constraint.null, values, query) );
  if (constraint.notNull)
    output.push( columnDefs.get('notNull').fn(constraint.notNull, values, query) );

  // Check
  if (constraint.check)
    output.push( columnDefs.get('check').fn(constraint.check, values, query) );

  // No Inherit
  if (constraint.noInherit)
    output.push( columnDefs.get('noInherit', true, values, query) );

  // Default expression
  if ('default' in constraint)
    output.push( columnDefs.get('default').fn(constraint.default, values, query) );

  // Unique
  if (constraint.unique)
    output.push( columnDefs.get('unique').fn(constraint.unique, values, query) );

  // Primary key
  if (constraint.primaryKey)
    output.push( columnDefs.get('primaryKey').fn(constraint.primaryKey, values, query) );

  // Reference
  if (constraint.references)
    output.push( columnDefs.get('references').fn(constraint.references, values, query) );

  // Foreign Key
  if (constraint.foreignKey){
    output.push(
      'foreign key (' + utils.quoteObject( constraint.foreignKey.column ) + ')'
    );

    output.push(
      columnDefs.get('references').fn(
        constraint.foreignKey.references, values, query
      )
    );
  }

  // Single word booleans
  [
    { name: 'deferrable',         text: 'deferrable' }
  , { name: 'notDeferrable',      text: 'not deferrable' }
  , { name: 'initiallyDeferred',  text: 'initially deferred' }
  , { name: 'initiallyImmediate', text: 'initially immediate' }
  ].forEach(function(item){
    if (constraint[item.name])
      output.push( item.text );
  });

  return output.join(' ');
});

},{"../../lib/column-def-helpers":42,"../../lib/condition-builder":43,"../../lib/query-helpers":48,"../../lib/utils":51}],10:[function(require,module,exports){

var queryBuilder  = require('../../lib/query-builder');
var helpers       = require('../../lib/query-helpers');
var utils         = require('../../lib/utils');

helpers.register('columns', function(columns, values, query){
  if (typeof columns != 'object') throw new Error('Invalid columns input in query properties');

  if (['insert', 'create-view'].indexOf(query.type) > -1){
    return '(' + columns.map(function(col){
      return utils.quoteObject( col );
    }).join(', ') + ')';
  }

  var output = "";

  if (Array.isArray(columns)){
    for (var i = 0, l = columns.length; i < l; ++i){
      if (typeof columns[i] == 'object' && 'type' in columns[i] && !('expression' in columns[i]))
        output += '(' + queryBuilder( columns[i], values ).toString() + ')';
      else if (typeof columns[i] == 'object' && 'expression' in columns[i])
        output += queryBuilder( columns[i], values ).toString();
      else if (typeof columns[i] == 'object')
        output += utils.quoteObject(columns[i].name, columns[i].table || query.__defaultTable);
      else if (columns[i].indexOf('(') > -1)
        output += columns[i];
      else
        output += utils.quoteObject(columns[i], query.__defaultTable);

      if ( typeof columns[i] == 'object' && ('as' in columns[i] || 'alias' in columns[i]))
        output += ' as "' + (columns[i].as || columns[i].alias) + '"';

      output += ", ";
    }
  } else {
    for (var key in columns){
      if (key.indexOf('(') > -1)
        output += key + ', ';
      else
        output += (
          typeof columns[key] == 'object' && ('table' in columns[key])
        ) ? '(' + queryBuilder( columns[key], values ).toString() + ') as "' + key + '", '
          : typeof columns[key] == 'object' && ('type' in columns[key]) ?
            queryBuilder( columns[key], values ).toString() + ' as "' + key + '", ' :
            utils.quoteObject(key, query.__defaultTable) + ' as "' + columns[key] + '", ';
    }
  }

  if (output.length > 0) output = output.substring(0, output.length - 2);

  return output;
});

},{"../../lib/query-builder":47,"../../lib/query-helpers":48,"../../lib/utils":51}],11:[function(require,module,exports){
// [ WITH [ RECURSIVE ] with_query [, ...] ]
// INSERT INTO table_name [ AS alias ] [ ( column_name [, ...] ) ]
//     { DEFAULT VALUES | VALUES ( { expression | DEFAULT } [, ...] ) [, ...] | query }
//     [ ON CONFLICT [ conflict_target ] conflict_action ]
//     [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]

// where conflict_target can be one of:

//     ( { index_column_name | ( index_expression ) } [ COLLATE collation ] [ opclass ] [, ...] ) [ WHERE index_predicate ]
//     ON CONSTRAINT constraint_name

// and conflict_action is one of:

//     DO NOTHING
//     DO UPDATE SET { column_name = { expression | DEFAULT } |
//                     ( column_name [, ...] ) = ( { expression | DEFAULT } [, ...] ) |
//                     ( column_name [, ...] ) = ( sub-SELECT )
//                   } [, ...]
//               [ WHERE condition ]

var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register( 'conflict', function( conflict, values, query ){
  var result = 'on conflict';

  // Handle target specification
  if ( conflict.target ){
    // Users can just pass in a big ol' target string
    if ( typeof conflict.target === 'string' ){
      result += '(' + conflict.target + ') ';
    // Or get more specific
    } else {
      if ( conflict.target.column ){
        console.log('conflict.target.column is deprecated. Use an array of columns on conflict.target.columns instead');
        conflict.target.columns = [ conflict.target.column ];
      }

      // Handle (index_column_name | (index_expression))
      if ( Array.isArray( conflict.target.columns ) ){
        var columnExpression = '(' + conflict.target.columns.map(function( column ){
          return utils.quoteObject( column );
        }).join(', ');

        if ( conflict.target.expression ){
          columnExpression += '(' + conflict.target.expression + ') ';
        }

        // Collation
        if ( conflict.target.collation ){
          columnExpression += ' collate ' + conflict.target.collation;
        }

        // Opclasses either string or array of strings
        if ( conflict.target.opclass ){
          if ( Array.isArray( conflict.target.opclass ) ){
            columnExpression += ' ' + conflict.target.opclass.join(', ');
          } else {
            columnExpression += ' ' + conflict.target.opclass;
          }
        }

        columnExpression += ')';

        result += ' ' + columnExpression;
      }

      // Where condition doesn't need a table name
      if ( conflict.target.where ){
        result += ' ' + helpers.get('where').fn( conflict.target.where, values, query );
      }

      // Constraint
      if ( conflict.target.constraint ){
        result += ' on constraint ' + utils.quoteObject( conflict.target.constraint );
      }
    }
  }

  if ( conflict.action ){
    result += ' do ';

    if ( typeof conflict.action === 'string' ){
      result += conflict.action;
    } else if ( conflict.action.update ){
      result += 'update ';
      result += helpers.get('updates').fn( conflict.action.update, values, query );

      if ( conflict.action.where ){
        result += ' ' + helpers.get('where').fn( conflict.action.where, values, query );
      }
    }
  }

  return result;
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],12:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var defs    = require('../../lib/column-def-helpers');
var utils   = require('../../lib/utils');

helpers.register('definition', function(definition, values, query){
  if (typeof definition == 'string') return definition;

  var output = "";

  for (var k in definition){
    output += utils.quoteObject(k);

    for (var j in definition[k])
      if (defs.has(j))
        output += ' ' + defs.get(j).fn(definition[k][j], values, query, j);

    output +=  ", ";
  }

  return output.substring(0, output.length - 2);
});

},{"../../lib/column-def-helpers":42,"../../lib/query-helpers":48,"../../lib/utils":51}],13:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('distinct', function(distinct, values, query){
  if (typeof distinct != 'boolean' && !Array.isArray(distinct))
    throw new Error('Invalid distinct type: ' + typeof distinct);

  // distinct on
  if (Array.isArray(distinct)) {
     if(distinct.length === 0) return '';

    return 'distinct on (' + distinct.map(function(col){
      return utils.quoteObject( col );
    }).join(', ') + ')';
  }

  // distinct
  return (distinct) ? 'distinct ': '';
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],14:[function(require,module,exports){
var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');

helpers.register('expression', function(exp, values, query){
  if (Array.isArray(exp)) {
    var expObj = { expression: exp[0], values: exp.slice(1) }
    return helpers.get('expression').fn(expObj, values, query)
  }

  if (query.type == 'insert' && typeof exp == 'object')
    return '(' + queryBuilder(exp, values) + ')';
  if (typeof exp == 'object'){
    var expValues = Array.isArray(exp.values) ? exp.values : []

    var val = [
      exp.parenthesis === true ? '( ' : ''
    , queryBuilder(exp, expValues)
    , exp.parenthesis === true ? ' )' : ''
    ].join('');

    var localToGlobalValuesIndices = {}

    return val.replace(/\$\d+/g, function(match) {
      var i = +match.slice(1);

      var globalI = i in localToGlobalValuesIndices
        ? localToGlobalValuesIndices[i]
        : values.push(expValues[i - 1]);

      localToGlobalValuesIndices[i] = globalI;

      return '$' + globalI;
    });
  }

  return exp
});

},{"../../lib/query-builder":47,"../../lib/query-helpers":48}],15:[function(require,module,exports){
var helpers = require('../../lib/query-helpers');
var lockStrengths = [ 'update', 'share', 'no key update', 'key share' ];
var quote = function(val) {
  return val.indexOf('"') < 0 ? ['"', val, '"'].join('') : val;
};

helpers.register('for', function($for, values, query){
  if (typeof $for !== 'object') throw new Error('Invalid for type: ' + typeof $for);
  if (!$for.type || typeof $for.type !== 'string') throw new Error('For helper requires type');

  // handle type
  $for.type = $for.type.toLowerCase();
  if ( lockStrengths.indexOf($for.type) < 0 )
    throw new Error('Invalid type for locking clause, got: ' + $for.type);

  // handle tables
  if ( $for.table ) {
    if ( !Array.isArray($for.table) ) $for.table = [$for.table];
    $for.table = 'of ' + $for.table.map(quote).join(', ');
  } else {
    $for.table = '';
  }

  // handle nowait
  $for.noWait = $for.noWait === true ? 'nowait' : '';

  return [
    'for'
  , $for.type
  , $for.table
  , $for.noWait
  ].join(' ');
});

},{"../../lib/query-helpers":48}],16:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');
var utils = require('../../lib/utils');

helpers.register('from', function(from, values, query){
  if ( typeof from === 'string' ){
    return 'from ' + utils.quoteObject( from );
  }

  if ( Array.isArray( from ) ){
    return 'from ' + from.map( function( table ){
      return utils.quoteObject( table );
    }).join(', ');
  }

  if ( typeof from === 'object' ){
    if ('alias' in query) {
      return 'from (' + queryBuilder( from, values ) + ') "' + query.alias +'"';
    } else {
      throw new Error('Alias needs to be specified for sub query');
    }
  }

  throw new Error('Invalid from type: ' + typeof from);
});

},{"../../lib/query-builder":47,"../../lib/query-helpers":48,"../../lib/utils":51}],17:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('function', function(fn, values, query){
  return fn;
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],18:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('groupBy', function(groupBy, values, query){
  if (!Array.isArray(groupBy) && typeof groupBy != 'string')
    throw new Error('Invalid groupBy type: ' + typeof groupBy);

  if (typeof groupBy === 'string' ) {
    groupBy = [groupBy]
  }

  return 'group by ' + helpers.get('columns').fn(groupBy, values, query)
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],19:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var conditionBuilder = require('../../lib/condition-builder');

helpers.register('having', function(having, values, query){
  var output = conditionBuilder(having, query.__defaultTable, values);
  if (output.length > 0) output = 'having ' + output;
  return output;
});

},{"../../lib/condition-builder":43,"../../lib/query-helpers":48}],20:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('ifExists', function(ifExists, values, query){
  return ifExists ? 'if exists' : null;
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],21:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('ifNotExists', function(ifNotExists, values, query){
  return ifNotExists ? 'if not exists' : null;
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],22:[function(require,module,exports){
/**
 * These query helpers are now deprecated!
 * Please use query helper: joins
 */


var helpers = require('../../lib/query-helpers');
var conditionBuilder = require('../../lib/condition-builder');

var buildJoin = function(type, joins, values){
  var output = "";
  for (var table in joins){
    output += ' ' + type + ' join "' + table + '" on ';
    output += conditionBuilder(joins[table], table, values);
  }
  return output;
};

helpers.register('join', function(join, values, query){
  return " " + buildJoin('', join, values);
});

helpers.register('innerJoin', function(join, values, query){
  return " " + buildJoin('inner', join, values);
});

helpers.register('leftJoin', function(join, values, query){
  return " " + buildJoin('left', join, values);
});

helpers.register('leftOuterJoin', function(join, values, query){
  return " " + buildJoin('left outer', join, values);
});

helpers.register('fullOuterJoin', function(join, values, query){
  return " " + buildJoin('full outer', join, values);
});

helpers.register('crossOuterJoin', function(join, values, query){
  return " " + buildJoin('cross outer', join, values);
});

},{"../../lib/condition-builder":43,"../../lib/query-helpers":48}],23:[function(require,module,exports){
/**
 * Query Helper: Joins
 */

var helpers = require('../../lib/query-helpers');
var conditionBuilder = require('../../lib/condition-builder');
var queryBuilder = require('../../lib/query-builder');
var utils = require('../../lib/utils');

var buildJoin = function(join, values, query){
  // Require a target
  if ( !join.target )
    throw new Error('Invalid join.target type `' + typeof join.target + '` for query helper `joins`');

  // Allow for strings or objects for join.on
  if ( !join.on || ( typeof join.on !== 'string' && typeof join.on !== 'object' ) )
    throw new Error('Invalid join.on type `' + typeof join.on + '` for query helper `joins`');

  var output = ( join.type ? ( join.type + ' ' ) : '' ) + "join ";

  if ( typeof join.target === 'object' ) output += '(' + queryBuilder( join.target, values ) + ') ';
  else {
    output += utils.quoteObject.apply( null, [
      join.target
    , join.schema
    , join.database
    ].filter( function( a ){ return !!a; }) ) + ' ';
  }

  if ( join.alias ) output += '"' + join.alias + '" ';

  if ( typeof join.on === 'string' ) output += 'on ' + join.on;
  else output += 'on ' + conditionBuilder( join.on, join.alias || join.target, values );

  return output;
};

helpers.register('joins', function(joins, values, query){
  if ( Array.isArray( joins ) ){
    return joins.map( function( join ){
      return buildJoin( join, values, query );
    }).join(' ');
  }

  if ( typeof joins === 'object' ) {
    return Object.keys( joins ).map(function( val ){
      // For objects, the key is the default alias and target
      if ( !joins[ val ].alias )  joins[ val ].alias = val;
      if ( !joins[ val ].target ) joins[ val ].target = val;

      return buildJoin( joins[ val ], values, query );
    }).join(' ');
  }

  throw new Error('Invalid type `' + typeof joins + '` for query helper `joins`');
});

},{"../../lib/condition-builder":43,"../../lib/query-builder":47,"../../lib/query-helpers":48,"../../lib/utils":51}],24:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');

helpers.register('limit', function(limit, values){
  if ( typeof limit === 'number' )
    return " limit $" + values.push(limit);
  else if ( typeof limit === 'string' && limit.toLowerCase() === "all" )
    return " limit all";
  else
    throw new Error('Invalid limit type `' + typeof limit  + '` for query helper `limit`. Limit must be number or \'all\'');
});

},{"../../lib/query-helpers":48}],25:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');

helpers.register('offset', function(offset, values){
  return " offset $" + values.push(offset);
});

},{"../../lib/query-helpers":48}],26:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('only', function(only, values, query){
  if (only) return "only";
  return "";
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],27:[function(require,module,exports){
var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('order', function(order, values, query){
  var output = "order by ";

  if (typeof order === 'string') return output + order;

  if (Array.isArray(order)) return output + order.join(', ');

  for (var key in order){
    output += utils.quoteObject(key, query.__defaultTable) + ' ' + order[key] + ', ';
  }

  if (output === "order by ") return "";

  return output.substring(0, output.length - 2);
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],28:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('over', function(over, values, query) {
  if (over === null) return '';

  var order = helpers.get('order').fn;
  var partition = helpers.get('partition').fn;
  var clause = (typeof over === 'object') ?
    [
      over.partition ? partition(over.partition, values, query) : ''
    , over.order ? order(over.order, values, query) : ''
    ].join(' ').trim()
  : (over||'').toString();
  return 'over (' + clause + ')';
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],29:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('partition', function(partition, values, query) {
  if (!Array.isArray(partition)) {
    var val = (partition||'').toString();
    partition = val ? [val] : [];
  }

  var clause = partition.map(function(col) {
    return utils.quoteObject(col, query.__defaultTable);
  }).join(', ');

  return clause ? 'partition by ' + clause : '';
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],30:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');

helpers.register( 'queries', function( queries, values, query ){
  var allowedCombinations = [ 'union', 'intersect', 'except' ];
  var joiner = query.joiner || ' ';

  if ( allowedCombinations.indexOf( query.type ) > -1 ){
    joiner = query.type;

    if ( query.all ){
      joiner += ' ' + helpers.get('all').fn( query.all, values, query );
    }

    joiner = ' ' + joiner + ' ';
  }

  return queries.map( function( q ){
    return queryBuilder( q, values );
  }).join( joiner );
});

},{"../../lib/query-builder":47,"../../lib/query-helpers":48}],31:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('returning', function(returning, values, query){
  if ( !Array.isArray(returning) ) throw new Error('Invalid returning input in query properties');
  var oldType = query.type;
  query.type = 'select';
  var output = "returning " + helpers.get('columns').fn(returning, values, query);
  query.type = oldType;
  return output;
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],32:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');
var utils = require('../../lib/utils');

helpers.register('table', function(table, values, query){

  if (typeof table != 'string' && typeof table != 'object') throw new Error('Invalid table type: ' + typeof table);

  if ( typeof table == 'object' && !Array.isArray(table)){
    if ('alias' in query) {
      return 'from (' + queryBuilder(table, values) + ')';
    } else {
      throw new Error("Sub query needs an alias")
    }
  }

  if (!Array.isArray(table)) table = [table];

  for (var i = 0, l = table.length; i < l; ++i)
    if (table[i].indexOf('"') == -1) table[i] = utils.quoteObject( table[i] );

  return (query.type === 'select' ? 'from ' : '') + table.join(', ');
});

},{"../../lib/query-builder":47,"../../lib/query-helpers":48,"../../lib/utils":51}],33:[function(require,module,exports){
var queryTypes = require('../../lib/query-helpers');
var updateHelpers = require('../../lib/update-helpers');
var utils = require('../../lib/utils');
var queryBuilder = require('../../lib/query-builder');

queryTypes.register('updates', function($updates, values, query){
  var output = "set ";

  var result = Object.keys( $updates ).map( function( key ){
    if (updateHelpers.has(key)){
      return updateHelpers.get(key).fn($updates[key], values, query.__defaultTable);
    }

    if ($updates[key] === null){
      return utils.quoteObject(key) + ' = null';
    }

    if (typeof $updates[ key ] == 'object' && 'type' in $updates[ key ]){
      return utils.quoteObject(key) + ' = ( ' + queryBuilder( $updates[ key ], values ) + ' )';
    }
    return utils.quoteObject(key) + ' = ' + utils.parameterize($updates[key], values);
  });

  return result.length > 0 ? ('set ' + result.join(', ')) : '';
});

},{"../../lib/query-builder":47,"../../lib/query-helpers":48,"../../lib/update-helpers":50,"../../lib/utils":51}],34:[function(require,module,exports){
var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');

helpers.register('values', function(values, valuesArray, query){
  if (typeof values != 'object') throw new Error('Invalid values input in query properties');

  if (query.type === 'update')
    return helpers.get('updates').fn(values, valuesArray, query);

  if ( !Array.isArray( values ) ) values = [ values ];

  if ( values.length === 0 ) throw new Error('MoSQL.queryHelper.values - Invalid values array length `0`');

  // Build object keys union
  var keys = [], checkKeys = function( k ){
    if ( keys.indexOf( k ) > -1 ) return;
    keys.push( k );
  };

  for ( var i = 0, l = values.length; i < l; ++i ) {
    function hasValue (key) { return values[i][key] !== undefined; }
    Object.keys( values[i] ).filter( hasValue ).forEach( checkKeys );
  }

  var allValues = values.map( function( value ) {
    var result = [];
    for ( var i = 0, l = keys.length; i < l; ++i ){
      if (value[ keys[i] ] === null) {
        result.push('null');
      } else if (value[ keys[i] ] === undefined) {
        result.push('DEFAULT');
      } else if (typeof value[ keys[i] ] == 'object' && 'type' in value[ keys[i] ]) {
        result.push('(' + queryBuilder( value[ keys[i] ], valuesArray ) + ')');
      } else {
        result.push('$' + valuesArray.push(value[keys[i]]));
      }
    }
    return '(' + result.join(', ') + ')';
  }).join(', ');

  return '("' + keys.join('", "') + '") values ' + allValues;
});

},{"../../lib/query-builder":47,"../../lib/query-helpers":48}],35:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');

helpers.register('view', function(view, values, query){
  return '"' + view + '"';
});

},{"../../lib/query-helpers":48}],36:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var conditionBuilder = require('../../lib/condition-builder');

helpers.register('where', function(where, values, query){
  var output = conditionBuilder(where, query.__defaultTable, values);
  if (output.length > 0) output = 'where ' + output;
  return output;
});

},{"../../lib/condition-builder":43,"../../lib/query-helpers":48}],37:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register( 'window', function(win, values, query) {
  var out = ['window'];

  if ( win.name ){
    out.push( utils.quoteObject( win.name ) );
  }

  if ( typeof win.as === 'object' ){
    out.push('as (');

    if ( win.as.existing ){
      out.push( utils.quoteObject( win.as.existing ) );
    } else {
      // Supported sub-types in window expression
      [
        'partition'
      , 'order'
      , 'groupBy'
      ].forEach( function( type ){
        if ( win.as[ type ] ){
          out.push( helpers.get( type ).fn( win.as[ type ], values, query ) );
        }
      });
    }

    out.push(')');
  }

  return out.join(' ');
});

},{"../../lib/query-helpers":48,"../../lib/utils":51}],38:[function(require,module,exports){

var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');

helpers.register('with', function(withObj, values, query){
  if (typeof withObj != 'object') return '';

  // Avoid mutating objects by storing objSyntax names in this array.
  // Indices match up with the newly created withObj array
  var names = [];

  // Convert Object syntax to array syntax, pushing to names
  if ( !Array.isArray( withObj ) ){
    withObj = Object.keys( withObj ).map( function( name ){
      names.push( name );
      return withObj[ name ];
    });
  }

  var output = withObj.map( function( obj, i ){
    var name = 'name' in obj ? obj.name : names[ i ];

    if ( !name ) throw new Error('MoSQL.queryHelper.with requires property `name`');

    return '"' + name + '"' + ' as (' + queryBuilder( obj, values ) + ')';
  }).join(', ');

  return output ? ( 'with ' + output) : '';
});

},{"../../lib/query-builder":47,"../../lib/query-helpers":48}],39:[function(require,module,exports){

/**
 * Update Behaviors
 */

var helpers = require('../lib/update-helpers');
var utils = require('../lib/utils');

/**
 * Increment column
 * Example:
 *  { $inc: { clicks: 1 } }
 * @param  {Object} Hash whose keys are the columns to inc and values are how much it will inc
 */
helpers.add('$inc', function(value, values, collection){
  var output = "";

  for (var key in value){
    output += utils.quoteObject(key) + ' = ' + utils.quoteObject(key, collection) + ' + $' + values.push(value[key]);
  }

  return output;
});

/**
 * Decrement column
 * Example:
 *  { $dec: { clicks: 1 } }
 * @param  {Object} Hash whose keys are the columns to dec and values are how much it will inc
 */
helpers.add('$dec', function(value, values, collection){
  var output = "";

  for (var key in value){
    output += utils.quoteObject(key) + ' = ' + utils.quoteObject(key, collection) + ' - $' + values.push(value[key]);
  }

  return output;
});

},{"../lib/update-helpers":50,"../lib/utils":51}],40:[function(require,module,exports){

require('./lib/normalize');

var
  build               = require('./lib/query-builder')
, queryTypes          = require('./lib/query-types')
, queryHelpers        = require('./lib/query-helpers')
, conditionalHelpers  = require('./lib/conditional-helpers')
, updateHelpers       = require('./lib/update-helpers')
, actionHelpers       = require('./lib/action-helpers')
, columnDefHelpers    = require('./lib/column-def-helpers')
, quoteObject         = require('./lib/utils').quoteObject
;

// Register query types
require('./helpers/query-types');

// Register query helpers
require('./helpers/query/action');
require('./helpers/query/alias');
require('./helpers/query/boolean-helpers');
require('./helpers/query/cascade');
require('./helpers/query/column-constraint');
require('./helpers/query/columns');
require('./helpers/query/conflict');
require('./helpers/query/definition');
require('./helpers/query/distinct');
require('./helpers/query/expression');
require('./helpers/query/for');
require('./helpers/query/from');
require('./helpers/query/function');
require('./helpers/query/group-by');
require('./helpers/query/having');
require('./helpers/query/if-exists');
require('./helpers/query/if-not-exists');
require('./helpers/query/joins');
require('./helpers/query/joins-dep');
require('./helpers/query/limit');
require('./helpers/query/offset');
require('./helpers/query/only');
require('./helpers/query/order');
require('./helpers/query/over');
require('./helpers/query/partition');
require('./helpers/query/queries');
require('./helpers/query/returning');
require('./helpers/query/table');
require('./helpers/query/updates');
require('./helpers/query/values');
require('./helpers/query/view');
require('./helpers/query/where');
require('./helpers/query/window');
require('./helpers/query/with');

// Register conditional helpers
require('./helpers/conditional');

// Register update helpers
require('./helpers/update');

// Register column definition helpers
require('./helpers/column-definitions');

// Register column action helpers
require('./helpers/actions');

module.exports.sql = build;
module.exports.toQuery = function() {
  return build.apply(build, arguments).toQuery();
};

module.exports.queryTypes = queryTypes;
module.exports.registerQueryType = queryTypes.add;

module.exports.queryHelpers = queryHelpers;
module.exports.registerQueryHelper = function(name, options, fn){
  return queryHelpers.add(name, options, fn);
};

module.exports.conditionalHelpers = conditionalHelpers;
module.exports.registerConditionalHelper = function(name, options, fn){
  return conditionalHelpers.add(name, options, fn);
};

module.exports.actionHelpers = actionHelpers;
module.exports.registerActionHelper = function(name, options, fn){
  return actionHelpers.add(name, options, fn);
};

module.exports.updateHelpers = updateHelpers;
module.exports.registerUpdateHelper = function(name, options, fn){
  return updateHelpers.add(name, options, fn);
};

module.exports.columnDefHelpers = columnDefHelpers;
module.exports.registerColumnDefHelper = function(name, options, fn){
  return columnDefHelpers.add(name, options, fn);
};

module.exports.quoteObject = quoteObject;
// Legacy support
module.exports.quoteColumn = quoteObject;

},{"./helpers/actions":1,"./helpers/column-definitions":2,"./helpers/conditional":3,"./helpers/query-types":4,"./helpers/query/action":5,"./helpers/query/alias":6,"./helpers/query/boolean-helpers":7,"./helpers/query/cascade":8,"./helpers/query/column-constraint":9,"./helpers/query/columns":10,"./helpers/query/conflict":11,"./helpers/query/definition":12,"./helpers/query/distinct":13,"./helpers/query/expression":14,"./helpers/query/for":15,"./helpers/query/from":16,"./helpers/query/function":17,"./helpers/query/group-by":18,"./helpers/query/having":19,"./helpers/query/if-exists":20,"./helpers/query/if-not-exists":21,"./helpers/query/joins":23,"./helpers/query/joins-dep":22,"./helpers/query/limit":24,"./helpers/query/offset":25,"./helpers/query/only":26,"./helpers/query/order":27,"./helpers/query/over":28,"./helpers/query/partition":29,"./helpers/query/queries":30,"./helpers/query/returning":31,"./helpers/query/table":32,"./helpers/query/updates":33,"./helpers/query/values":34,"./helpers/query/view":35,"./helpers/query/where":36,"./helpers/query/window":37,"./helpers/query/with":38,"./helpers/update":39,"./lib/action-helpers":41,"./lib/column-def-helpers":42,"./lib/conditional-helpers":44,"./lib/normalize":46,"./lib/query-builder":47,"./lib/query-helpers":48,"./lib/query-types":49,"./lib/update-helpers":50,"./lib/utils":51}],41:[function(require,module,exports){

var HelperManager = require('./helper-manager');

module.exports = new HelperManager();

},{"./helper-manager":45}],42:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"./helper-manager":45,"dup":41}],43:[function(require,module,exports){
(function (Buffer){
var
  utils   = require('./utils')
, helpers = require('./conditional-helpers')
;

module.exports = function(where, table, values){
  var buildConditions = function(where, condition, column, joiner){
    joiner = joiner || ' and ';
    if (column) column = utils.quoteObject(column, table);

    var conditions = [], result;

    for (var key in where) {

      // If the value is undefined, skip it
      if ( where[key] === undefined ) {
        continue;
      }

      if (typeof where[key] == 'object' && !(where[key] instanceof Date) && !Buffer.isBuffer(where[key]) && where[key] !== null) {

        // Key is conditional block
        if (helpers.has(key)) {
          // If it cascades, run it through the builder using the helper key
          // as the current condition
          // If it doesn't cascade, run the helper immediately
          if (helpers.get(key).options.cascade)
            (result = buildConditions(where[key], key, column)) && conditions.push(result);
          else
            (result = helpers.get(key).fn(column, where[key], values, table, where[key])) && conditions.push(result);
        }

        // Key is Joiner
        else if (key == '$or')
          (result = buildConditions(where[key], condition, column, ' or ')) && conditions.push(result);
        else if (key == '$and')
          (result = buildConditions(where[key], condition, column)) && conditions.push(result);

        // Key is array index
        else if (+key >= 0)
          (result = buildConditions(where[key], condition, column)) && conditions.push(result);

        // Key is column
        else
          (result = buildConditions(where[key], condition, key)) && conditions.push(result);

        continue;
      }

      // Key is a helper, use that for this value
      if (helpers.has(key))
        conditions.push(
          helpers.get(key).fn(
            column
          , where[key] === null ? null : utils.parameterize(where[key], values)
          , values
          , table
          , where[key]
          )
        );

      // Key is an array index
      else if (+key >= 0)
        conditions.push(
          helpers.get(condition).fn(
            column
          , where[key] === null ? null : utils.parameterize(where[key], values)
          , values
          , table
          , where[key]
          )
        );

      // Key is a column
      else
        conditions.push(
          helpers.get(condition).fn(
            utils.quoteObject(key, table)
          , where[key] === null ? null : utils.parameterize(where[key], values)
          , values
          , table
          , where[key]
          )
        );
    }

    if (conditions.length > 1) return '(' + conditions.join(joiner) + ')';
    if (conditions.length == 1) return conditions[0];
  };

  // Always remove outer-most parenthesis
  var result = buildConditions(where, '$equals');
  if (!result) return '';
  if (result[0] == '(') return result.substring(1, result.length - 1);
  return result;
};

}).call(this,{"isBuffer":require("../../../../../../../usr/local/lib/node_modules/browserify/node_modules/is-buffer/index.js")})
},{"../../../../../../../usr/local/lib/node_modules/browserify/node_modules/is-buffer/index.js":55,"./conditional-helpers":44,"./utils":51}],44:[function(require,module,exports){

var HelperManager = require('./helper-manager');

module.exports = new HelperManager({ cascade: true });

},{"./helper-manager":45}],45:[function(require,module,exports){

var HelperManager = function(defaults){
  this.defaults = defaults || {};
  this.helpers = {};
  return this;
};

HelperManager.prototype.get = function(name){
  if (!this.has(name)) throw new Error('Cannot find helper: ' + name);
  return this.helpers[name];
};

HelperManager.prototype.has = function(name){
  return this.helpers.hasOwnProperty(name);
};

HelperManager.prototype.add = function(name, options, fn){
  if (typeof options == 'function'){
    fn = options;
    options = {};
  }

  options = options || {};

  for (var key in this.defaults){
    if (!(key in options)) options[key] = this.defaults[key];
  }

  this.helpers[name] = { fn: fn, options: options };

  return this;
};

HelperManager.prototype.register = function(name, options, fn){
  return this.add(name, options, fn);
};

module.exports = HelperManager;

},{}],46:[function(require,module,exports){
(function (Buffer){

// When condition builder is checking sub-objects, one of the
// steps is to make sure we're not traversing a buffer
if ( typeof Buffer === 'undefined' ){
  window.Buffer = function(){};
  window.Buffer.isBuffer = function(){
    return false;
  };
}

}).call(this,require("buffer").Buffer)
},{"buffer":53}],47:[function(require,module,exports){

var queryTypes = require('./query-types');
var queryHelpers = require('./query-helpers');

/**
 * Main SQL Building function
 * @param  {Object} query
 * @param  {Array}  values
 * @return {String}
 */
module.exports = function(query, values){
  if (!query.type){
    query.type = 'expression';
  } else if (!queryTypes.has(query.type)){
    query.function = query.type;
    query.type = 'function';
  }

  var
    type      = queryTypes.get(query.type)
  , variables = type.match(/\{\w+\}/g);

  values    = values || [];

  query.__defaultTable = Array.isArray(query.table) ? query.table[0] : query.table;

  if (query.alias) query.__defaultTable = query.alias;

  if (!query.columns && query.type == 'select' && query.table){
    query.columns = ['*'];
  }

  for (var i = 0, l = variables.length, key; i < l; ++i){
    // If there exists a builder function and input in the options
    // corresponding to the query helper name, then run that
    // helper function with the value of the query->helper_key
    type = type.replace(
      variables[i]
    , queryHelpers.has(key = variables[i].substring(1, variables[i].length - 1)) && query[key] ?
      queryHelpers.get(key).fn(query[key], values, query) : ''
    );
  }

  var result = {
    query :   type.trim().replace(/\s+/g, " ")
  , values:   values
  , original: query
  };

  result.toString = function(){ return result.query; };
  result.toQuery = function() { return { text: result.query, values: result.values }; };

  return result;
};

},{"./query-helpers":48,"./query-types":49}],48:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"./helper-manager":45,"dup":41}],49:[function(require,module,exports){

var types = {};

module.exports.add = function(type, query){
  types[type] = query;
};

module.exports.get = function(type){
  return types[type];
};

module.exports.has = function(type){
  return types.hasOwnProperty(type);
};

Object.defineProperty(module.exports, 'list', {
  get: function() {
    return Object.keys(types);
  }
});

},{}],50:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"./helper-manager":45,"dup":44}],51:[function(require,module,exports){

var utils = module.exports = {};
var regs = {
  dereferenceOperators: /[-#=]+>+/g
, endsInCast: /::\w+$/
};

utils.parameterize = function(value, values){
  if (typeof value == 'boolean') return value ? 'true' : 'false';
  if (value[0] != '$') return '$' + values.push(value);
  if (value[value.length - 1] != '$') return '$' + values.push(value);
  return utils.quoteObject(value.substring(1, value.length - 1));
};

utils.quoteColumn = utils.quoteObject = function(field, collection){
  var period;
  var rest = Array.prototype.slice.call( arguments, 1 );
  var split;

  // Wierdly on phantomjs Number.isNaN is undefined
  // FIXME: find the root cause
  var checkIsNaN = Number.isNaN || isNaN;

  // Split up database and/or schema definition
  for(var i=0;i<rest.length;++i) {
    if(rest[i].indexOf('.')) {
      split = rest[i].split('.');
      rest.splice(i,1);
      split.forEach(function(s) {
        rest.splice(i,0,s);
      });
    }
  }

  // They're casting
  if ( regs.endsInCast.test( field ) ){
    return utils.quoteObject.apply(
      null
    , [ field.replace( regs.endsInCast, '' ) ].concat( rest )
    ) + field.match( regs.endsInCast )[0];
  }

  // They're using JSON/Hstore operators
  if ( regs.dereferenceOperators.test( field ) ){
    var operators = field.match( regs.dereferenceOperators );

    // Split on operators
    return field.split(
      regs.dereferenceOperators
    // Properly quote each part
    ).map( function( part, i ){
      if ( i === 0 ) return utils.quoteObject.apply( null, [ part ].concat( rest ) );

      if ( checkIsNaN( parseInt( part ) ) && part.indexOf("'") === -1 ){
        return "'" + part + "'";
      }

      return part;
    // Re-join fields and operators
    }).reduce( function( a, b, i ){
      return [ a, b ].join( operators[ i - 1 ] );
    });
  }

  // Just using *, no collection
  if (field.indexOf('*') === 0 && collection)
    return '"' + (rest.reverse()).join('"."') + '".*';

  // Using *, specified collection, used quotes
  else if (field.indexOf('".*') > -1)
    return field;

  // Using *, specified collection, didn't use quotes
  else if (field.indexOf('.*') > -1)
    return '"' + field.split('.')[0] + '".*';

  // No periods specified in field, use explicit `table[, schema[, database] ]`
  else if (field.indexOf('.') === -1)
    return '"' + ( rest.reverse() ).concat( field.replace( /\"/g, '' ) ).join('"."') + '"';

  // Otherwise, a `.` was in there, just quote whatever was specified
  else
    return '"' + field.replace( /\"/g, '' ).split('.').join('"."') + '"';
};

utils.quoteValue = function(value){
  var num = parseInt(value), isNum = (typeof num == 'number' && (num < 0 || num > 0));
  return isNum ? value : "$$" + value + "$$";
};

/**
 * Returns a function that when called, will call the
 * passed in function with a specific set of arguments
 */
utils.with = function(fn){
  var args = Array.prototype.slice.call(arguments, 1);
  return function(){ fn.apply({}, args); };
};

},{}],52:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],53:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (isArrayBufferView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView (obj) {
  return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":52,"ieee754":54}],54:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],55:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}]},{},[40])(40)
});