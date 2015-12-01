/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(exports){
	
	// Reactive renderer

	var initializing = false

	exports.process = function render(inew_version, old_version, globals, state, rerender){
		var new_version = inew_version
		var is_root = false
		if(!state){
			state = {wires:[], render_block: []}
			is_root = true
		}
		/*
 		if(new_version.preRender && !rerender){
 			if(state.render_block.indexOf(new_version) == -1){
 				state.render_block.push(new_version)
	 			new_version = new_version.preRender() // allow postprocessing of children and or replacement of self
	 			if(new_version !== inew_version){
	 				new_version.parent = inew_version.parent
	 			}
	 		}
 		}*/

		for(var key in globals){
			new_version[key] = globals[key]
		}
		
		// call connect wires before
		if(!rerender) new_version.connectWires(state.wires)

		var old_children = old_version? old_version.children: undefined

		// lets call init only when not already called
		if(!rerender){
			if(old_version && old_version._persists && new_version._persists){
				for(var key in old_version._persists){
					if(!(key in new_version._persists)) continue
					// we should set it using a special emit
					var value =  old_version[key]
					new_version['_' + key] = old_version[key]
					new_version.emit(key, {type:'persist', owner:new_version, key:key, value:value})
				}
			}
			new_version.emit('init', old_version)// old_version && old_version.constructor == new_version.constructor? old_version: undefined)
		}
		else{
			old_children = new_version.children
		}

		// then call render
		function __atAttributeGet(){
			//console.log('Rerendering',key)
			//debugger
			// we need to call re-render on this
			if(!initializing){
				render(this, undefined, globals, undefined, true)
				this.redraw()
			}
			//this.setDirty(true)
			//if(this.reLayout) this.reLayout()
		}

		// store the attribute dependencies
		new_version.atAttributeGet = function(key){
			// lets find out if we already have a listener on it
			if(!this.hasListenerName(key, '__atAttributeGet')){
				this.addListener(key, __atAttributeGet)
			}
		}

		new_version.rerender = __atAttributeGet

		// lets check if object.constructor  a module, ifso 
		if(new_version.classroot === undefined){
			new_version.classroot = new_version
			//console.log(object)
 		}

 		new_version.children = new_version.render()
		new_version.atAttributeGet = undefined

		if(!Array.isArray(new_version.children)){
			if(new_version.children) new_version.children = [new_version.children]
			else new_version.children = []
		}

		if(new_version.atRender) new_version.atRender()

		if(new_version._viewport){
			// set up a new layer
			new_version.layer = new_version
			new_version.child_layer_list = []
			if(!rerender && new_version.parent && new_version.parent.layer){
				new_version.parent.layer.child_layer_list.push(new_version)
			}
		}
 		// what we need to do, is 

		var new_children = new_version.children

		if(new_children) for(var i = 0; i < new_children.length; i++){
			var new_child = new_children[i]

			if(Array.isArray(new_child)){ // splice in the children
				var args = Array.prototype.slice.call(new_child)
				args.unshift(1)
				args.unshift(i)
				Array.prototype.splice.apply(new_children, args)
				i-- // hop back one i so we repeat
				continue
			}

			var old_child = undefined
			if(old_children){
				old_child = old_children[i]
			}
			new_child.parent = new_version
			new_child.layer = new_version.layer

			new_child =  new_children[i] = render(new_child, old_child, globals, state)
	
			// set the childs name
			var name = new_child.name || new_child.constructor.name
			if(name !== undefined && !(name in new_version)) new_version[name] = new_child
		}

		if(old_children) for(;i < old_children.length;i++){
			old_children[i].emitRecursive('deinit')
		}

		if(old_version) old_version.emit('deinit')

		if(is_root){
			initializing = true
			for(var i = 0; i < state.wires.length; i++){
				state.wires[i]()
			}
			initializing = false

			// signal to our device we have a newly rendered node
			if(globals.device){
				globals.device.atNewlyRendered(new_version)
			}
		}

		return new_version
	}

	exports.dump = function(node, depth){
		var ret = ''
		if(!depth) depth = ''
		ret += depth + node.name + ': ' + node.constructor.name
		var outer = node.outer
		while(outer){
			ret += " - " + outer.constructor.name
			outer = outer.outer
		}
		if(node.children) for(var i = 0; i<node.children.length; i++){
			ret += "\n"
			ret += this.dump(node.children[i], depth +'-')
		}
		return ret
	}
})
