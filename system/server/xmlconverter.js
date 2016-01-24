/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// childPromise turns a childprocess into a promise that resolves with the output of the process

define(function(require){
	var fs = require('fs')
	var HTMLParser = require('$system/parse/htmlparser')

	// transform .dre to .js
	return function(filepath) {
		var makeSpace = function(indent) {
			var out = '';
			for (var i = 0; i < indent; i++) {
				out += '\t';
			}
			return out;
		}
		var filterSpecial = function(child) {
			var name = child.tag;
			return name.indexOf('$') !== 0 && (! filterMethods(child)) && (! filterAttributes(child)) && (! filterHandlers(child));
		}
		var filterMethods = function(child) {
			return child.tag === 'method';
		}
		var toMethod = function(child) {
			var body = HTMLParser.reserialize(child.child[0]);
			var fn = new Function(child.attr.args, body);
			return {attr: child.attr, body: fn};
		}
		var filterAttributes = function(child) {
			return child.tag === 'attribute';
		}
		var filterHandlers = function(child) {
			return child.tag === 'handler';
		}
		var capitalize = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		var objToString = function(obj) {
			var out = '{';
			var keys = Object.keys(obj);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var val = obj[key];

				out += key + ': ';
				if (typeof val === 'function') {
					out += val;
				} else if (typeof val === 'object') {
					out += objToString(val);
				} else if (val.indexOf('Config({') === 0) {
					// don't wrap Config in quotes
					out += val;
				} else {
					out += '"' + val + '"';
				}
				if (i < keys.length - 1) out += ', ';
			}
			out += '}';
			return out;
		}
		var tagToFunc = function(child, indent, tagnames) {
			// console.log('tagToFunc', indent, child, child.attr)
			var outputthis = filterSpecial(child);
			var out = '';
			var attr = child.attr || {};
			var i;

			// add methods to attributes hash
			var methods = child.child && child.child.filter(filterMethods).map(toMethod);
			if (methods) {
				for (i = 0; i < methods.length; i++) {
					var method = methods[i];
					attr[method.attr.name] = method.body;
					// console.log('found method:', method)
				}
			}

			// add attributes
			var attributes = child.child && child.child.filter(filterAttributes);
			if (attributes) {
				if (! attr.attributes) {
					attr.attributes = {};
				}
				for (i = 0; i < attributes.length; i++) {
					var attribute = attributes[i].attr;
					var val = attribute.value;
					var type = capitalize(attribute.type);
					if (type === 'String') {
						val = '"' + val + '"';
					}
					// console.log('found attribute:', attribute, val, type)
					attr.attributes[attribute.name] = 'Config({type: ' + type + ', value: ' + val + '})';
				}
			}

			// add handlers
			var handlers = child.child && child.child.filter(filterHandlers).map(toMethod);
			if (handlers) {
				if (! attr.attributes) {
					attr.attributes = {};
				}
				for (i = 0; i < handlers.length; i++) {
					var handler = handlers[i];
					// chop off leading 'on'
					var attrname = handler.attr.event.substring(2);
					// register listener for that event
					attr.attributes[attrname] = 'Config({listeners: [' + handler.body + ']})';
				}
			}

			var children = child.child && child.child.filter(filterSpecial);
			var hasChildren = children && children.length;
			if (outputthis) {
				out += makeSpace(indent);
				// name
				var tagname = child.tag;
        tagnames[tagname] = true;
				out += tagname + '(';
				// attributes
				out += objToString(attr, indent);
				if (hasChildren) out += ',\n'
			}
			if (hasChildren) {
				// children
				indent++;
				for (i = 0; i < children.length; i++) {
					var newchild = children[i];
					out += tagToFunc(newchild, indent, tagnames);
					if (i !== children.length - 1) {
						out += ','
					}
					out += '\n';
				}
				indent--;
			}
			if (outputthis) {
				if (hasChildren) out += makeSpace(indent);
				out += ')';
			}
			return out;
		}

	// look for include paths for tags
		var findIncludes = function(includes) {
			var tagbypath = {};
      includes.map(function(tagname) {
	for (var key in define.paths) {
		var filepath = define.expandVariables('$' + key) + '/' + tagname + '.js';
		if (fs.existsSync(filepath)) {
			if (! tagbypath[key]) {
				tagbypath[key] = [];
			}
			tagbypath[key].push(tagname);
		}
	}
      })
      var includearray = [];
      for (var key in tagbypath) {
	includearray.push('$' + key + '$');
	includearray = includearray.concat(tagbypath[key]);
      }
      return includearray;
		}

		// console.log('parsing .dre file', filepath);
		var parsed = HTMLParser(fs.readFileSync(filepath));
		// console.log('parsed', JSON.stringify(parsed.node));
    var tagnames = {};
    var body = tagToFunc(parsed.node, 1, tagnames);
    // find includes based on tags found
    var includearray = findIncludes(Object.keys(tagnames));

	// console.log('tagname', includearray)
	var out = '// DO NOT MODIFY: generated from ' + filepath + '\n';
		out += 'define.class(\'$server/composition\', function(require,' + includearray + '){\n'
		out += '\tthis.render = function(){ return [\n';
		out += body;
		out += '\t];\n};\n});'
		// console.log('result', out, includearray)
		return out;
	}
})