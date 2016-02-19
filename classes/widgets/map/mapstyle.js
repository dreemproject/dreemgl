/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require){

	var watercolor = vec4("#c0d5d5");

	this.mapstyle = {
		ferry:{
			roadcolor: vec4(0.6784313917160034,0.8470588326454163,0.9019607901573181,1),
		},
		riverbank:{color1:watercolor},
		marina:{color1:watercolor},
		reservoir:{color1:watercolor},
		stream:{color1:watercolor},
		canal:{color1:watercolor},
		lake:{color1:watercolor},
		playa:{color1:vec4("#f0f0c0")},
		river:{color1:watercolor},
		basin:{color1:watercolor},
		swimming_pool:{color1:watercolor},
		sea:{
			color1:watercolor
		},
		ocean:{
			color1:watercolor
		},
		
		earth:{
			color1: vec4("#c0c0c0"),
			
		},
		national_park:{
			color1:vec4("d3fad3"),
			
		},
		park:{
			offset:-7,
			color1: vec4("#bad6ab",1),
			color2: vec4(0.003921568859368563,0.19607843458652496,0.125490203499794,1),
		},
		residential:{
			color1: vec4("#cdc7bf"),
		},
		industrial:{
			color1:vec4("#202020"),
			color2:vec4("#d0d0d0")
		},
		recreation_ground:{
			
			color1:vec4("#8080f0"),
			color2:vec4("#6060f0")
		},
		scrub:{
			color1: vec4("#97d398"),		
		},
		wetland:{
			offset:-18.5,
			color1: vec4("#97b3b8"),
			color2: vec4("darkblue")

		},
		beach:{
			offset:-19,
			color1: vec4("#f0f0a0"),
			color2: vec4("yellow")

		},
		nature_reserve:{
			offset:-18,
			color1: vec4("green"),
			color2: vec4("green")
		},
		commercial:{
		},
		golf_course:{
		},
		farm:{
			color1: vec4("#d3fad3"),
			color2: vec4(1,1,0.10000000149011612,1),
		},
		grass:{
			
			color1:vec4("#d3fad3"),
		},
		sports_centre:{
			color1: vec4(1,0,0,1),
			color2: vec4(1,1,1,1),
		},
		farmland:{
			color1:vec4("#d3fad3"),
			
		},
		hospital:{
		},
		retail:{
			offset:27,
			color1: vec4(0,0,1,0.5),
			color2: vec4(0,0,1,0.5),
		},
		allotments:{
		},
		runway:{
			offset:-20,

			color1:vec4("#c0c0c0"),
			color2:vec4("#d0d0d0")
		},
		aerodrome:{
			offset:-20,

			color1:vec4("#c0c0c0"),
			color2:vec4("#d0d0d0")
		},
		forest:{
			offset:-30,
			color1: vec4("#b7d3a8"),
			
		},
		meadow:{

			color1: vec4("#b7d3a8"),
		},
		parking:{
			offset:-8,
			color1: vec4(0.501960813999176,0.501960813999176,0.501960813999176,1),
			color2: vec4(0.8274509906768799,0.8274509906768799,0.8274509906768799,1),
		},
		plant:{
			color1:vec4("#90f050"),
			color2:vec4("#208020")
		},
		pitch:{
			color1: vec4("#d3fad3"),
			
		},
		cemetery:{
			color1: vec4("gray"),
			color2: vec4("darkgray")
		},
		zoo:{
		},
		attraction:{
		},
		university:{
			offset:-21,
			color1: vec4(1,0,0,1),
			color2: vec4(0,0,0,1),
		},
		apron:{
		},
		military:{
		},
		wastewater_plant:{
		},
		playground:{
			offset:-19,
			color1: vec4("lightblue"),
			color2: vec4(1,0,0,1),
		},
		stadium:{
		},
		railway:{
			roadcolor: vec4("#5e5e5e"),
			color1: vec4("#5e5e5e"),
			sortkey:3
		},
		rail:{
			roadcolor: vec4("#5e5e5e"),
			sortkey:3
		},
		garden:{
			color1: vec4("#90f050"),
		},
		farmyard:{
			color1:vec4("#808010"),
			color2:vec4("#606020")
		},
		generator:{
		},
		college:{
		},
		pedestrian:{
			color1: vec4(0.8274509906768799,0.8274509906768799,0.8274509906768799,1),
			color2: vec4(1,1,0,1),
		},
		school:{
		},
		substation:{
		},
		petting_zoo:{
		},
		wood:{
			color1:vec4("#90f050"),

		},
		common:{
			color1: vec4(1,1,1,1),
		},
		village_green:{
			color1: vec4("#90f050"),
		},
		prison:{
		},
		racetrack:{
			roadcolor: vec4("white"),
		},
		major_road:{
			roadcolor: vec4("#f8faca"),
		},
		Ferry:{
			roadcolor:vec4("blue"),
			sortkey: -1
		},
		highway:{
			roadcolor: vec4("#f4c0ab"),

			sortkey:2,
			},
		minor_road:{
			roadcolor: vec4("white"),
		},
				Road:{
			roadcolor: vec4("#f4c0ab")
		},

		undefined:{
		},
		works:{
		},
		protected_area:{
			color1: vec4("red"),
			color2: vec4("green")
		},
		theme_park:{
		},
		path:{
			roadcolor: vec4(0.8156862854957581,0.8156862854957581,0.8156862854957581,1),
		},
		quarry:{
			color1: vec4("gray"),
			color2: vec4("black")
		},
		bridge:{
			offset:-22,
			color1: vec4(0.501960813999176,0.501960813999176,0.501960813999176,1),
			color2: vec4(1,1,1,1),
		},
		breakwater:{
			offset:-20,
			color1: watercolor,
			color2: 0,
		},
		water:{
			offset:0,
			color1: watercolor,
			color2: 0,
		},
		building:{
			color1:vec4("#cac0b6"),
			color2:vec4("white")
		},
		apartments:{
		},
		garages:{
		},
		storage_tank:{
		},
		pier:{
			offset:-5,
			color1: vec4(0.250980406999588,0.250980406999588,0.250980406999588,1),
			color2: vec4(0.501960813999176,0.501960813999176,0.501960813999176,1),
		},
		place_of_worship:{
		},
		water_works:{
		},
		cinema:{
		},
		taxiway:{
		},
		fuel:{
		},
		footway:{
			offset:-12,
			color1: vec4(0.501960813999176,0.501960813999176,0.501960813999176,1),
			color2: vec4(1,1,0,1),
		},
		groyne:{
		},
		roller_coaster:{
		},
		default:
		{
			color1:vec4('red'),
			color2:vec4('blue')
		}
	}
})