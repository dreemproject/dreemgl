/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function(require, $ui$, screen, view, label){
	this.render = function(){ return [
		screen({name:'default', clearcolor:vec4('gray')},
			view({flexdirection:"column", justifycontent:"space-around"},
				view({flex:1, bgcolor:NaN, flexdirection:'row', justifycontent:"space-around", margintop:50},
					view({
						width:100,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"center",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Center", fgcolor:"white", fontsize:10})),
					view({
						width:100,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"left",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Left", fgcolor:"white", fontsize:10})),
					view({
						width:100,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"right",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Right", fgcolor:"white", fontsize:10})),
					view({
						width:100,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"top",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Top", fgcolor:"white", fontsize:10})),
					view({
						width:100,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"bottom",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Bottom", fgcolor:"white", fontsize:10}))
				),
				view({flex:1, bgcolor:NaN, flexdirection:'row', justifycontent:"space-around", margintop:50},
					view({
						width:100,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"center",
						bgimage:require('$resources/textures/portrait.jpg')
					}, label({text:"Center", fgcolor:"white", fontsize:10})),
					view({
						width:100,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"top-left",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Top Left", fgcolor:"black", fontsize:10})),
					view({
						width:100,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"top-right",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Top Right", fgcolor:"white", fontsize:10})),
					view({
						width:100,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"bottom-left",
						bgimage:require('$resources/textures/portrait.jpg')
					}, label({text:"Bottom Left", fgcolor:"white", fontsize:10})),
					view({
						width:100,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"bottom-right",
						bgimage:require('$resources/textures/portrait.jpg')
					}, label({text:"Bottom Right", fgcolor:"white", fontsize:10}))
				),
				view({flex:1, bgcolor:NaN, flexdirection:'row', justifycontent:"space-around", margintop:50},
					view({
						width:150,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"stretch",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Stretch - P > L", fgcolor:"black", fontsize:10})),
					view({
						width:100,
						height:150,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"stretch",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Stretch - P > L", fgcolor:"black", fontsize:10})),
					view({
						width:100,
						height:150,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"stretch",
						bgimage:require('$resources/textures/portrait.jpg')
					}, label({text:"Stretch - P > P", fgcolor:"white", fontsize:10})),
					view({
						width:150,
						height:100,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"stretch",
						bgimage:require('$resources/textures/portrait.jpg')
					}, label({text:"Stretch - P > P", fgcolor:"white", fontsize:10}))
				),
				view({flex:1, bgcolor:NaN, flexdirection:'row', justifycontent:"space-around", margintop:50},
					view({
						width:100,
						height:150,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"aspect-fill",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Aspect Fill - P > L", fgcolor:"black", fontsize:10})),
					view({
						width:100,
						height:150,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"aspect-fit",
						bgimage:require('$resources/textures/landscape.jpg')
					}, label({text:"Aspect Fit - P > L", fgcolor:"black", fontsize:10})),
					view({
						width:100,
						height:150,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"aspect-fill",
						bgimage:require('$resources/textures/portrait.jpg')
					}, label({text:"Aspect Fill - P > P", fgcolor:"white", fontsize:10})),
					view({
						width:100,
						height:150,
						borderwidth:1,
						bordercolor:"white",
						bgimagemode:"aspect-fit",
						bgimage:require('$resources/textures/portrait.jpg')
					}, label({text:"Aspect Fit - P > P", fgcolor:"white", fontsize:10}))
				),
  			    view({flex:1, bgcolor:NaN, flexdirection:'row', justifycontent:"space-around", margintop:50},
				    view({
					width:150,
					height:100,
					borderwidth:1,
					bordercolor:"white",
						bgimagemode:"aspect-fill",
					bgimage:require('$resources/textures/landscape.jpg')
				}, label({text:"Aspect Fill - L > L", fgcolor:"black", fontsize:10})),
				    view({
					width:150,
					height:100,
					borderwidth:1,
					bordercolor:"white",
						bgimagemode:"aspect-fit",
					bgimage:require('$resources/textures/landscape.jpg')
				}, label({text:"Aspect Fit - L > L", fgcolor:"black", fontsize:10})),
				    view({
					width:150,
					height:100,
					borderwidth:1,
					bordercolor:"white",
						bgimagemode:"aspect-fill",
					bgimage:require('$resources/textures/portrait.jpg')
				}, label({text:"Aspect Fill - L > P", fgcolor:"white", fontsize:10})),
				    view({
					width:150,
					height:100,
					borderwidth:1,
					bordercolor:"white",
						bgimagemode:"aspect-fit",
					bgimage:require('$resources/textures/portrait.jpg')
				}, label({text:"Aspect Fit - L > P", fgcolor:"white", fontsize:10}))
				)
			)
		)
	]}
})
