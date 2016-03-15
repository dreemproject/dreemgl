/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

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
		93:'meta',
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
		this.defineAttribute(key, Config({type:int, value:0}))
	}

	var fireFoxTable = {
		91:93,
		92:93,
		224:93, // right meta
		61:187, // equals
		173:189, // minus
		59:186 // semicolon
	}

	this.atConstructor = function(){

		var special_key_hack = false

		this.checkSpecialKeys = function(e){
			if(e.shift !== this._shift?true:false) this.shift = e.shiftKey?1:0
			if(e.altKey !== this._alt?true:false) this.alt = e.altKey?1:0
			if(e.ctrlKey !== this._ctrl?true:false) this.ctrl = e.ctrlKey?1:0
			if(e.metaKey !== this._meta?true:false) this.meta = e.metaKey?1:0
		}
		var is_keyboard_cut = false
		var is_keyboard_all = false
		var keydown = function(e){
			var code = fireFoxTable[e.keyCode] || e.keyCode
			// we go into special mode
			if(e.keyCode == 229){
				special_key_hack = true
				return e.preventDefault()
			}
			var keyname = this.toKey[ code ]

			is_keyboard_cut = keyname === 'x' && (this._meta || this._ctrl)
			is_keyboard_all = keyname === 'a' && (this._meta || this._ctrl)

			if( keyname ) this[keyname] = 1

			this.checkSpecialKeys(e)

			var msg = {
				repeat: e.repeat,
				code: code,
				name: keyname,
				shift:this._shift,
				meta: this._meta,
				ctrl: this._ctrl,
				alt: this._alt
			}

			this.emit('down', msg)

			if( (this._ctrl  || this._meta) && this._y ||
				//(this._ctrl  || this._meta) && this._c ||
				//(this._ctrl  || this._meta) && this._v ||
				this._tab ||
				this._leftarrow ||
				this._rightarrow ||
				this._uparrow ||
				this._downarrow ||
				this._backspace ||
				this._delete){
				if(e.preventDefault) e.preventDefault()
			}
			is_keyboard_cut = false
			is_keyboard_all = false
		}.bind(this)

		var keyup = function(e){
			var code = fireFoxTable[e.keyCode] || e.keyCode
			var keyname = this.toKey[ code ]

			if( keyname ) this[keyname] = 0

			this.checkSpecialKeys(e)

			var msg = {
				repeat: e.repeat,
				code: code,
				name: keyname,
				shift:this._shift,
				meta: this._meta,
				ctrl: this._ctrl,
				alt: this._alt
			}

			if(special_key_hack){
				special_key_hack = false
				this.emit('down', msg)
			}

			this.emit('up', msg)

		}.bind(this)
		//window.addEventListener('keyup',
		//window.addEventListener('keypress',
		var keypress = function(e){
			if(e.metaKey || e.altKey || e.ctrlKey) return

			var code = e.charCode
			if(code == 13 || e.keyCode == 13) code = 10 // make newlines unix defaults
			else if(e.charCode == 0) return
			var msg = {
				repeat: e.repeat,
				value: String.fromCharCode(code),
				code: code
			}
			this.emit('press', msg)
			e.preventDefault()
		}.bind(this)
		// lets output a css

		this.textAreaRespondToMouse = function(pos){
			this.textarea.focus()
			//this.textarea.style.left = pos[0] - parseFloat(this.textarea.style.width) * 0.5
			//this.textarea.style.top = pos[1] - parseFloat(this.textarea.style.height) * 0.5
		}

		this.textarea = document.createElement('textarea')
		this.textarea.style.width = '1'
		this.textarea.style.height = '1'
		this.textarea.style.position = 'absolute'
		// this.textarea.style.pointerEvents = 'none'
		// this.textarea.style.display = 'none'
		//this.textarea.style.background = 'red'
		this.textarea.setAttribute('autocomplete',"off")
		this.textarea.setAttribute('autocorrect',"off")
		this.textarea.setAttribute('autocapitalize',"off")
		this.textarea.setAttribute('spellcheck',"false")

		this.textarea.addEventListener('keyup', keyup)
		this.textarea.addEventListener('keypress', keypress)
		this.textarea.addEventListener('keydown', keydown)
		this.textarea.focus()
		this.textarea.style.zIndex = 10000000

		var style = document.createElement('style');
    	style.innerHTML = "\n\
    	::selection { background:transparent; color:transparent; }\n\
    	textarea{\n\
    	  	opacity: 0;\n\
		    background: transparent;\n\
		    -moz-appearance: none;\n\
		    appearance: none;\n\
		    border: none;\n\
		    resize: none;\n\
		    outline: none;\n\
		    overflow: hidden;\n\
		    font: inherit;\n\
		    padding: 0 1px;\n\
		    margin: 0 -1px;\n\
		    text-indent: 1em;\n\
		    -ms-user-select: text;\n\
		    -moz-user-select: text;\n\
		    -webkit-user-select: text;\n\
		    user-select: text;\n\
		    white-space: pre!important;\n\
    		\n\
    	}\n\
    	textarea:focus{\n\
    		outline:0px !important;\n\
    		-webkit-appearance:none;\n\
    	}"
    	document.body.appendChild(style)

		document.body.appendChild(this.textarea)

		// put together a fake keypress on cut
		this.textarea.oncut = function(e){
			if(!is_keyboard_cut){
				// lets send a keyboard cut event
				keydown({
					keyCode: 88,
					metaKey: true,
				})
				keyup({
					keyCode: 88,
					metaKey: true,
				})
			}
		}

		this.textarea.addEventListener('select',function(e){
			if(!is_keyboard_all && this.textarea.selectionEnd === this.textarea.value.length){
				keydown({
					keyCode: 65,
					metaKey: true,
				})
				keyup({
					keyCode: 65,
					metaKey: true,
				})
			}
		}.bind(this))

		this.textarea.onpaste = function(e){
			var text = e.clipboardData.getData('text/plain')
			this._clipboard = text
			this.emit('paste', {text:text})
		}.bind(this)

		Object.defineProperty(this, 'clipboard', {
			get:function(){
				return this._clipboard
			},
			set:function(value){
				this._clipboard = value
				this.textarea.value = value + ' '
				this.textarea.selectionStart = 0
		        this.textarea.selectionEnd = value.length
				this.textarea.focus()
			}
		})
		this.textarea.focus()
	}
})
