/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function($containers$, view, $controls$, label){
	
	define.class(this, 'slide', function($containers$, view){
		this.cornerradius = vec4(10,10,10,10);
		this.borderwidth = 0;
		this.bordercolor = vec4("blue");
		this.bgcolor ="white";
		this.flex = 0;
		this.viewport = '2D'
		this.overflow = 'hidden'
		this.padding = vec4(6);
		this.render = function(){
			return view({
					bg:{
						color:function(){
							return vec4(1- mesh.y*0.4, 1- mesh.y*0.4,1- mesh.y*0.2,1)
						}
					},
					//bgcolor: 'blue',
					//borderradius:vec4(10),
					flex:1,
					flexdirection:'column'
				},
				label({
					margin:[10,10,10,10],
					fgcolor:'black',
					bg:0,
					fontsize:50,
					alignself:'center',
					text:this.title
				}),
				view({
					flex:1,
					bgcolor:"transparent", 
					padding:vec4(10)
					},
					this.constructor_children,
				0),
			0)
		}
	});

	// lets put an animation on x

	this.attributes = {
		scroll: {motion:'inoutsine',duration:0.5},
		pos: {persist:true},
		page: {type:int, persist:true}
	}

	this.page = function(){
		this.scroll = vec2(this.page * (this.slidewidth + this.slidemargin * 2), 0)
	}

	this.flexwrap = false
	this.constructor.slide = this.slide
	this.boundscheck = true
	this.slidewidth = 1024
	this.slidemargin = 10
	this.slideheight = 1024
	this.page = 0
	this.keydown = function(key){
		// alright we have a keydown!
		if(key.name == 'leftarrow'){
			// we need to animate to the left
			if(this.page >0) this.page --
		}
		else if(key.name == 'rightarrow'){
			// animate to the right
			if(this.page < this.constructor_children.length-1)this.page++
		}
	}

	// deny focus loss
	this.focuslost = function(){
		this.screen.setFocus(this)
	}

	this.init = function(){
		this.screen.setFocus(this)
	}

	this.render = function(){
		// ok lets render all our slides using our container slide
		var count = 0
		return this.constructor_children.map(function(item){
			count++
			return this.slide({
				flexdirection:'column',
				width:this.slidewidth,
				margin:this.slidemargin,
				height:this.slideheight,
				title:item.slidetitle
			}, item)
		}.bind(this))
	}
})