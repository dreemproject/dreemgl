/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function ($ui$, screen, view, label){
	this.style = {
		view: {
			bgcolor: 'orange',
			margin: 10
		},
		label: {
			fgcolor: 'blue'
		}
	}

	// simple view subclass for testing styles inside a class
	define.class(this, "redview", "$ui/view", function() {
		this.bgcolor = "red";
		this.style = {
			view: {
				w: 70,
				h: 70,
				bgcolor: 'green'
			}
		}
		this.render = function() {
			return [ view() ];
		}
	})

	this.render = function(){
		return [
			screen({
					name:"default",
					clearcolor: 'white',
					flexdirection: 'row'
				},

				// styles get applied to these views
				view({ name: 'v1', w: 50, h: 50, bgcolor: 'gray' })
				,this.redview({ name: 'redview1', w: 100, h: 100 })
				,label({ name: 'l1', text: 'label1', fgcolor: 'black'})
				,view({ name: 'v2', h: 50 }
					,label({ name: 'l2', text: 'label2'})
				)
			)
		];
	}
})
