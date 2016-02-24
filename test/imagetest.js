/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function(require, $ui$, screen, view, label){
	this.render = function(){ return [
		screen({name:'default', clearcolor:vec4('gray')},
			view({flexdirection:"column", justifycontent:"space-around"},
				//view({flex:1, bgcolor:NaN, flexdirection:'row', justifycontent:"space-around", margintop:50},
				//	view({
				//		width:300,
				//		height:200,
				//		borderwidth:1,
				//		bordercolor:"white",
				//		bgimagemode:"stretch",
				//		bgimage:require('$resources/textures/landscape.jpg')
				//	}, label({text:"Stretch - P > L", fgcolor:"#666"})),
				//	view({
				//		width:200,
				//		height:300,
				//		borderwidth:1,
				//		bordercolor:"white",
				//		bgimagemode:"stretch",
				//		bgimage:require('$resources/textures/landscape.jpg')
				//	}, label({text:"Stretch - P > L", fgcolor:"#666"})),
				//	view({
				//		width:200,
				//		height:300,
				//		borderwidth:1,
				//		bordercolor:"white",
				//		bgimagemode:"stretch",
				//		bgimage:require('$resources/textures/portrait.jpg')
				//	}, label({text:"Stretch - P > P", fgcolor:"#666"})),
				//	view({
				//		width:300,
				//		height:200,
				//		borderwidth:1,
				//		bordercolor:"white",
				//		bgimagemode:"stretch",
				//		bgimage:require('$resources/textures/portrait.jpg')
				//	}, label({text:"Stretch - P > P", fgcolor:"#666"}))
				//),
				view({flex:1, bgcolor:NaN, flexdirection:'row', justifycontent:"space-around", margintop:50},
					view({
						width:200,
						height:300,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"aspect-fill",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Aspect Fill - P > L", fgcolor:"#666"})),
					view({
						width:200,
						height:300,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"aspect-fit",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Aspect Fit - P > L", fgcolor:"#666"})),
					view({
						width:200,
						height:300,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"aspect-fill",
						bgimage:require('$resources/textures/portrait.jpg')
					}, label({text:"Aspect Fill - P > P", fgcolor:"#666"})),
					view({
						width:200,
						height:300,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"aspect-fit",
						bgimage:require('$resources/textures/portrait.jpg')
					}, label({text:"Aspect Fit - P > P", fgcolor:"#666"}))
				),
  			    view({flex:1, bgcolor:NaN, flexdirection:'row', justifycontent:"space-around", margintop:50},
				    view({
					width:300,
					height:200,
					borderwidth:1,
					bordercolor:"white",
						bgimagemode:"aspect-fill",
					bgimage:require('$resources/textures/landscape.jpg')
				}, label({text:"Aspect Fill - L > L", fgcolor:"#666"})),
				    view({
					width:300,
					height:200,
					borderwidth:1,
					bordercolor:"white",
						bgimagemode:"aspect-fit",
					bgimage:require('$resources/textures/landscape.jpg')
				}, label({text:"Aspect Fit - L > L", fgcolor:"#666"})),
				    view({
					width:300,
					height:200,
					borderwidth:1,
					bordercolor:"white",
						bgimagemode:"aspect-fill",
					bgimage:require('$resources/textures/portrait.jpg')
				}, label({text:"Aspect Fill - L > P", fgcolor:"#666"})),
				    view({
					width:300,
					height:200,
					borderwidth:1,
					bordercolor:"white",
						bgimagemode:"aspect-fit",
					bgimage:require('$resources/textures/portrait.jpg')
				}, label({text:"Aspect Fit - L > P", fgcolor:"#666"}))
				)
			)
		)
	]}
})
