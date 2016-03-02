/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function (require, $ui$, view, label) {

	this.slidetitle = "Two Integration Paths - Proxy vs POST";

	this.flexdirection = 'column';
	this.justifycontent = 'space-around';
	this.bgcolor = 'transparent';
	this.padding = 20;

	this.render = function render() {
		return [
			view({
					justifycontent:"space-around",
				},
				label({
					flex:1,
					text:'Proxy through service object when\nnodejs libraries are available.  Poll\nsensors, access web services, and\nmore, all without leaving DreemGL',
					margintop:30,
					fgcolor:'#333',
					bgcolor:'transparent',
					fontsize:23
				}),
				view({
					flex:1,
					alignself:'center',
					bgimage:require('./server.png'),
					borderradius:30
				})
			),
			view({
					justifycontent:"space-around"
				},
				label({
					flex:1,
					text:'Use the POST API to drive DreemGL\nexternally when Javascript or nodejs is\nunavailable.  Mobile apps, IoT devices,\nweb services, and any language or\ndevice capable of HTTP can take\nadvantage of DreemGL',
					margintop:30,
					fgcolor:'#333',
					bgcolor:'transparent',
					fontsize:23
				}),
				view({
					flex:1,
					bgimage:require('./postapi.png'),
					borderradius:30,
					alignself:'center'
				})
			)
		];
	};
});
