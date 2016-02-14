/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(exports){

	// internal, Reactive renderer

	var initializing = false

	var process_list = []
	var process_timer = undefined

	function processTimeout(){
		process_timer = undefined
		var pl = process_list
		process_list = []
		for(var i = 0; i < pl.length; i++){
			exports.process(pl[i], undefined, undefined, true)
		}
	}

	function __atAttributeGet(key){
		if(!initializing){
			//exports.process(this, undefined, undefined, true)
			if(!process_timer){
				if(process_list.indexOf(this) === -1)
					process_list.push(this)
				process_timer = setTimeout(processTimeout, 0)
			}
		}
	}

	function atAttributeGet(key){
		// lets find out if we already have a listener on it
		if(this.getAttributeConfig(key).rerender !== false && !this.hasListenerProp(key, 'name', '__atAttributeGet')){
			this.addListener(key, __atAttributeGet)
		}
	}

	exports.process = function render(inew_version, old_version, state, rerender, nochild){

		var new_version = inew_version
		var is_root = false

		if(!state){
			state = {wires:[], render_block:[]}
			is_root = true
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
			if(new_version.atViewInit) new_version.atViewInit(old_version)
			new_version.emit('init', old_version)// old_version && old_version.constructor == new_version.constructor? old_version: undefined)
		}
		else{
			old_children = new_version.children
		}

		// lets only do this if we have a render function
		if(new_version.render){
			// then call render

			// store the attribute dependencies
			new_version.atAttributeGet = atAttributeGet
			new_version.rerender = __atAttributeGet

			// lets check if object.constructor  a module, ifso
			if(new_version.classroot === undefined){
				new_version.classroot = new_version
				//console.log(object)
	 		}

	 		define.atConstructor =  new_version.atStyleConstructor.bind(new_version)

	 		new_version.children = new_version.render()

	 		define.atConstructor = undefined
			new_version.atAttributeGet = undefined
		}
		else{
			new_version.children = new_version.constructor_children
		}

		if(!Array.isArray(new_version.children)){
			if(new_version.children) new_version.children = [new_version.children]
			else new_version.children = []
		}

		if(new_version.atRender) new_version.atRender()

		if(new_version._viewport){
			// set up a new layer
			new_version.parent_viewport = new_version
			new_version.child_viewport_list = []
			if(!rerender && new_version.parent && new_version.parent.parent_viewport){
				new_version.parent.parent_viewport.child_viewport_list.push(new_version)
			}
		}
 		// what we need to do, is

		var new_children = new_version.children

		if(!nochild && new_children) for(var i = 0; i < new_children.length; i++){
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
			var childreuse = false
			if(new_child.parent) childreuse = true

			//var name = new_child.name
			//if(name !== undefined && !(name in new_version)) new_version[name] = new_child

			new_child.parent = new_version
			new_child.screen = new_version.screen
			new_child.rpc = new_version.rpc
			new_child.parent_viewport = new_version.parent_viewport
			new_children[i] = render(new_child, old_child, state, childreuse)
		}

		if(new_version.atChildrenRendered) new_version.atChildrenRendered()

		if(old_children) for(;i < old_children.length;i++){
			var child = old_children[i]
			child.destroyed = true
			child.emit('destroy')
		}

		if(old_version){
			old_version.destroyed = true
			old_version.emit('destroy')
		}

		if(is_root){
			initializing = true
			for(var i = 0; i < state.wires.length; i++){
				state.wires[i]()
			}
			initializing = false

			// signal to our device we have a newly rendered node
			if(new_version.screen){
				new_version.screen.device.atNewlyRendered(new_version)
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
