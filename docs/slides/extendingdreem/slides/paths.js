/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function (require, $ui$, view, label) {

	this.slidetitle = "Two Integration Paths - Proxy vs POST";

	this.flexdirection = 'column';
	this.justifycontent = 'space-around';
	this.bgcolor = 'transparent';

	this.render = function render() {
		return [
			view({
					justifycontent:"space-around"
				},
				label({
					flex:1,
					text:'Proxy through service object when nodejs\nlibraries are available.  Poll sensors,\naccess web services, and more,\nall in DreemGL!',
					alignself:'center',
					fgcolor:'#333',
					bgcolor:'transparent',
					fontsize:20
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
					text:'Use the POST API to drive DreemGL externally\nwhen Javascript or nodejs is unavailable.\nMobile apps, IoT devices, web services, and\nany language or device capable of HTTP\ncan take advantage of DreemGL!',
					alignself:'center',
					fgcolor:'#333',
					bgcolor:'transparent',
					fontsize:20,
					margintop:10
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
