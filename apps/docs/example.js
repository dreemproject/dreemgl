//Pure JS based composition
define.class('$server/composition', function(require, $ui$, screen, view, label, $widgets$, jsviewer){
// internal, Inline example viewer.  Used by jsduck iframe.

	this.render = function(){
		return [
			screen(
				view({
					bgcolor:'#eee',
					padding:10,
					flex:1,
					flexdirection:'column',
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
					wrapcode:true,
					render:function() {
						var res = [];

						var parseDoc = require('$system/parse/jsdocgen').parseDoc;

						var class_doc = parseDoc(this.classconstr);
						if (class_doc && class_doc.examples) {
							for (var i = 0;i< class_doc.examples.length;i++){
								var example = class_doc.examples[i];
								res.push(label({fgcolor:'#333', text:example.name + ':', bgcolor:'transparent'}));
								res.push(
									view({flexdirection:'row', flex:1, bgcolor:'transparent'},
										view({flex:1, padding:7, flexdirection:"column", bgcolor:"transparent"},
											label({flex:0, fgcolor:'#888', bgcolor:'transparent', text:"Code", fontsize:12, margin:vec4(0,0,0,5)}),
											jsviewer({flex:1, wrap:this.wrapcode, overflow:'scroll', source:example.examplefunc.toString(), fontsize:12, bgcolor:"#000030", multiline: true})
										),
										view({flex:1.5, padding:7, flexdirection:"column", bgcolor:"transparent"},
											label({flex:0, fgcolor:'#888', bgcolor:'transparent', text:"Live demo", fontsize:12, margin:vec4(10,0,0,5)}),
											view({flex:1, flexdirection:"column", margin:vec4(10,0,0,0), bgcolor:'transparent'}, example.examplefunc())
										)
									)
								);
								if (i < class_doc.examples.length - 1) {
									res.push(view({bgcolor:'#999', height:1, margin:vec4(0, 10, 0, 10)}))
								}
							}
						}

						return res;
					}
				})
			)
		]}
});
