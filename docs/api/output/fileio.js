Ext.data.JsonP.fileio({"tagname":"class","name":"fileio","autodetected":{},"files":[{"filename":"fileio.js","href":"fileio.html#fileio"}],"extends":"service","members":[{"name":"addListener","tagname":"method","owner":"node","id":"method-addListener","meta":{}},{"name":"emit","tagname":"method","owner":"node","id":"method-emit","meta":{}},{"name":"find","tagname":"method","owner":"node","id":"method-find","meta":{}},{"name":"findChild","tagname":"method","owner":"node","id":"method-findChild","meta":{}},{"name":"mixin","tagname":"method","owner":"node","id":"method-mixin","meta":{}},{"name":"readdir","tagname":"method","owner":"fileio","id":"method-readdir","meta":{}},{"name":"readfile","tagname":"method","owner":"fileio","id":"method-readfile","meta":{}},{"name":"removeListener","tagname":"method","owner":"node","id":"method-removeListener","meta":{}},{"name":"writefile","tagname":"method","owner":"fileio","id":"method-writefile","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-fileio","short_doc":"The fileio class provides an easy RPC mechanism to load/create/save/enumerate files and directories. ...","classIcon":"icon-class","superclasses":["node","service"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/node' rel='node' class='docClass'>node</a><div class='subclass '><a href='#!/api/service' rel='service' class='docClass'>service</a><div class='subclass '><strong>fileio</strong></div></div></div><h4>Files</h4><div class='dependency'><a href='source/fileio.html#fileio' target='_blank'>fileio.js</a></div></pre><div class='doc-contents'><p>The fileio class provides an easy RPC mechanism to load/create/save/enumerate files and directories. The fileio instance should live on the server part of the composition.\ndo not ever put this in a web-facing composition as it has no security features</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-addListener' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/node' rel='node' class='defined-in docClass'>node</a><br/><a href='source/node.html#node-method-addListener' target='_blank' class='view-source'>view source</a></div><a href='#!/api/node-method-addListener' class='name expandable'>addListener</a>( <span class='pre'>key, cb</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>add a listener to an attribute ...</div><div class='long'><p>add a listener to an attribute</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>cb</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-emit' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/node' rel='node' class='defined-in docClass'>node</a><br/><a href='source/node.html#node-method-emit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/node-method-emit' class='name expandable'>emit</a>( <span class='pre'>key, event</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>emit an event for an attribute key. ...</div><div class='long'><p>emit an event for an attribute key. the order</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>event</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-find' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/node' rel='node' class='defined-in docClass'>node</a><br/><a href='source/node.html#node-method-find' target='_blank' class='view-source'>view source</a></div><a href='#!/api/node-method-find' class='name expandable'>find</a>( <span class='pre'>name</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Finds a parent node by name. ...</div><div class='long'><p>Finds a parent node by name.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-findChild' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/node' rel='node' class='defined-in docClass'>node</a><br/><a href='source/node.html#node-method-findChild' target='_blank' class='view-source'>view source</a></div><a href='#!/api/node-method-findChild' class='name expandable'>findChild</a>( <span class='pre'>name</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Finds a child node by name. ...</div><div class='long'><p>Finds a child node by name.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-mixin' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/node' rel='node' class='defined-in docClass'>node</a><br/><a href='source/node.html#node-method-mixin' target='_blank' class='view-source'>view source</a></div><a href='#!/api/node-method-mixin' class='name expandable'>mixin</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Mixes in another class or object, just pass in any number of object or class references. ...</div><div class='long'><p>Mixes in another class or object, just pass in any number of object or class references. They are copied on key by key</p>\n</div></div></div><div id='method-readdir' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='fileio'>fileio</span><br/><a href='source/fileio.html#fileio-method-readdir' target='_blank' class='view-source'>view source</a></div><a href='#!/api/fileio-method-readdir' class='name expandable'>readdir</a>( <span class='pre'>name</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>reads a directory and returns its contents ...</div><div class='long'><p>reads a directory and returns its contents</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : Object<div class='sub-desc'><p>the name of the directory to read</p>\n</div></li></ul></div></div></div><div id='method-readfile' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='fileio'>fileio</span><br/><a href='source/fileio.html#fileio-method-readfile' target='_blank' class='view-source'>view source</a></div><a href='#!/api/fileio-method-readfile' class='name expandable'>readfile</a>( <span class='pre'>name</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Return the full contents of a file as a string. ...</div><div class='long'><p>Return the full contents of a file as a string. Returns the result of node.js fs.readFileSync or null in case of exception</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : Object<div class='sub-desc'><p>The file to read. File paths can use $-shortcuts to refer to various folders</p>\n</div></li></ul></div></div></div><div id='method-removeListener' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/node' rel='node' class='defined-in docClass'>node</a><br/><a href='source/node.html#node-method-removeListener' target='_blank' class='view-source'>view source</a></div><a href='#!/api/node-method-removeListener' class='name expandable'>removeListener</a>( <span class='pre'>key, cb</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>remove a listener from an attribute, uses the actual function reference to find it\nif you dont pass in a function ref...</div><div class='long'><p>remove a listener from an attribute, uses the actual function reference to find it\nif you dont pass in a function reference it removes all listeners</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>cb</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-writefile' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='fileio'>fileio</span><br/><a href='source/fileio.html#fileio-method-writefile' target='_blank' class='view-source'>view source</a></div><a href='#!/api/fileio-method-writefile' class='name expandable'>writefile</a>( <span class='pre'>name, data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>writefile synchronously writes data to a file. ...</div><div class='long'><p>writefile synchronously writes data to a file. Returns the result of node.js fs.writeFileSync or null in case of exception</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : Object<div class='sub-desc'><p>The file to read. File paths can use $-shortcuts to refer to various folders</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>The data to write</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});