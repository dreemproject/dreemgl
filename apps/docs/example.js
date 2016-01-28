//Pure JS based composition
define.class('$server/composition', function(require, $server$, fileio, dataset, $ui$, screen, view, splitcontainer, treeview, label, $widgets$, docviewer, jsviewer){
// internal, Inline example viewer.  Used by jsduck iframe.

	this.render = function(){
		return [
			screen(
				view({
					flex:1,
					flexdirection:'column',
					bgcolor:'white',
					classconstr: Config({type:Function, persist:true}),
					init:function() {
						this.screen.locationhash = function(event){
							if (event.value.path) {
								require
									.async(event.value.path)
									.then(function(module){
										this.classconstr = module;
									}.bind(this))
							}
						}.bind(this)
					},
					render:function() {
						var res = [];

						var parseDoc = require('$system/parse/jsdocgen').parseDoc;

						var class_doc = parseDoc(this.classconstr);
						if (class_doc && class_doc.examples) {
							for (var i = 0;i< class_doc.examples.length;i++){
								var example = class_doc.examples[i];
								res.push(label({fgcolor:'#666', text:example.name}));
								res.push(
									view({flexdirection:"row", flex:1},
										view({bg:0, flex: 1, borderwidth: 1, flexdirection:"column", bgcolor:"#f0f0f0"},
											label({fgcolor:"#888", bg:0, text:"Code", margin:vec4(10)}),
											jsviewer({wrap:true, source:example.examplefunc.toString(), fontsize: 12, bgcolor:"#000030", multiline: true})
										),
										view({bg:1, flex: 1, borderwidth: 1, flexdirection:"column"},
											label({fgcolor:"#888", bg:0, text:"Live demo", margin:vec4(10)}),
											example.examplefunc()
										)
									)
								);
							}
						}

						return res;
					}
				})
			)
		]}
})
