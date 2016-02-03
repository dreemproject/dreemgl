/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $ui$, view, icon, label, checkbox){
// internal, A palatte is a container view with drag-dropable components

	this.flexdirection = 'column';
	this.alignitems = 'stretch';
	this.overflow = 'scroll';

	this.attributes = {

		// The items to render into the palette.  This is either an array of components, or an Object where
		// every key:value pair is a Section Name : components-array pair.
		items:Config({type:Object})

	};

	define.class(this, "panel", view, function() {
		this.bgcolor = NaN
		this.padding = vec4(20,10,20,10);
		this.justifycontent = 'space-between';
		this.attributes = {
			// The display mode.  `compact` mode displays all the items as compact icons in a grid in multiple columns.
			// `detail` mode displays items as a list in a single column, with extended description.
			mode:Config({type:Enum('compact', 'detail'), value:'compact'}),

			// Items to display in this panel.
			items:Config({type:Array, value:[]}),

			dividercolor: '#999',
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
						labels.push(label({text:item.label, bold:true, bgcolor:'transparent', margintop:15}));
					}

					var desc = item.description || item.desc;
					if (desc) {
						labels.push(label({text:desc, bgcolor:'transparent'}));
					}

					var detail = view({
						flexdirection:'row',
						alignitems:'stretch',

						bgcolor:'transparent',
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
		this.justifycontent = 'space-between';
		this.bgcolor = 'transparent';
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
					bgcolor:NaN,
					text:this.text,
					fontsize:this.fontsize
				}));
			}
			if (this.panel) {
				var icn;
				if (this.panel.mode == 'compact') {
					icn = 'list';
				} else {
					icn = 'th-large';
				}

				var self = this;

				views.push(checkbox({
					bgcolor:'transparent',
					fgcolor:this.bordercolor,
					border:0,
					padding:0,
					margin:0,
					icon:icn,
					onvalue:function(ev) {
						if (ev.value) {
							self.panel.mode = 'detail';
							this.icon = 'th-large';
						} else {
							self.panel.mode = 'compact';
							this.icon = 'list';
						}
					}
				}))
			}
			return views;
		}
	});

	define.class(this, "panelview", view, function() {
		this.bgcolor = 'transparent';
	});

	define.class(this, "panellabel", label, function() {
		this.bgcolor = 'transparent';
		this.fgcolor = '#e4e4e4';
		this.padding = 0;
		this.margin = 0;
	});

	define.class(this, "panelicon", icon, function() {
		this.bgcolor = 'transparent';
		this.fgcolor = '#e4e4e4';
		this.align = 'center';
		this.padding = 0;
		this.margin = 0;
	});

	define.class(this, "panelitem", view, function() {
		this.bgcolor = 'transparent';

		this.flexdirection = 'column';

		this.attributes = {
			text:Config({type:String}),
			image:Config({type:String}),
			icon:Config({type:String}),
			label:Config({type:String}),
			iconfontsize: 40,
			hovercolor:'white',
			hover:false,
			pointerover:function() {
				this.hover = true;
			},
			pointerout:function() {
				this.hover = false;
			},
			pointerstart:function() {
				this.find('mainproperties').target = this.panel ? this.panel : this;
			}
		};

		this.render = function() {
			var views = [];

			var args = {
				bgcolor:'transparent'
			};

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

			if (this.hover) {
				args.fgcolor = this.hovercolor;
			}

			views.push(clas(args));

			//if (this.hover) {
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
	}

});
