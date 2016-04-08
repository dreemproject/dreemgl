Ext.data.JsonP.checkbox({"tagname":"class","name":"checkbox","autodetected":{},"files":[{"filename":"checkbox.js","href":"checkbox.html#checkbox"}],"extends":"view","members":[{"name":"buttoncolor1","tagname":"attribute","owner":"checkbox","id":"attribute-buttoncolor1","meta":{}},{"name":"buttoncolor2","tagname":"attribute","owner":"checkbox","id":"attribute-buttoncolor2","meta":{}},{"name":"col1","tagname":"attribute","owner":"checkbox","id":"attribute-col1","meta":{}},{"name":"col2","tagname":"attribute","owner":"checkbox","id":"attribute-col2","meta":{}},{"name":"fontsize","tagname":"attribute","owner":"checkbox","id":"attribute-fontsize","meta":{}},{"name":"hovercolor1","tagname":"attribute","owner":"checkbox","id":"attribute-hovercolor1","meta":{}},{"name":"hovercolor2","tagname":"attribute","owner":"checkbox","id":"attribute-hovercolor2","meta":{}},{"name":"pressedcolor1","tagname":"attribute","owner":"checkbox","id":"attribute-pressedcolor1","meta":{}},{"name":"pressedcolor2","tagname":"attribute","owner":"checkbox","id":"attribute-pressedcolor2","meta":{}},{"name":"text","tagname":"attribute","owner":"checkbox","id":"attribute-text","meta":{}},{"name":"textactivecolor","tagname":"attribute","owner":"checkbox","id":"attribute-textactivecolor","meta":{}},{"name":"textcolor","tagname":"attribute","owner":"checkbox","id":"attribute-textcolor","meta":{}},{"name":"stateclick","tagname":"method","owner":"checkbox","id":"method-stateclick","meta":{}},{"name":"statehover","tagname":"method","owner":"checkbox","id":"method-statehover","meta":{}},{"name":"statenormal","tagname":"method","owner":"checkbox","id":"method-statenormal","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-checkbox","short_doc":"Simple checkbox/tobble button: a rectangle with a textlabel and an icon\nexamples &raquo;\n\n\n\n\nopen example in new tab ...","classIcon":"icon-class","superclasses":["view"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>view<div class='subclass '><strong>checkbox</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/checkbox.html#checkbox' target='_blank'>checkbox.js</a></div></pre><div class='doc-contents'><p>Simple checkbox/tobble button: a rectangle with a textlabel and an icon\n<br/><a href=\"/examples/checkboxes\">examples &raquo;</a></p>\n\n<iframe style=\"border:0;width:900px;height:300px\" src=\"/apps/docs/example#path=$root/ui/checkbox.js\"></iframe>\n\n\n<p><a target=\"blank\" href=\"/apps/docs/example#path=$root/ui/checkbox.js\">open example in new tab &raquo;</a></p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-attribute'>Attributes</h3><div class='subsection'><div id='attribute-buttoncolor1' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-buttoncolor1' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-buttoncolor1' class='name expandable'>buttoncolor1</a> : vec4<span class=\"signature\"></span></div><div class='description'><div class='short'>First gradient color for the button background in neutral state ...</div><div class='long'><p>First gradient color for the button background in neutral state</p>\n<p>Defaults to: <code>&quot;1,1,0.9411764740943909,1&quot;</code></p></div></div></div><div id='attribute-buttoncolor2' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-buttoncolor2' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-buttoncolor2' class='name expandable'>buttoncolor2</a> : vec4<span class=\"signature\"></span></div><div class='description'><div class='short'>Second gradient color for the button background in neutral state ...</div><div class='long'><p>Second gradient color for the button background in neutral state</p>\n<p>Defaults to: <code>&quot;1,1,1,1&quot;</code></p></div></div></div><div id='attribute-col1' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-col1' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-col1' class='name expandable'>col1</a> : vec4<span class=\"signature\"></span></div><div class='description'><div class='short'>Gradient color 1 ...</div><div class='long'><p>Gradient color 1</p>\n<p>Defaults to: <code>&quot;0.250980406999588,0.250980406999588,0.250980406999588,1&quot;</code></p></div></div></div><div id='attribute-col2' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-col2' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-col2' class='name expandable'>col2</a> : vec4<span class=\"signature\"></span></div><div class='description'><div class='short'>Gradient color 2 ...</div><div class='long'><p>Gradient color 2</p>\n<p>Defaults to: <code>&quot;0.250980406999588,0.250980406999588,0.250980406999588,1&quot;</code></p></div></div></div><div id='attribute-fontsize' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-fontsize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-fontsize' class='name expandable'>fontsize</a> : float32<span class=\"signature\"></span></div><div class='description'><div class='short'>Font size in device-pixels. ...</div><div class='long'><p>Font size in device-pixels.</p>\n<p>Defaults to: <code>&quot;14&quot;</code></p></div></div></div><div id='attribute-hovercolor1' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-hovercolor1' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-hovercolor1' class='name expandable'>hovercolor1</a> : vec4<span class=\"signature\"></span></div><div class='description'><div class='short'>First gradient color for the button background in hovered state ...</div><div class='long'><p>First gradient color for the button background in hovered state</p>\n<p>Defaults to: <code>&quot;0.9411764740943909,0.9411764740943909,0.9411764740943909,1&quot;</code></p></div></div></div><div id='attribute-hovercolor2' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-hovercolor2' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-hovercolor2' class='name expandable'>hovercolor2</a> : vec4<span class=\"signature\"></span></div><div class='description'><div class='short'>Second gradient color for the button background in hovered state ...</div><div class='long'><p>Second gradient color for the button background in hovered state</p>\n<p>Defaults to: <code>&quot;0.9725490212440491,0.9725490212440491,0.9725490212440491,1&quot;</code></p></div></div></div><div id='attribute-pressedcolor1' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-pressedcolor1' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-pressedcolor1' class='name expandable'>pressedcolor1</a> : vec4<span class=\"signature\"></span></div><div class='description'><div class='short'>First gradient color for the button background in pressed state ...</div><div class='long'><p>First gradient color for the button background in pressed state</p>\n<p>Defaults to: <code>&quot;0.8156862854957581,0.8156862854957581,0.9411764740943909,1&quot;</code></p></div></div></div><div id='attribute-pressedcolor2' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-pressedcolor2' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-pressedcolor2' class='name expandable'>pressedcolor2</a> : vec4<span class=\"signature\"></span></div><div class='description'><div class='short'>Second gradient color for the button background in pressed state ...</div><div class='long'><p>Second gradient color for the button background in pressed state</p>\n<p>Defaults to: <code>&quot;0.8156862854957581,0.8156862854957581,0.9411764740943909,1&quot;</code></p></div></div></div><div id='attribute-text' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-text' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-text' class='name expandable'>text</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The label for the button ...</div><div class='long'><p>The label for the button</p>\n<p>Defaults to: <code>&quot;undefined&quot;</code></p></div></div></div><div id='attribute-textactivecolor' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-textactivecolor' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-textactivecolor' class='name expandable'>textactivecolor</a> : vec4<span class=\"signature\"></span></div><div class='description'><div class='short'>Color of the label text in pressed-down state ...</div><div class='long'><p>Color of the label text in pressed-down state</p>\n<p>Defaults to: <code>&quot;0,0.501960813999176,0,1&quot;</code></p></div></div></div><div id='attribute-textcolor' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-attribute-textcolor' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-attribute-textcolor' class='name expandable'>textcolor</a> : vec4<span class=\"signature\"></span></div><div class='description'><div class='short'>Color of the label text in neutral state ...</div><div class='long'><p>Color of the label text in neutral state</p>\n<p>Defaults to: <code>&quot;0.250980406999588,0.250980406999588,0.250980406999588,1&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-stateclick' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-method-stateclick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-method-stateclick' class='name expandable'>stateclick</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>clicked state ...</div><div class='long'><p>clicked state</p>\n</div></div></div><div id='method-statehover' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-method-statehover' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-method-statehover' class='name expandable'>statehover</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>the hover state when someone hovers over the button ...</div><div class='long'><p>the hover state when someone hovers over the button</p>\n</div></div></div><div id='method-statenormal' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='checkbox'>checkbox</span><br/><a href='source/checkbox.html#checkbox-method-statenormal' target='_blank' class='view-source'>view source</a></div><a href='#!/api/checkbox-method-statenormal' class='name expandable'>statenormal</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>the normal button state ...</div><div class='long'><p>the normal button state</p>\n</div></div></div></div></div></div></div>","meta":{}});