/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Mouse class

define.class('$system/base/keyboard', function (require, exports){

	this.toKey = { // slap a usable name on keys
		8:'backspace',9:'tab',13:'enter',16:'shift',17:'ctrl',18:'alt',
		19:'pause',20:'caps',27:'escape',
		32:'space',33:'pgup',34:'pgdn',
		35:'end',36:'home',37:'leftarrow',38:'uparrow',39:'rightarrow',40:'downarrow',
		45:'insert',46:'delete',
		48:'num0',49:'num1',50:'num2',51:'num3',52:'num4',
		53:'num5',54:'num6',55:'num7',56:'num8',57:'num9',
		65:'a',66:'b',67:'c',68:'d',69:'e',70:'f',71:'g',
		72:'h',73:'i',74:'j',75:'k',76:'l',77:'m',78:'n',
		79:'o',80:'p',81:'q',82:'r',83:'s',84:'t',85:'u',
		86:'v',87:'w',88:'x',89:'y',90:'z',
		91:'leftmeta',92:'rightmeta',
		96:'pad0',97:'pad1',98:'pad2',99:'pad3',100:'pad4',101:'pad5',
		102:'pad6',103:'pad7',104:'pad8',105:'pad9',
		106:'multiply',107:'add',109:'subtract',110:'decimal',111:'divide',
		112:'f1',113:'f2',114:'f3',115:'f4',116:'f5',117:'f6',
		118:'f7',119:'f8',120:'f9',121:'f10',122:'f11',123:'f12',
		144:'numlock',145:'scrollock',186:'semicolon',187:'equals',188:'comma',
		189:'dash',190:'period',191:'slash',192:'accent',219:'openbracket',
		220:'backslash',221:'closebracket',222:'singlequote',
	}
	this.toCode = {}
	for(var k in this.toKey){
		var key = this.toKey[ k ]
		this.toCode[key] = k
		this.defineAttribute(key, {type:int})
	}

	var fireFoxTable = {
		93:91, // left mete
		224:92, // right meta
		61:187, // equals
		173:189, // minus
		59:186 // semicolon
	}

	this.atConstructor = function(){

		var special_key_hack = false

		window.addEventListener('keydown', function(e){
			var code = fireFoxTable[e.keyCode] || e.keyCode
			// we go into special mode
			if(e.keyCode == 229){
				special_key_hack = true
				return e.preventDefault()
			}
			var keyname = this.toKey[ code ]
			if( keyname ) this.emit(keyname, 1)
			var msg = { 
				repeat: e.repeat,
				code: code,
				name: keyname
			}
			msg[msg.name] = 1
			
			this.emit('down', msg)
			
			if((e.ctrlKey || e.metaKey) && code == this.toCode.y){
				e.preventDefault()
			}
			if(code == this.toCode.tab){
				var msg = {
					repeat: e.repeat,
					name: 'tab',
					value: '\t',
					char: 9
				}
				e.preventDefault()
			}
			else if(code == this.toCode.backspace){
				e.preventDefault()
			}
		}.bind(this))

		window.addEventListener('keyup', function(e){
			var code = fireFoxTable[e.keyCode] || e.keyCode
			var keyname = this.toKey[ code ]

			if( keyname ) this.emit(keyname, 0)
			var msg = {
				repeat: e.repeat,
				code: code,
				name: keyname
			}
			msg[msg.name] = 1
			
			if(special_key_hack){
				special_key_hack = false
				this.emit('down', msg)
			}

			this.emit('up', msg)

			if(code == this.toCode.tab || code == this.toCode.backspace){
				e.preventDefault()
			}

		}.bind(this))

		window.addEventListener('keypress', function(e){
			if(e.metaKey || e.altKey || e.ctrlKey) return

			var code = e.charCode
			if(code == 13 || e.keyCode == 13) code = 10 // make newlines unix defaults
			else if(e.charCode == 0) return
			var msg = {
				repeat: e.repeat,
				value: String.fromCharCode(code),
				char: code
			}
			this.emit('press', msg)
			e.preventDefault()
		}.bind(this))


		this.textarea = document.createElement('textarea')
		this.textarea.style.width = '0px'
		this.textarea.style.height = '0px'
		this.textarea.style.position = 'absolute'
		this.textarea.style.zIndex = -10000000
		document.body.appendChild(this.textarea)

		this.textarea.onpaste = function(e){
			var text = e.clipboardData.getData('text/plain')
			this._clipboard = text
			this.emit('paste', text)
		}.bind(this)

		Object.defineProperty(this, 'clipboard', {
			get:function(){
				return this._clipboard
			},
			set:function(value){
				this._clipboard = value
				this.textarea.value = value
				this.textarea.select()
				this.textarea.focus()
			}
		})
		this.textarea.focus()
	}
})
