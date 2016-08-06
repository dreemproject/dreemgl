/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('./compositionbase', function(require, baseclass){
	// internal, Composition base class

	var RpcProxy = require('$system/rpc/rpcproxy')
	var RpcHub = require('$system/rpc/rpchub')
	var screen = require('$ui/screen')
	var Render = require('./render')
	var ASTScanner = require('$system/parse/astscanner')
	var OneJSParser = require('$system/parse/onejsparser')

	this.screenForClient = function() {
		return typeof location !== 'undefined' && location.search && location.search.slice(1)
	};

	this.atConstructor = function(previous, parent, precached){
		this.parent = parent

		// how come this one doesnt get patched up?
		baseclass.atConstructor.call(this)

		this.cached_attributes = precached
		if (!this.cached_attributes) {
			this.cached_attributes = {}
		}
		// web environment
		if(previous){
			this.session = previous.session
			this.bus = previous.bus
			this.rpc = previous.rpc
			this.rpc.disconnectAll()
			this.rpc.host = this
			this.rendered = true
			this.cached_attributes = previous.cached_attributes
		}
		else{
			this.createBus()
			// create the rpc object
			this.rpc = new RpcHub(this)
		}
		this.bindBusEvents()

		this.renderComposition()

		for(var key in this.cached_attributes){
			var attrmsg = this.cached_attributes[key]
			// process it
			this.bus.atMessage(attrmsg)
		}

		this.screenname = this.screenForClient()
		this.screen = this.names[this.screenname]
		if(!this.screen){
			// find the first screen
			for(var key in this.names){
				if(this.names[key] instanceof screen){
					break
				}
			}
			if(!key) throw new Error('No screen found')
			this.screen = this.names[key]
			this.screenname = this.screen.name// || this.screen.constructor.name
		}

		if(previous || parent) this.doRender(previous, parent)

		if (define.$busclass === "$system/rpc/dummybusclient" && !define.$rendertimeout) {
			define.$rendertimeout = 0
		}

		if (typeof(define.$rendertimeout) !== "undefined") {
			setTimeout(function() {
				if (!this.rendered) {
					this.doRender()
				}
			}.bind(this), define.$rendertimeout)
		}

	}

	this.doRender = function(previous, parent){

 		this.screen.screen = this.screen
		this.screen.device = this.device
		this.screen.rpc = this.rpc
		this.screen.composition = this.composition

		if(parent){
			this.screen.device = parent.screen.device
			this.screen.parent = parent
		}
		//this.screen.teem = this

		Render.process(this.screen, previous && previous.screen)

		if(typeof document !== 'undefined' && this.screen.title !== undefined) document.title = this.screen.title

		this.screen.device.redraw()

		this.rendered = true
	}

	this.callRpcMethod = function(msg){
		var prom = this.rpc.allocPromise()
		msg.uid  = prom.uid
		this.bus.send(msg)
		return prom
	}

	this.setRpcAttribute = function(msg){
		this.bus.send(msg)
	}

	this.bindBusEvents = function(){
		this.bus.atMessage = function(msg, socket){
			if(msg.type == 'sessionCheck'){
				if(this.session != msg.session){
					if(this.session) {
						console.log("session broke?", this.session, msg.session)
						location.href = location.href
					} else {
						this.session = msg.session
						this.bus.send({type:'connectScreen', name:this.screenname})
					}
				}
			}
			/*
			else if(msg.type == 'webrtcOffer'){
				if(msg.index != this.index && this.webrtc_offer){ // we got a webrtcOffer
					this.webrtc_answer = WebRTC.acceptOffer(msg.offer)
					this.webrtc_answer.onIceCandidate = function(candidate){
						//console.log('sending answer candidate')
						this.bus.send({type:'webrtcAnswerCandidate', candidate:candidate, index: this.index})
					}
					this.webrtc_answer.onAnswer = function(answer){
						//console.log('sending answer')
						this.bus.send({type:'webrtcAnswer', answer:answer, index: this.index})
					}
					this.webrtc_answer.atMessage = this.webrtc_offer.atMessage
				}
			}
			else if(msg.type == 'webrtcAnswer'){
				if(this.webrtc_offer && msg.index != this.index){
					//console.log('accepting answer')
					this.webrtc_offer.acceptAnswer(msg.answer)
				}
			}
			else if(msg.type == 'webrtcAnswerCandidate'){
				if(this.webrtc_offer && msg.index != this.index){
					//console.log('adding answer candidate')
					this.webrtc_offer.addCandidate(msg.candidate)
				}
			}
			else if(msg.type == 'webrtcOfferCandidate'){
				if(this.webrtc_answer && msg.index != this.index){
					//console.log('adding offer candidate')
					this.webrtc_answer.addCandidate(msg.candidate)
				}
			}*/
			else if(msg.type == 'connectScreenOK'){
				//RpcProxy.createFromDefs(msg.rpcdef, this, rpcpromise)
				/*
				this.webrtc_offer = WebRTC.createOffer()
				this.index = msg.index

				this.webrtc_offer.atIceCandidate = function(candidate){
					this.bus.send({type:'webrtcCandidate', candidate:candidate, index: this.index})
				}.bind(this)

				this.webrtc_offer.atOffer = function(offer){
					this.bus.send({type:'webrtcOffer', offer:offer, index: this.index})
				}.bind(this)
				*/
				for(var key in msg.attributes){
					var attrmsg = msg.attributes[key]
					// process it
					this.bus.atMessage(attrmsg, socket)
				}

				if(!this.rendered) this.doRender()

			}

			else if(msg.type == 'connectScreen'){
				//var obj = RpcProxy.decodeRpcID(this, msg.rpcid)
				//if(!obj) console.log('Cannot find '+msg.rpcid+' on join')
				//else obj.createIndex(msg.index, msg.rpcid, rpcpromise)
			}
			else if(msg.type == 'attribute'){

				this.cached_attributes[msg.rpcid+'_'+msg.attribute] = msg

				var split = msg.rpcid.split('.')
				var obj
				// see if its a set attribute on ourself
				if(split[0] === this.screenname){
					obj = this.screen
				}
				else{
					obj = this.rpc
					for(var i = 0; i < split.length; i++){
						obj = obj[split[i]]
						if(!obj) return console.log("Invalid rpc attribute "+ msg.rpcid)
					}
				}
				if(!obj) return console.log("Invalid rpc attribute "+ msg.rpcid)
				var value =  define.structFromJSON(msg.value)
				var attrset = obj.atAttributeSet
				obj.atAttributeSet = undefined
				obj[msg.attribute] = value
				obj.atAttributeSet = attrset
			}
			else if(msg.type == 'method'){
				// someone is calling a method on us.
				method = this.screen[msg.method]
				if(!method){
					return console.log("Invalid rpc method" + msg.method)
				}
				var ret = method.apply(this.screen, msg.args)
				var uid = msg.uid
				if(ret && typeof ret === 'object' && ret.then){ // promise
					ret.then(function(result){
						var rmsg = {type:'return', uid:uid, value:result}
						if(!define.isSafeJSON(result)){
							console.log("Rpc return value not json safe" + msg.method)
							rmsg.error = 'Return value not json safe'
							rmsg.value = undefined
						}
						socket.send(rmsg)
					})
				}
				else{
					var rmsg = {type:'return', uid:uid, value:ret}
					if(!define.isSafeJSON(ret)){
						console.log("Rpc return value not json safe" + msg.method)
						rmsg.error = 'Return value not json safe'
						rmsg.value = undefined
					}
					socket.send(rmsg)
				}
			}
			else if (msg.type == 'return'){
				this.rpc.resolveReturn(msg)
			}
		}.bind(this)
	}

	this.log = function(){
		var args = Array.prototype.slice.apply(arguments)
		RpcProxy.isJsonSafe(args)
		this.bus.send({
			type:'log',
			args:args
		})
		console.log.apply(console, args)
	}
})
