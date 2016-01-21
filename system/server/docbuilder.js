/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require){
// Prints documentation

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
            if (fullname.endsWith('.js') && fullname.indexOf('node_modules') < 0 && fullname.indexOf('docs/api') < 0) {
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
    this.parseDoc = function parseDoc(constructor) {
        if (!constructor) return

        if (!this.BlankDoc) {
            // Build a minimal correct version of the ClassDoc structure
            this.BlankDoc = function BlankDoc(){
                return {
                    class_name:"",
                    body_text: [], // array with strings. each string = paragraph
                    examples: [],
                    events: [],
                    attributes: [],
                    state_attributes: [],
                    methods: [],
                    inner_classes: [],
                    base_class_chain: []
                }
            }
        }

        var class_doc = this.BlankDoc()

        var proto = constructor.prototype

        if (!proto) {
            //xxx console.log('this has do constructor, what do?', constructor)
            return class_doc;
        }

        var p = constructor

        // build parent chain
        while(p) {
            if (p.prototype) {
                var prot = Object.getPrototypeOf(p.prototype);
                if (prot) {
                    p = prot.constructor;
                    class_doc.base_class_chain.push({name:p.name, path:p.module? (p.module.id? p.module.id:""):"", p: p});
                } else {
                    p = null;
                }
            } else {
                p = null;
            }
        }

        class_doc.class_name = proto.constructor.name

        if (!this.Parser) {
            this.Parser = require("$system/parse/onejsparser")
        }

        if (!proto.constructor.body) {
            return;
        }
        // ok lets add the comments at the top of the class
        var ast = this.Parser.parse(proto.constructor.body.toString());

        // lets process the inner classes
        // lets do an ast match what we want is
        var class_body = ast.steps[0]

        function grabFirstCommentBelow(commentarray){
            var res = []
            if (!commentarray) return res
            var last1 = false
            for(var i = 0; i < commentarray.length; i++) {
                var com = commentarray[i]
                if (com === 1){
                    if(last1 === true){
                        break
                    }
                    else {
                        last1 = true
                    }
                }
                else {
                    last1 = false
                    res.push(com)
                }
            }
            return res
        }

        function grabFirstCommentAbove(commentarray){
            var res = []
            if (!commentarray) return res
            var last1 = false
            for (var i = commentarray.length -1;i>=0;i--) {
                var com = commentarray[i];
                if (com === 1){
                    if(last1 === true){
                        break
                    }
                    else {
                        last1 = true
                    }
                }
                else {
                    last1 = false
                    res.unshift(com.trim())
                }
            }
            return res
        }
        var body_steps = class_body.body.steps

        if(!body_steps[0]) return class_doc

        var classcomment = grabFirstCommentBelow(body_steps[0].cmu)
        if (classcomment) {
            if (!class_doc.body_text) {
                class_doc.body_text = []
            }
            for (i=0;i<classcomment.length;i++) {
                class_doc.body_text.push(classcomment[i]);
            }
        }

        for (var i = 0; i < body_steps.length; i++) {
            var step = body_steps[i]

            if(step.type === 'Assign'){
                if(step.left.type === 'Key' && step.left.object.type === 'This' && step.left.key.name === 'attributes' && step.right.type === 'Object'){
                    for(var j = 0; j < step.right.keys.length; j++){
                        var key = step.right.keys[j]
                        var attrname = key.key.name
                        var attr = proto._attributes[attrname]
                        if (!attr) {
                            //TODO not sure why this one has no name sometimes, plx fix
                            continue;
                        }

                        var cmt = grabFirstCommentAbove(key.cmu)
                        var defvaluename = undefined
                        if (attr.value){
                            defvaluename = attr.value
                        }

                        var typename = "typeless";
                        if (attr.type && attr.type.name) typename = attr.type.name.toString()

                        if(typename === 'Event'){
                            class_doc.events.push({name: attrname, body_text: grabFirstCommentAbove(step.cmu)})
                        }
                        else{
                            class_doc.attributes.push({name: attrname, type:typename, defvalue: defvaluename, body_text: grabFirstCommentAbove(key.cmu)})
                        }
                    }
                }
                if(step.left.type === 'Key' && step.left.object.type === 'Key' && step.left.object.object.type === 'This' &&
                    step.left.object.key.name === 'constructor' && step.left.key.name === 'examples' && step.right.type === 'Object'){
                    for(var j = 0; j < step.right.keys.length; j++){
                        var key = step.right.keys[j]

                        var example = {}
                        example.body_text = grabFirstCommentAbove(key.cmu)

                        var examplename = key.key.name
                        example.name = examplename
                        example.examplefunc = proto.constructor.examples[examplename]
                        class_doc.examples.push(example)
                    }
                }

                if(step.left.type === 'Key' && step.left.object.type === 'This' && step.right.type === 'Function'){
                    var stepleft = step.left
                    var method = {name:stepleft.key.name, params:[]};
                    var stepright = step.right;

                    method.body_text = grabFirstCommentAbove(step.cmu);

                    for(var p in stepright.params){
                        var param = stepright.params[p];
                        var paramname = param.id.name;
                        var paramtag = '<' + paramname  + '>';

                        var pbody_text = [];
                        if (param.cm1) {
                            for (var k = 0; k < param.cm1.length;k++) {
                                if (param.cm1[k] != 1) {
                                    pbody_text.push(param.cm1[k])
                                }
                            }
                        }

                        param = {name: paramname, body_text: pbody_text};

                        var remaining = [];
                        for(var a in method.body_text){
                            var L = method.body_text[a];
                            if (L.indexOf(paramtag) === 0) {
                                param.body_text.push(L.substr(paramtag.length).trim());
                            }
                            else{
                                remaining.push(L);
                            }
                        }
                        method.params.push(param)
                        method.body_text = remaining
                    }
                    class_doc.methods.push(method)
                }
            }
            else if (step.type ==="Call"){
                if (step.fn.object.type ==="Id"){
                    if (step.fn.object.name === "define"){
                        if (step.fn.key.name === "class"){
                            var innerclassname = step.args[1].value
                            var newclass = parseDoc(proto[innerclassname])
                            newclass.class_name = innerclassname;
                            newclass.body_text = grabFirstCommentAbove(step.cmu)
                            class_doc.inner_classes.push(newclass)
                        }
                    }
                }
            }
        }
        return class_doc
    }

    this.printJSDuck = function(class_doc, parentclass) {
        var i, j, str, firstline;
        var internal = 'internal,';
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
                    output.push(' * ' + class_doc.body_text[i]);
                }
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
                            defval = undefined;
                        }
                        if (defval) {
                            output.push(' * @attribute {' +attr.type + '} [' + attr.name + '="' + defval + '"]');
                        } else {
                            output.push(' * @attribute {' +attr.type + '} ' + attr.name);
                        }
                        for (j=0;j < attr.body_text.length; j++) {
                            str = attr.body_text[j];
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
            if (class_doc.examples && class_doc.examples.length) {
                console.log('EXAMPLES', class_doc.examples)
            }
            if (class_doc.state_attributes && class_doc.state_attributes.length) {
                console.log('STATE', class_doc.state_attributes)
            }

        }

        return output;

    };


})