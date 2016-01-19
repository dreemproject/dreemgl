/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('$widgets/docviewer.js', function(){

    // Prints comment-ized AST as JSDuck comments
    this.printJSDuck = function(class_doc, parentclass) {
        var i, j, str;
        var output = [];

        var firstline;
        var internal = 'internal, ';
        if (class_doc.body_text) {
            firstline = class_doc.body_text[0]
            if (firstline && firstline.startsWith(internal)) {
                return output;
            }
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
                if (attr.body_text) { // && attr.body_text.length
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

                if (meth.body_text) { //  && meth.body_text.length
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
                firstline = event.body_text[0]
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
        if (class_doc.inner_classes && class_doc.inner_classes.length) {
            for (i = 0; i < class_doc.inner_classes.length; i++) {
                var inner = class_doc.inner_classes[i];
                if (inner.class_name && inner.class_name.startsWith('_')) {
                    continue;
                }
                output = output.concat(this.printJSDuck(inner, classname));
            }
        }
        if (class_doc.examples && class_doc.examples.length) {
            console.log('EXAMPLES', class_doc.examples)
        }
        if (class_doc.state_attributes && class_doc.state_attributes.length) {
            console.log('STATE', class_doc.state_attributes)
        }

        return output;

    };

    this.renderToJSDuck = function(R) {

        var class_doc = this.parseDoc(R)

//		console.log(class_doc)

        var out = ''

        if (class_doc) {
            out = this.printJSDuck(class_doc).join('\n');

//		console.log(out)

        }

        return out;


    }

})