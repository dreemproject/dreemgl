/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($ui$, view, label, icon) {

	this.slidetitle = "Resources";

	this.flexdirection = 'column';
	this.bgcolor = 'transparent';
	this.padding = 30;

	define.class(this, "bullet", view, function(){

		this.attributes = {
			icon:Config({type:String, value:"star"}),
			fontsize:Config({type:int, value:25}),
			text:Config({type:String})
		};

		this.render = function () {
			return [
				icon({icon:this.icon, fgcolor:'#112', fontsize:this.fontsize, marginright:20}),
				label({text:this.text, fgcolor:'#333', fontsize:this.fontsize})
			]
		}

	});

	this.render = function render() {
		return [
			this.bullet({
				text:'Detailed Component Guide',
				fgcolor:'#333', bgcolor:'transparent',
				margintop:0
			}),
			this.bullet({
				marginleft:100,
				icon:"link",
				fontsize:20,
				text:'http://localhost:2000/docs/api/index.html#!/guide/components',
				margintop:30
			}),
			this.bullet({
				text:'Sample Components',
				fgcolor:'#333', bgcolor:'transparent',
				margintop:50
			}),
			this.bullet({
				marginleft:100,
				icon:"link",
				fontsize:20,
				text:'/examples/components/hue',
				margintop:30
			}),
			this.bullet({
				marginleft:100,
				icon:"link",
				fontsize:20,
				text:'/examples/components/estimote',
				margintop:20
			}),
			this.bullet({
				marginleft:100,
				icon:"link",
				fontsize:20,
				text:'/examples/components/omdb',
				margintop:20
			}),
			this.bullet({
				marginleft:100,
				icon:"link",
				fontsize:20,
				text:'/examples/components/staticmap',
				margintop:20
			}),
			this.bullet({
				icon:"question",
				text:'Questions?',
				margintop:50
			}),
			this.bullet({
				marginleft:100,
				fontsize:30,
				icon:"envelope-o",
				text:'Find me on slack or email mason@teem.nu!',
				fgcolor:'darkpink',
				margintop:50
			})
		];
	};
});

//https://github.com/dreemgl/dreemgl/tree/master/compositions/guide
