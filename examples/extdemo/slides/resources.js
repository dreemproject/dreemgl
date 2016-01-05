/* Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($ui$, view, label) {

	this.slidetitle = "Resources";

	this.flexdirection = 'column';
	this.bgcolor = 'transparent';

	this.style = {
		label:{
			margintop:10
		},
		label_small:{
			fgcolor:'darkyellow',
			bgcolor:'transparent',
			alignself:'center',
			fontsize:30
		},
		label_large:{
			fgcolor:'#333', 
			bgcolor:'transparent',
			fontsize:40
		}
	}

	this.render = function render() {
		return [
			label({
				text:'+ Detailed Component Guide',
				fgcolor:'#333', bgcolor:'transparent',
				class:'large',
				margintop:0
			}),
			label({
				text:'./examples/guide/README.md',
				class:'small'
			}),
			label({
				text:'+ Web Service Example (Sample Component)',
				class:'large'
			}),
			label({
				text:'https://github.com/teem2/teem-sample_component',
				class:'small'
			}),
			label({
				text:'+ IoT Example (Estimote Beacon)',
				class:'large'
			}),
			label({
				text:'https://github.com/teem2/teem-estimotebeacon',
				class:'small'
			}),
			label({
				text:'+ Questions?',
				class:'large'
			}),
			label({
				text:'Find me on slack or email mason@teem.nu!',
				fgcolor:'darkpink', bgcolor:'transparent',
				class:'small'
			})

		];
	};
});

//https://github.com/teem2/dreemgl/tree/master/compositions/guide