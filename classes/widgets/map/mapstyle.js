/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require){

	var watercolor = vec4("#90cccb");

	this.mapstyle = {
		ferry:{
			roadcolor: vec4(0.6784313917160034,0.8470588326454163,0.9019607901573181,1)
		},
		riverbank:{color1:watercolor},
		marina:{color1:watercolor},
		reservoir:{color1:watercolor},
		stream:{color1:watercolor},
		canal:{color1:watercolor},
		lake:{color1:watercolor},
		playa:{color1:watercolor},
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
			color1: vec4("#f6f5f0")
		},
		national_park:{
			color1:vec4("#b2c29d")
		},
		park:{
			offset:-7,
			color1: vec4("#d0dcae", 1)
		},
		residential:{
			color1: vec4("#ffffff")
		},
		industrial:{
			color1:vec4("#dcd6d6")
		},
		recreation_ground:{
			color1:vec4("#deddbe")
		},
		scrub:{
			color1: vec4("#e1e8d6")
		},
		wetland:{
			offset:-18.5,
			color1: vec4("#e2e8e1")
		},
		beach:{
			offset:-19,
			color1: vec4("#f0f0e8")
		},
		nature_reserve:{
			offset:-18,
			color1: vec4("#deddbe")
		},
		commercial:{
		},
		golf_course:{
		},
		farm:{
			color1: vec4("#e6e5e0")
		},
		grass:{
			color1: vec4("#d0dcae")
		},
		sports_centre:{
			color1: vec4(1,0,0,1)
		},
		farmland:{
			color1: vec4("#dddcbd")
		},
		hospital:{
		},
		retail:{
			offset:27,
			color1: vec4('#dcd6d6')
		},
		allotments:{
		},
		runway:{
			offset:-20,
			color1:vec4("#dcdf9d")
		},
		aerodrome:{
			offset:-20,
			color1:vec4("#dddddd")
		},
		forest:{
			offset:-30,
			color1: vec4("#b2c29d")
		},
		meadow:{
			color1: vec4("#deddbe")
		},
		parking:{
			offset:-8,
			color1: vec4(0.501960813999176,0.501960813999176,0.501960813999176,1)
		},
		plant:{
			color1: vec4("#b2c29d")
		},
		pitch:{
			color1: vec4("#efeecd")
		},
		cemetery:{
			color1: vec4("gray")
		},
		zoo:{
		},
		attraction:{
		},
		university:{
			offset:-21,
			color1: vec4('#dcd6d6')
		},
		apron:{
		},
		military:{
		},
		wastewater_plant:{
		},
		playground:{
			offset:-19,
			color1: vec4("#f0eee4")
		},
		stadium:{
		},
		railway:{
			roadcolor: vec4("#f6f5f0"),
			color1: vec4("#f6f5f0"),
			sortkey:3
		},
		rail:{
			roadcolor: vec4("#999999"),
			sortkey:3
		},
		garden:{
			color1: vec4("#d0dcae")
		},
		farmyard:{
			color1: vec4("#deddbe")
		},
		generator:{
		},
		college:{
		},
		pedestrian:{
			color1: vec4('#dddde8')
		},
		school:{
		},
		substation:{
		},
		petting_zoo:{
		},
		wood:{
			color1:vec4("#b2c19c")
		},
		common:{
			color1: vec4('#f6f5f0')
		},
		village_green:{
			color1: vec4("#deddbe")
		},
		prison:{
		},
		racetrack:{
			roadcolor: vec4("#eeece2")
		},
		major_road:{
			roadcolor: vec4("#d1928d")
		},
		Ferry:{
			roadcolor: vec4("#509b9a"),
			sortkey: -1
		},
		highway:{
			roadcolor: vec4("#a098b0"),
			sortkey:2
			},
		minor_road:{
			roadcolor: vec4("#dcdf9d")
		},
		Road:{
			roadcolor: vec4("#d2938e")
		},
		undefined:{
		},
		works:{
		},
		protected_area:{
			color1: vec4("#f6f5f0")
		},
		theme_park:{
		},
		path:{
			roadcolor: vec4('#ebe9dc')
		},
		quarry:{
			color1: vec4("#cccccc")
		},
		bridge:{
			offset:-22,
			color1: vec4('#e8cab0')
		},
		breakwater:{
			offset:-20,
			color1: watercolor
		},
		water:{
			offset:0,
			color1: watercolor
		},
		building:{
			color1: vec4("#dcd6d6")
		},
		apartments:{
		},
		garages:{
		},
		storage_tank:{
		},
		pier:{
			offset:-5,
			color1: vec4('#f6f5f0')
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
			color1: vec4('#eeeeee')
		},
		groyne:{
		},
		roller_coaster:{
		},
		default:
		{
			color1: vec4('#fafafc')
		}
	}
})
