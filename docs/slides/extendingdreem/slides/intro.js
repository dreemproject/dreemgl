/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/view", function ($ui$, view, label, icon) {

    this.attributes = {
        syntaxCode: Config({type: String})
    };

    this.slidetitle = "Extending DreemGL";
    this.flexdirection = 'column';
    this.bgcolor = 'transparent';
	this.padding = 20;

	define.class(this, "bullet", view, function(){

		this.attributes = {
			icon:Config({type:String, value:"gear"}),
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
				text:'DreemGL can be extended to communicate with:'
			}),
			this.bullet({icon:"globe", text:'Web Services', fontsize:20, margintop:20, marginleft:40 }),
			this.bullet({icon:"lightbulb", text:'IoT Devices', fontsize:20, margintop:20, marginleft:40 }),
			this.bullet({icon:"mobile", text:'Mobile Apps', fontsize:20, margintop:20, marginleft:40 }),
			this.bullet({icon:"tachometer", text:'Ambient Sensors', fontsize:20, margintop:20, marginleft:40 }),
			this.bullet({icon:"cloud", text:'Cloud Services', fontsize:20, margintop:20, marginleft:40 }),
            this.bullet({
                text:'Integrate internally via nodejs (write entirely in DreemGL)',
                margintop:30
            }),
			this.bullet({
                text:'Integrate externally via POST API (write in any language)',
                margintop:50
            }),
			this.bullet({
				text:'Simple data upload with multipart/form-data via POST API',
				margintop:50
			})
        ];
    };
});
