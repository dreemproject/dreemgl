/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/
// teem class

define.class('$base/node',function(require){

	var RpcHub = require('$system/rpc/rpchub')

	this._atConstructor = function(){

	}

	this.atConstructor = function(){
		this.composition = this
		this._intervals = []
	}

	this.ondestroy = function(){
		for(var key in this.hub){
			prop = this.hub[key]
			if(typeof prop == 'object'){
				if(prop.destroy && typeof prop.destroy == 'function'){
					prop.destroy()
				}
				renderer.destroy(prop)
			}
		}
		for(var i = 0; i < this._intervals.length; i++){
			clearInterval(this._intervals[i])
		}
	}

	this.toString = function(){
		// lets dump our RPC objects
		var out = 'Teem RPC object:\n'
		for(var key in this){
			if(key in Node.prototype) continue
			out += key +'\n'
		}
		return out
	}

	this.setInterval = function(cb, timeout){
		var id = setInterval(cb, timeout)
		this._intervals.push(id)
		return id
	}

	this.clearInterval = function(id){
		var i = teem._intervals.indexOf(id)
		if(i != -1) teem._intervals.splice(i, 1)
		clearInterval(id)
	}

	this.renderComposition = function(){
		// we have to render the RPC bus
		this.processRender(this, undefined, undefined, false, true)

		//this.children = this.render()

		this.names = {}
		// now lets rpc proxify them
		for(var i = 0; i < this.children.length; i++){
			// ok so as soon as we are stubbed, we need to proxify the object
			var child = this.children[i]
			// if(!child.createRpcProxy) continue
			// add the proxy to the rpc object. Default screen name = 'default'
			var name = child.name || 'default' // || child.constructor.name
			// this.rpc[name] = child.createRpcProxy(this.rpc)
			this.names[name] = child
		}
	}

	this.processRender = function render(inew_version, old_version, state, rerender, nochild){

		var new_version = inew_version
		var is_root = false

		if(!state){
			state = {render_block:[]}
			is_root = true
		}

		// call connect wires before
		if(!rerender){
			var wires = []
			// new_version.connectWires(wires)
			initializing = true
			for(var i = 0; i < wires.length; i++){
				wires[i]()
			}
			initializing = false
		}

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
			if(new_version.atAnimate) new_version.screen.device.animate_hooks.push(new_version)
			if(old_version) old_version.old_flag = true
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
			//new_version.atAttributeGet = atAttributeGet
			//new_version.rerender = __atAttributeGet

			// lets check if object.constructor  a module, ifso
			if(new_version.classroot === undefined){
				new_version.classroot = new_version
				//console.log(object)
	 		}

			// TODO: implement style
			// 	define.atConstructor =  new_version.atStyleConstructor.bind(new_version)

			new_version.atAttributeGetFlag = 2
	 		new_version.children = new_version.render()
			new_version.atAttributeGetFlag = 0

	 		new_version.atAttributeGet = undefined

	 		define.atConstructor = undefined
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
				if(new_children.indexOf(old_child) !== -1) old_child = undefined
			}
			var childreuse = false
			if(new_child.parent){
				childreuse = true
			}
			//var name = new_child.name
			//if(name !== undefined && !(name in new_version)) new_version[name] = new_child
			new_child.guid = new_version.guid+'_'+i
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
			child.atViewDestroy()
			child.emit('destroy')
		}

		if(old_version && !rerender){
			old_version.destroyed = true
			// remove draw hook
			if(old_version.atAnimate){
				var id = old_version.screen.device.animate_hooks.indexOf(old_version)
				if(id !== -1) old_version.screen.device.animate_hooks.splice(id, 1)
			}
			old_version.atViewDestroy()
			old_version.emit('destroy')
		}

		if(is_root){
			// signal to our device we have a newly rendered node
			if(new_version.screen){
				// TODO: refactor
				new_version.screen.atNewlyRendered(new_version)
			}
		}

		return new_version
	}

})
