/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $ui$, view, icon) {
// A table is a container view that lays out it's children in either rows or columns.
// Individual rows and columns can be configured via styles and are given names and style classes conforming to
// either `row#` or `column#` style where `#` is the index of the particular row or column.

	this.attributes = {
		// The number of rows in the table (not compatible with `columns`)
		rows:-1,

		// The number of columns in the table (not compatible with `rows`)
		columns:-1,

		// internal, The number of rows or columns in the table (set automatically via `rows` or `columns`)
		sections:1,

		// justifycontent passed to the inner rows or columns
		justifysection: Config({group:"layout", type: Enum('','flex-start','center','flex-end','space-between','space-around'), value: ""}),

		// alignitems passed to the inner rows or columns
		alignsection: Config({group:"layout", type: Enum('flex-start','center','flex-end','stretch'), value:"stretch"}),
	};

	this.onrows = function(ev,v,o) {
		this._columns = -1;
		this.flexdirection = "column";
		this.sections = v;
		this.relayout();
	};

	this.oncolumns = function(ev,v,o) {
		this._rows = -1;
		this.flexdirection = "row";
		this.sections = v;
		this.relayout();
	};

	this.render = function() {

		var rows = [];

		for (var i=0; i < this.sections; i++) {
			var views = [];
			for (var j = (i % this.sections); j < this.constructor_children.length; j+=this.sections) {
				var child = this.constructor_children[j];
				if (child) {
					views.push(child)
				}
			}

			var sectionflex = this.flexdirection === "column" ? "row" : "column";
			var sectionname = sectionflex + i;

			rows.push(
				this.rowcol({
					flex:1,
					name:sectionname,
					class:sectionname,
					alignitems:this.alignsection,
					justifycontent:this.justifysection,
					flexdirection: sectionflex
				}, views)
			)
		}

		return rows;

	}

	define.class(this, "rowcol", "$ui/view", function() {
	})

	var table = this.constructor;
	// Basic usage of the table.
	this.constructor.examples = {
		Usage:function() {
			return [
				table({
    					width:200,
						columns:3,
						alignsection:"center",
						style:{
							rowcol: {
								borderwidth:vec4(0,1,0,0),
								bordercolor:"white"
							}
						}
					},
					icon({icon:"facebook"}),
					icon({icon:"digg"}),
					icon({icon:"cc"}),
					icon({icon:"envelope"}),
					icon({icon:"empire"}),
					icon({icon:"eye"}),
					icon({icon:"circle"}),
					icon({icon:"circle-o"}),
					icon({icon:"star"}),
					icon({icon:"star-o"})
				)
			]
		}
	}


});
