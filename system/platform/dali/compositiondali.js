// Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

// Duplicated from composition_client.js

// Added missing objects needed elsewhere
Image = function() {
};

define.class('$system/base/compositionbase', function(require, baseclass){

	var Device = require('./devicedali')
	var Render = require('$system/base/render')

	this.atConstructor = function(previous, parent){
	    //HACK. I see different args than these
	    previous = null;
	    parent = null;

	    this.parent = parent

	    this.device = new Device()

		// how come this one doesnt get patched up?
		baseclass.prototype.atConstructor.call(this)

		this.screenname = location && location.search && location.search.slice(1)

		// web environment
		if(previous){
			this.bus = previous.bus || {}
			this.rpc = previous.rpc || {}
			this.rpc.host = this
			this.rendered = true
		}
		else {
		    this.createBus()
		}

		this.renderComposition()

	    // Use first screen name
	    //TODO Check this
	    var child = this.children[0];
	    this.screenname = child.name || child.constructor.name

		this.screen = this.names[this.screenname].screen
		if(!this.screen){
			this.screen = this.names.screens.constructor_children[0]			
			this.screenname = this.screen.name || this.screen.constructor.name
		}

		if(previous || parent) this.doRender(previous, parent)

	    //HACK
	    this.doRender();

	}

	this.doRender = function(previous, parent){
		var globals = {
			composition:this,
			rpc:this.rpc,
			screen:this.screen,
			device:this.device
		}
		globals.globals = globals
	        //NO window in dali
		//window.comp = this

		// copy keyboard and mouse objects from previous

		if(parent){
			this.screen.device = parent.screen.device
			this.screen.parent = parent
		}
		//this.screen.teem = this
		Render.process(this.screen, previous && previous.screen, globals)
		
		if(this.screen.title !== undefined) document.title = this.screen.title 
				
		if(previous){
			this.screen.setDirty(true)
		}

		this.rendered = true
	}

	this.callRpcMethod = function(msg){
	    console.warn('warning: composition_dali.callRpcMethod not implemented', msg);
	    return null;
	}

	this.setRpcAttribute = function(msg){
	    console.warn('warning: composition_dali.setRpcAttribute not implemented', msg);
	}

	this.createBus = function(){
	    console.warn('warning: composition_dali.createBus not implemented');

	    this.bus = {};
	    this.rpc = {};
	}		

	this.log = function(){
	    console.warn('warning: composition_dali.log not implemented');
		var args = Array.prototype.slice.apply(arguments)
		console.log.apply(console, args)
	}

})
