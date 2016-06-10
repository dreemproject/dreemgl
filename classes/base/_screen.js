define.class('$base/view', function(require, exports, $base$, view) {

	this.attributes = {
		globalkeydown: Config({type:Event}),
		globalkeyup: Config({type:Event}),
		globalkeypress: Config({type:Event}),
		globalkeypaste: Config({type:Event}),
		globalpointerstart: Config({type:Event}),
		globalpointermove: Config({type:Event}),
		globalpointerend: Config({type:Event}),
		globalpointertap: Config({type:Event}),
		globalpointerhover: Config({type:Event}),
		globalpointerover: Config({type:Event}),
		globalpointerout: Config({type:Event}),
		globalpointerwheel: Config({type:Event}),
		globalpointermultimove: Config({type:Event})
	}

	this.bgcolor = NaN
	this.rpcproxy = false
	this.flex = NaN
	this.flexdirection = "column"

	// set the focus to a view node
	this.setFocus = function(view){
		if(this.focus_view !== view){
			var old = this.focus_view
			this.focus_view = view
			if(old) old.focus = Mark(false)
			view.focus = Mark(true)
		}
	}

	// internal, focus the next view from view
	this.focusNext = function(view){
		// continue the childwalk.
		var screen = this, found
		function findnext(node, find){
			for(var i = 0; i < node.children.length; i++){
				var view = node.children[i]
				if(view === find){
					found = true
				}
				else if(!isNaN(view.tabstop) && found){
					screen.setFocus(view)
					return true
				}
				if(findnext(view, find)) return true
			}
		}

		if(!findnext(this, view)){
			found = true
			findnext(this)
		}
	}

	// internal, focus the previous view from view
	this.focusPrev = function(view){
		var screen = this, last
		function findprev(node, find){
			for(var i = 0; i < node.children.length; i++){
				var view = node.children[i]
				if(find && view === find){
					if(last){
						screen.setFocus(last)
						return true
					}
				}
				else if(!isNaN(view.tabstop)){
					last = view
				}
				if(findprev(view, find)) return true
			}
		}
		if(!findprev(this, view)){
			findprev(this)
			if(last) screen.setFocus(last)
		}
	}

	// Modal handling

	// // internal, check if a view is in the modal chain
	// this.inModalChain = function(view){
	// 	if(!view) return false
	// 	if(!this.modal_stack.length) return true
	//
	// 	var last = this.modal_stack[this.modal_stack.length - 1]
	// 	// lets check if any parent of node hits last
	// 	var obj = view
	// 	while(obj){
	// 		if(obj === last){
	// 			return true
	// 		}
	// 		obj = obj.parent
	// 	}
	// 	return false
	// }

	// // open a modal window from object like so: this.openModal( view({size:[100,100]}))
	// this.closeModal = function(value){
	// 	// lets close the modal window
	// 	var modal_stack = this.modal_stack
	//
	// 	var mymodal = modal_stack.pop()
	// 	if(!mymodal) return
	//
	// 	var id = this.screen.children.indexOf(mymodal)
	// 	this.screen.children.splice(id, 1)
	//
	// 	this.modal = modal_stack[modal_stack.length - 1]
	//
	// 	mymodal.emitRecursive("destroy")
	//
	// 	this.redraw()
	//
	// 	mymodal.resolve(value)
	// }
	//
	// this.openModal = function(render){
	// 	var prom = new Promise(function(resolve, reject){
	// 		// wrap our render function in a temporary view
	// 		var vroot = view()
	// 		// set up stuff
	// 		vroot.render = render
	// 		vroot.parent = this
	// 		vroot.screen = this
	// 		vroot.rpc = this.rpc
	// 		vroot.parent_viewport = this
	// 		// render it
	// 		exports.processRender(vroot, undefined, undefined, true)
	//
	// 		var mychild = vroot.children[0]
	// 		//console.log(mychild)
	// 		this.children.push(mychild)
	// 		mychild.parent = this
	// 		mychild.resolve = resolve
	// 		this.modal_stack.push(mychild)
	// 		this.modal = mychild
	//
	// 		// lets cause a relayout
	// 		this.relayout()
	// 	}.bind(this))
	// 	return prom
	// }
	//
	// // open an overlay
	// this.openOverlay = function(render){
	// 	var vroot = view()
	// 	// set up stuff
	// 	vroot.render = render
	// 	vroot.parent = this
	// 	vroot.screen = this
	// 	vroot.rpc = this.rpc
	// 	vroot.parent_viewport = this
	// 	// render it
	// 	exports.processRender(vroot, undefined, undefined, true)
	//
	// 	var mychild = vroot.children[0]
	// 	//console.log(mychild)
	// 	this.children.push(mychild)
	// 	mychild.parent = this
	// 	this.relayout()
	// 	// close function
	// 	mychild.closeOverlay = function(){
	// 		var idx = this.parent.children.indexOf(this)
	// 		if(idx == -1) return
	// 		this.parent.children.splice(idx, 1)
	// 		this.parent.relayout()
	// 	}
	//
	// 	return mychild
	// }

	this.walkTree = function(view){
		var found
		function dump(walk, parent){
			var layout = walk.layout || {}
			var named = (new Function("return function " + (walk.name || walk.constructor.name) + '(){}'))()
			Object.defineProperty(named.prototype, 'zflash', {
				get:function(){
					// humm. ok so we wanna flash it
					// how do we do that.
					window.view = this.view
					return "window.view set"
				}
			})
			var obj = new named()
			obj.geom = 'x:'+layout.left+', y:'+layout.top+', w:'+layout.width+', h:'+layout.height
			if(walk._viewport) obj.viewport = walk._viewport
			// write out shader modes
			var so = ''
			for(var key in walk.shaders){
				if(so) so += ", "
				so += key//+':'+walk.shader_order[key]
			}
			obj.shaders = so
			obj.view = walk

			if(walk._text) obj.text = walk.text

			if(walk === view) found = obj
			if(walk.children){
				//obj.children = []
				for(var i = 0; i < walk.children.length;i++){
					obj[i] = dump(walk.children[i], obj)
				}
			}
			obj._parent = parent
			return obj
		}
		dump(this, null)
		return found
	}

	// animation

	// internal, start an animation, delegated from view
	this.startViewAnimation = function(animguid, anim){
		this.anims[animguid] = anim
	}

	// internal, stop an animation, delegated from view
	this.stopViewAnimation = function(animguid){
		var anim = this.anims[animguid]
		if(anim){
			delete this.anims[animkey]
			if(anim.promise)anim.promise.reject()
		}
	}

	// execute all running animations
	this.doAnimation = function(time, redrawlist){
		for(var key in this.anims){
			var anim = this.anims[key]
			if(anim.start_time === undefined) anim.start_time = time
			var mytime = time - anim.start_time
			var value = anim.compute(mytime)
			if(value instanceof anim.End){
				delete this.anims[key]
				anim.atStep(value.last_value)
			}
			else{
				anim.atStep(value)
				redrawlist.push(anim.view)
			}
		}
	}

})
