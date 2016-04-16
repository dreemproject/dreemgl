/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require){
// internal, Prints documentation

    var path = require('path');
    var fs = require('fs');

    this.atConstructor = function(args){
        var tree = this.readAllPaths(['resources','server.js','resources','cache','@/\\.','.git', '.gitignore']);
        function wlk(obj, paths){
            if (!paths) {
                paths = [];
            }
            if (!obj.parent) {
                obj.parent = {name:''}
            }
            var fullname = obj.name || '';
            var p = obj.parent;
            while (p) {
                if (p.name) {
                    fullname = p.name + '/' + fullname;
                }
                p = p.parent
            }
            if (/\.js$/.test(fullname) && fullname.indexOf('node_modules') < 0 && fullname.indexOf('docs/api') < 0) {
                paths.push(fullname)
            }

            if (obj.children) {
                for (var i=0; i<obj.children.length; i++) {
                    var child = obj.children[i];
                    child.parent = obj;
                    wlk(child, paths);
                }
            }

            return paths;
        }
        var extracted = wlk(tree).sort();

        function fetch(path) {
            console.log('Fetch Path:', path)
            var expandedPath = define.expandVariables('$' + path);
            var module = require(expandedPath)
            var class_doc = this.parseDoc(module)
			class_doc.sourcePath = path;
            var out = this.printJSDuck(class_doc).join('\n');
            if (out) {
                this.writeToPath(path, out);
            } else {
                console.log('No comments for', path)
            }
        }

        for (var i=0;i<extracted.length;i++) {
            var path = extracted[i];
            try {
                fetch.bind(this)(path);
            } catch (err) {
                console.log('Error loading:', path, err)
            }
        }
    }

    function readRecurDir(base, inname, ignoreset){
        var local = path.join(base, inname)
        var dir = fs.readdirSync(local)
        var out = {name:inname, collapsed:1, children:[]}
        for(var i = 0; i < dir.length;i++){
            var name = dir[i]
            var mypath = path.join(local, name)
            if(ignoreset){
                for(var j = 0; j < ignoreset.length; j++){
                    var item = ignoreset[j]
                    if(typeof item === 'string'){
                        if(mypath.indexOf(item) !== -1)  break
                    }
                    else{
                        if(mypath.match(item)) break
                    }
                }
                if(j < ignoreset.length) continue
            }
            var stat = fs.statSync(mypath)
            if(stat.isDirectory()){
                out.children.push(readRecurDir(local, name, ignoreset))
            }
            else{
                out.children.push({name:name, size:stat.size})
            }
        }
        return out
    }

    // recursively read all directories starting from a base path
    this.readAllPaths = function(ignoreset // files and directories to ignore while recursively expanding
                                ){
        // lets read all paths.
        // lets read the directory and return it
        var root = {collapsed:0, children:[]}

        if(ignoreset) ignoreset = ignoreset.map(function(value){
            if(value.indexOf('@') == 0) return new RegExp(value.slice(1))
            return value
        })

        for (var key in define.paths){
            if(ignoreset.indexOf(key) !== -1) continue
            var ret = readRecurDir(define.expandVariables(define['$'+key]), '', ignoreset)
            ret.name = key
            root.children.push(ret)
        }
        return root
    }

    this.writeToPath = function(topath, data) {
        var fullpath = define.expandVariables('$root/docs/.classdoc/'+topath);

        function ensureDirectoryExistence(filePath) {
            var dirname = path.dirname(filePath);
            if (fs.existsSync(dirname)) {
                return true;
            }
            ensureDirectoryExistence(dirname);
            fs.mkdirSync(dirname);
        }

        ensureDirectoryExistence(fullpath)

        fs.writeFile(fullpath, data)

        console.log('Write complete:', fullpath)
    }


    // Build a documentation structure for a given constructor function
    this.parseDoc = require('$system/parse/jsdocgen').parseDoc

    this.printJSDuck = function(class_doc, parentclass) {
        var i, j, str, firstline;
        var internal = 'internal';
        var output = [];

        if (!class_doc) {
            return output;
        }

        if (class_doc.body_text && class_doc.body_text.length) {
            firstline = class_doc.body_text[0]
            if (firstline && firstline.startsWith(internal)) {
                return output;
            }

            output.push('/**');
            var classname = class_doc.class_name;
            if (parentclass) {
                classname = parentclass + '.' + classname
            }
            output.push(' * @class ' + classname);
            if (class_doc.base_class_chain) {
                var base = class_doc.base_class_chain[0];
                if (base && base.name) {
                    output.push(' * @extends ' + base.name);
                }
            }
            if (class_doc.body_text) {
                for (i=0; i < class_doc.body_text.length; i++) {
					var body = class_doc.body_text[i];
					body = body.replace(/not-supported\s*[:]?\s*/, "@unsupported ");
                    output.push(' * ' + body);
                }
            }

			if (class_doc.examples && class_doc.examples.length) {
				console.log("\n\n\nclass_doc>>>>", class_doc.base_class_chain)
				var ext = ".html"
				var url = '/apps/docs/example' + ext + '#path=$' + class_doc.sourcePath;
				var s = "border:0;";
				var w = 900;
				var h = 300 * class_doc.examples.length;
				output.push(' * ');
				output.push(' * <iframe style="' + s + 'width:' + w + 'px;height:' + h + 'px" src="' + url + '"></iframe>');
				output.push(' * <a target="blank" href="' + url + '">open example in new tab &raquo;</a>');
				output.push(' * ');
			}

			output.push(' */');
            var attrs = [];
            if (class_doc.attributes) {
                for (i=0; i < class_doc.attributes.length; i++) {
                    var attr = class_doc.attributes[i];
                    if (attr.name && attr.name.startsWith('_')) {
                        continue;
                    }
                    if (attr.body_text && attr.body_text.length) {
                        firstline = attr.body_text[0]
                        if (firstline && firstline.startsWith(internal)) {
                            continue
                        }

                        attrs.push(attr.name);
                        output.push('/**');
                        var defval = attr.defvalue;
                        if (typeof(defval) === 'function') {
							output.push(' * @attribute {' +attr.type + '} ' + attr.name);
                        } else {
  						    output.push(' * @attribute {' +attr.type + '} [' + attr.name + '="' + defval + '"]');
                        }
                        for (j=0;j < attr.body_text.length; j++) {
                            str = attr.body_text[j];
							str = str.replace(/not-supported\s*[:]?\s*/, "@unsupported ");

							output.push(' * ' + str);
                        }
                        output.push(' */');
                    }
                }
            }

            if (class_doc.methods) {
                for (i=0; i < class_doc.methods.length; i++) {
                    var meth = class_doc.methods[i];
                    if (meth.name && meth.name.startsWith('_')) {
                        continue;
                    }

                    if (meth.body_text && meth.body_text.length) {
                        firstline = meth.body_text[0]
                        if (firstline && firstline.startsWith(internal)) {
                            continue
                        }


                        if (meth && meth.name) {
                            output.push('/**');
                            output.push(' * @method ' + meth.name);
                            //if (meth.name.startsWith('on')) {
                            //	output.push(' * @event ' + meth.name);
                            //} else {
                            //	output.push(' * @method ' + meth.name);
                            //}

                            for (j=0;j < meth.body_text.length; j++) {
                                str = meth.body_text[j];
								str = str.replace(/not-supported\s*[:]?\s*/, "@unsupported ");
                                output.push(' * ' + str);
                            }

                            if (meth.params) {
                                for (j=0;j < meth.params.length; j++) {
                                    var param = meth.params[j];

                                    var pbody = '';
                                    if (param.body_text && param.body_text.length) {
                                        pbody = param.body_text.join('; ')
                                    }
                                    var typegrabber = /^([^\{}]*)(\{[^\}]+\})\s+(.*)$/;
                                    var result = typegrabber.exec(pbody);
                                    var ptype = ' ';
                                    if (result) {
                                        ptype = ' ' + result[2] + ' ';
                                        pbody = (result[1] + result[3]).trim();
                                    }

                                    output.push(' * @param' + ptype + param.name);
                                    if (pbody.length) {
                                        output.push(' * ' + pbody);
                                    }
                                }
                            }

                            output.push(' */');
                        }
                    }
                }
            }

            if (class_doc.events && class_doc.events.length) {
                for (i = 0; i < class_doc.events.length;i++) {
                    var event = class_doc.events[i];
                    if (event.name && event.name.startsWith('_')) {
                        continue;
                    }
                    if (event.body_text && event.body_text.length) {
                        firstline = event.body_text[0];
                        if (firstline && firstline.startsWith(internal)) {
                            continue
                        }


                        output.push('/**');
                        output.push(' * @event ' + event.name);
                        for (j=0;j < event.body_text.length; j++) {
                            str = event.body_text[j];
							str = str.replace(/not-supported\s*[:]?\s*/, "@unsupported ");
                            output.push(' * ' + str);
                        }
                        output.push(' */');
                    }
                }
            }
            // TODO: JSDuck doesn't handle inner classes in the right way yet, so don't add them
            //if (class_doc.inner_classes && class_doc.inner_classes.length) {
            //    for (i = 0; i < class_doc.inner_classes.length; i++) {
            //        var inner = class_doc.inner_classes[i];
            //        if (inner.class_name && inner.class_name.startsWith('_')) {
            //            continue;
            //        }
            //        output = output.concat(this.printJSDuck(inner, classname));
            //    }
            //}
            if (class_doc.state_attributes && class_doc.state_attributes.length) {
                console.log('STATE', class_doc.state_attributes)
            }

        }

		console.log(output.join('\n'))

        return output;

    };


})
