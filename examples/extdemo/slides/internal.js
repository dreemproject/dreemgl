/* Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($ui$, view, label, $examples$guide$, movie, $widgets$, jsviewer) {

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
				data.width = 130;
				data.height = 160;
				cells.push(movie(data));
			}
		}

		return [
			label({marginleft:15,fgcolor:'red', bgcolor:'transparent', text:'Proxy through service when everything can be handeled entirely via nodejs!'}),
			view({flexdirection: 'row', flex: 1, bgcolor:'transparent'},
				view({flexdirection: 'column', flex: 1, alignself: 'stretch', margin: vec4(10), padding: vec4(4), bgcolor:'transparent'},
					label({height:30, fgcolor:'#333', bgcolor:'transparent', flex: 0, fontsize:14, alignself: 'stretch', text:'DreemGL Server (./examples/guide/search.js)'}),
					jsviewer({flex: 1, overflow:'scroll', alignself: 'stretch', source: this.searchCode, fontsize: 14, bgcolor: "#000030", multiline: true}),
					label({height:30, fgcolor:'#333', bgcolor:'transparent', flex: 0, fontsize:14, alignself: 'stretch', text:'DreemGL Client (./examples/extdemo/index.js)'}),
					jsviewer({flex: 1, overflow:'scroll',  alignself: 'stretch', source: this.compositionCode, fontsize: 11, bgcolor: "#000030", multiline: false})
				),
				view({flex: 1, flexdirection:'row', padding: 4, margin: 10, borderradius: 0, bgcolor:"#B3B3D7"}, cells)
			)
		];
	}


});