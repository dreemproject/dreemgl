/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $ui$, view, icon, label){
// internal, A palatte is a container view with drag-dropable components

	this.attributes = {

		// The items to render into the palette.  This is either an array of components, or an Object where
		// every key:value pair is a Section Name : components-array pair.
		items:Config({type:Object}),

		//size of the icons in the palatte
		iconsize: 50
	};

	this.flexdirection = 'column';
	this.alignitems = 'stretch';
	this.overflow = 'scroll';

	define.class(this, "panel", view, function() {
		this.bgcolor = 'transparent';
		this.padding = vec4(20,10,20,10);
		this.justifycontent = 'space-around';
		this.alignitems = 'center';
	});

	define.class(this, "divider", label, function() {
		this.bgcolor = 'transparent';
		this.bg = 0;
		this.fontsize = 12;
		this.margin = vec4(5,5,5,0);
		this.borderbottomwidth = 1;
		this.paddingbottom = 3;
		this.bordercolor = '#999';
	});

	define.class(this, "panelview", view, function() {
		this.bgcolor = 'transparent';
	});
	define.class(this, "panellabel", label, function() {
		this.bgcolor = 'transparent';
		this.fgcolor = '#e4e4e4'
	});
	define.class(this, "panelicon", icon, function() {
		this.bgcolor = 'transparent';
		this.fgcolor = '#e4e4e4'
	});

	this.buildItem = function(item) {
		var args = {
			bgcolor:'transparent',
			pointerover:function() {
				console.log('over')
			}
		};

		var clas = this.panelview;

		if (item.image) {
			args.bgimage = '$root/apps/flowgraph/' + item.image
		}

		if (item.text) {
			clas = this.panellabel;
			args.fontsize = this.iconsize;
			args.text = item.text;
		}

		if (item.icon) {
			clas = this.panelicon;
			args.fontsize = this.iconsize;
			args.icon = item.icon;
		}

		return clas(args)
	};

	this.buildPanel = function(items) {
		var views = [];
		for (var i=0;i<items.length;i++) {
			var item = items[i];
			views.push(this.buildItem(item));
		}
		return this.panel(views);
	};

	this.render = function() {
		if (Array.isArray(this.items)) {
			return this.buildPanel(this.items);
		}

		var views = [];

		if (!this.items) {
			return views;
		}

		for (var section in this.items) {

			views.push(this.divider({text:section}));

			var items = this.items[section];

			views.push(this.buildPanel(items))
		}

		return views;
	}

});
