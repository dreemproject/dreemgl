/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($ui$, view, label, $docs$examples$components$, movie, $widgets$, jsviewer) {

	this.attributes = {
		movies: Config({type: Array}),
		searchCode: Config({type: String}),
		compositionCode: Config({type: String})
	};

	this.slidetitle = "Web Service via Service Proxy";
	this.bgcolor = 'transparent';
	this.flexdirection = 'column';

	this.render = function render() {
		var cells = [];
		if (this.movies) {
			for (var i = 0; i < this.movies.length; i++) {
				var data = this.movies[i];
				data.width = 80;
				data.height = 100;
				data.flex = 0;
				data.bgimagemode = "aspect-fit";
				data.overflow = "hidden";

				if (i % 2 == 0) {
					cells.push([]);
				}
				cells[cells.length - 1].push(movie(data))
			}
		}
		var cellviews = [];
		for (var i = 0; i < cells.length; i++) {
			cellviews.push(view({justifycontent:"space-around"}, cells[i]))
		}

		return [
			label({marginleft:15,fgcolor:'red', bgcolor:'transparent', text:'(Proxy through service object when everything can be handeled entirely via nodejs)'}),
			view({flexdirection: 'row', flex: 1, bgcolor:'transparent'},
				view({flexdirection: 'column', flex: 2.5, alignself: 'stretch', margin: vec4(10), padding: vec4(4), bgcolor:'transparent'},
					label({height:30, fgcolor:'#333', bgcolor:'transparent', flex: 0, fontsize:14, alignself: 'stretch', text:'DreemGL Server (./docs/examples/components/search.js)'}),
					jsviewer({flex: 1, overflow:'scroll', alignself: 'stretch', source: this.searchCode, fontsize: 14, bgcolor: "#000030", multiline: true, format_options: {
						force_newlines_array:false,
						force_newlines_object:true
					}}),
					label({height:30, fgcolor:'#333', bgcolor:'transparent', flex: 0, fontsize:14, alignself: 'stretch', text:'DreemGL Client (./docs/examples/components/index.js)'}),
					jsviewer({flex: 1, overflow:'scroll',  alignself: 'stretch', source: this.compositionCode, fontsize: 11, bgcolor: "#000030", multiline: false,format_options: {
						force_newlines_array:false,
						force_newlines_object:true
					}})
				),
				view({flex:1, flexdirection:'column', overflow:"scroll", flexwrap:"wrap", padding: 4, margin: 10, borderradius: 0, bgcolor:"#B3B3D7"}, cellviews)
			)
		];
	}


});
