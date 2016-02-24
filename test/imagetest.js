/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function(require, $ui$, screen, view, label){
	this.render = function(){ return [
		screen({name:'default', clearcolor:vec4('black')},
			view({bgcolor:'gray', borderradius:20, flexdirection:'row', justifycontent:"space-around", padding:30},
				view({
					width:200,
					height:300,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"aspect-fill",
					bgimage:require('$resources/textures/hex_tiles.png')
				}, label({text:"Aspect Fill"})),
				view({
					width:200,
					height:300,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"aspect-fit",
					bgimage:require('$resources/textures/hex_tiles.png')
				}, label({text:"Aspect Fit"})),
				view({
					width:200,
					height:300,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"stretch",
					bgimage:require('$resources/textures/hex_tiles.png')
				}, label({text:"Stretch"}))
			)
			 ,
			view({bgcolor:'gray', borderradius:20, flexdirection:'row', justifycontent:"space-around", padding:30},
				view({
					width:300,
					height:200,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"aspect-fill",
					bgimage:require('$resources/textures/hex_tiles.png')
				}, label({text:"Aspect Fill"})),
				view({
					width:300,
					height:200,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"aspect-fit",
					bgimage:require('$resources/textures/hex_tiles.png')
				}, label({text:"Aspect Fit"})),
				view({
					width:300,
					height:200,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"stretch",
					bgimage:require('$resources/textures/hex_tiles.png')
				}, label({text:"Stretch"}))
			)
			 ,
			view({bgcolor:'gray', borderradius:20, flexdirection:'row', justifycontent:"space-around", padding:30},
				view({
					width:200,
					height:300,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"aspect-fill",
					bgimage:require('$resources/textures/checker.png')
				}, label({text:"Aspect Fill"})),
				view({
					width:200,
					height:300,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"aspect-fit",
					bgimage:require('$resources/textures/checker.png')
				}, label({text:"Aspect Fit"})),
				view({
					width:200,
					height:300,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"stretch",
					bgimage:require('$resources/textures/checker.png')
				}, label({text:"Stretch"}))
			)
			 ,
			view({bgcolor:'gray', borderradius:20, flexdirection:'row', justifycontent:"space-around", padding:30},
				view({
					width:300,
					height:200,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"aspect-fill",
					bgimage:require('$resources/textures/checker.png')
				}, label({text:"Aspect Fill"})),
				view({
					width:300,
					height:200,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"aspect-fit",
					bgimage:require('$resources/textures/checker.png')
				}, label({text:"Aspect Fit"})),
				view({
					width:300,
					height:200,
					borderwidth:1,
					bordercolor:"white",
					contentmode:"stretch",
					bgimage:require('$resources/textures/checker.png')
				}, label({text:"Stretch"}))
			)
		)
	]}
})
