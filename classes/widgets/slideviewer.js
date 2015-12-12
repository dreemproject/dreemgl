/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function($ui$, view, label){

	// slide viewer is an automatic slide viewer that turns child nodes into slides
	// use attributes named 'slidetitle' on a child to set the slide title1
	this.attributes = {
		// the width of a slide
		slidewidth: 1024,
		// the height of a slide
		slideheight: 1024,
		// the margin between slides
		slidemargin: 10,
		// the current page
		page: {type:int, persist:true, value:0},
		// animate the scroll
		scroll: {motion:'inoutsine',duration:0.5},
		// persist the postiion
		pos: {persist:true}
	}

	// the class for a nested slide, its automatically wrapped around children
	define.class(this, 'slide', function($ui$, view){
		this.borderradius = vec4(10)
		this.borderwidth = 0
		this.bordercolor = vec4("blue")
		this.bgcolor = "white"

		this.flex = 0
		this.viewport = '2d'
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

	this.page = function(event){
		if(!this.children) return
		if(event.mark) return
		// set the scroll from the page
		if(this._page < 0) this._page = 0
		var len = this.constructor_children.length 
		if(this._page > len - 1) this._page = len - 1

		this.scroll = vec2(this.page * (this.slidewidth + this.slidemargin * 2), 0)
	}

	this.scroll = function(event){
		var page = ceil(event.value[0] / (this.slidewidth + this.slidemargin * 2))

		if(event.animate){
		}
		else if(event.mark){
			this._page = page
		}
		else{
			this.page = Mark(page)
		}
	}

	this.flexwrap = "nowrap"
	this.constructor.slide = this.slide
	this.boundscheck = true

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