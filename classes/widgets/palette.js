/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $ui$, view, icon, label, checkbox){
// A palatte is a container view with drag-dropable components

	this.flexdirection = 'column';
	this.alignitems = 'stretch';
	this.overflow = 'scroll';

	this.attributes = {

		// The items to render into the palette.  This is either an array of components, or an Object where
		// every key:value pair is a Section Name : components-array pair.
		// Each component is an Object with `label` and `desc` properties, in addition to one of
		// `image`, `icon`, or `text` properties.  `image` is the url or file path to an image, icon is the
		// FontAwesome icon identifier, and `text` is simply some printed text.
		items:Config({type:Object, meta:'hidden'}),

		// Function to call globally when testing if a palette item can be dropped onto another view.
		// This can also be defined on the individual components to override behavior.
		// The signature of the function is function(dropevent,view,item,origevent,dropview){}
		dropTest:Config({type:Function}),

		// Function to call globally when dropping a palette item onto a view.
		// This can also be defined on the individual components to override behavior.
		// The signature of the function is function(dropevent,view,item,origevent,dropview){}
		drop:Config({type:Function})
	};

	define.class(this, "panel", view, function() {
		this.bgcolor = 'transparent';
		this.padding = vec4(20,10,20,10);
		this.justifycontent = 'space-between';
		this.attributes = {
			// The display mode.  `compact` mode displays all the items as compact icons in a grid in multiple columns.
			// `detail` mode displays items as a list in a single column, with extended description.
			mode:Config({type:Enum('compact', 'detail'), value:'compact'}),

			// Items to display in this panel.
			items:Config({type:Array, value:[]}),

			dividercolor: Config({type:vec4, meta:"color", value:"#999"}),
			dividermargin: 10,

    		onmode:function () {
				if (this.mode == 'compact') {
					this.flexdirection = 'row';
				} else {
					this.flexdirection = 'column';
				}
			}
		};

		this.render = function () {
			var views = [];

			for (var i=0; i < this.items.length;i++) {
				var itemdef = this.items[i];

				var item = this.outer.panelitem(itemdef);

				item.panel = this;

				if (this.mode == 'detail') {

					var labels = [];

					if (item.label) {
						labels.push(label({text:item.label, bold:true, bgcolor:NaN}));
						item.marginright = 5;
					}

					var desc = item.description || item.desc;
					if (desc) {
						labels.push(label({text:desc, bgcolor:'transparent'}));
					}

					var detail = view({
						flexdirection:'row',
						alignitems:'stretch',
						bgcolor:'transparent',
						paddingbottom:10,
						borderbottomwidth:(i < this.items.length - 1 ? 1 : 0),
						bordercolor:this.dividercolor,
						marginbottom:this.dividermargin
					},
						item,
						view({
							bgcolor:'transparent',
							marginleft:this.dividermargin,
							flexdirection:'column'
						}, labels));

					views.push(detail);

				} else {
					views.push(item);
				}

			}

			return views;
		}
	});

	define.class(this, "divider", view, function() {
		this.justifycontent = "space-between";
		this.bgcolor = "transparent";
		this.margin = vec4(5,5,10,0);
		this.borderbottomwidth = 1;
		this.paddingbottom = 3;
		this.bordercolor = '#999';
		this.attributes = {
			fontsize:12,
			text:Config({type:String}),
			panel: Config({type:Object})
		};
		this.render = function() {
			var views = [];
			if (this.text) {
				views.push(label({
					fgcolor:this.bordercolor,
					bgcolor:"transparent",
					text:this.text,
					fontsize:this.fontsize,
					margintop:5,
					marginleft:5
				}));
			}
			if (this.panel) {
				var icn;
				if (this.panel.mode == "compact") {
					icn = "list";
				} else {
					icn = "th-large";
				}

				var self = this;

				views.push(checkbox({
					bgcolor:this.outer.bgcolor,
					fgcolor:this.bordercolor,
					borderwidth:0,
					padding:0,
					paddingright:7,
					margin:0,
					icon:icn,
					pickalpha:-1,
					onvalue:function(ev) {
						if (ev.value) {
							self.panel.mode = "detail";
							this.icon = "th-large";
						} else {
							self.panel.mode = "compact";
							this.icon = "list";
						}

					}
				}))
			}
			return views;
		}
	});

	define.class(this, "panelview", view, function() {
		this.bgcolor = "transparent";
		this.pickalpha = -1;
	});

	define.class(this, "panellabel", label, function() {
		this.bgcolor = "transparent";
		this.pickalpha = -1;
		this.fgcolor = "#e4e4e4";
		this.padding = 0;
		this.margin = 0;
	});

	define.class(this, "panelicon", icon, function() {
		this.bgcolor = 'transparent';
		this.pickalpha = -1;
		this.fgcolor = '#e4e4e4';
		this.align = 'center';
		this.padding = 0;
		this.margin = 0;
	});

	define.class(this, "panelitem", view, function() {

		this.bgcolor = 'transparent';
		this.flexdirection = 'column';
		this.pickalpha = -1;
		this.padding = 0;
		this.margin = 0;

		this.attributes = {
			text:Config({type:String}),
			image:Config({type:String}),
			icon:Config({type:String}),
			label:Config({type:String}),
			iconfontsize: 40,
			hovercolor:'white',
			hoverstate:false
		};

		this.pointerhover = function() {
			this.hoverstate = true;
		};

		this.pointerout = function() {
			this.hoverstate = false;
		};

		this.pointerstart = function(event) {
			this.startDrag(event, function() {

				var pitem = this;
				return this.buildClas({

					drawtarget:'color',

					position:'absolute',

					bgcolor:NaN,

					width:this.iconfontsize,
					height:this.iconfontsize * 2,

					isDropTarget:function(v, ev) {
						var droptest = true;
						if (pitem.dropTest) {
							droptest = pitem.dropTest(ev, v, pitem, event, this);
						} else if (this.outer && this.outer.dropTest) {
							droptest = this.outer.dropTest(ev, v, pitem, event, this);
						}

						if(!v || !droptest) {
							this.screen.pointer.cursor = 'no-drop';
							return false
						}
						this.screen.pointer.cursor = 'copy';
						return true
					},

					atDrop:function(v, ev){
						if (pitem.drop) {
							pitem.drop(ev, v, pitem, event, this);
						} else if (this.outer && this.outer.drop) {
							this.outer.drop(ev, v, pitem, event, this);
						}
					}
				})
			}.bind(this))
		};

		this.buildClas = function(args) {

			if (!args) {
				args = {bgcolor:'transparent'}
			}

			var clas = this.outer.panelview;

			if (this.image) {
				args.bgimage = this.image;
			}

			if (this.bgimage) {
				args.bgimage = this.bgimage;
			}

			if (this.text) {
				clas = this.outer.panellabel;
				args.fontsize = this.iconfontsize;
				args.text = this.text;
			}

			if (this.icon) {
				clas = this.outer.panelicon;
				args.fontsize = this.iconfontsize;
				args.icon = this.icon;
			}

			if (this.hoverstate) {
				args.fgcolor = this.hovercolor;
			}

			return clas(args);
		};

		this.render = function() {
			var views = [];

			views.push(this.buildClas());

			//if (this.hoverstate) {
			//	views.push(label({text:this.label, bg:0}))
			//}

			return views;
		}

	});

	this.render = function() {
		if (Array.isArray(this.items)) {
			return this.panel({items:this.items});
		}

		var views = [];

		if (!this.items) {
			return views;
		}

		for (var section in this.items) {

			var items = this.items[section];
			var pan = this.panel({items:items});

			var divider = this.divider({text:section, panel:pan});

			views.push(divider);
			views.push(pan)
		}

		return views;
	};

	var palette = this.constructor;
	this.constructor.examples = {
		Usage:function() {
			return palette({
				width:300,
				bgcolor:"#4e4e4e",
				items:{Views:[
					{label:'Flask',  icon:'flask', desc:'A flask icon'},
					{label:'File',
						icon:'file',
						desc:'A file',
						drop:function(v) {
							console.log('file dropped using own drop method onto', v)
						}
					},
					{label:'Text',
						text:'Aa',
						desc:'A text label',
						dropTest:function(v) {
							console.log(this, 'cannot be dropped onto', v)
							return false;
						}
					}]
				},
				dropTest:function(ev, v, item) {
					console.log('test', item, 'againt', v);
					return true;
				},
				drop:function(ev, v, item, orig) {
					console.log('dropped', item, 'onto', v, '@', ev.position, 'started @', orig.position);
				}
			})
		}
	}


});
