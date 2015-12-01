/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Mouse class

define.class('$system/base/keyboard', function (require, exports, self){
	
	this.toKey = { // slap a usable name on keys
		8:'backspace',9:'tab',13:'enter',340:'shift',344:'shift',341:'ctrl',345:'ctrl',342:'alt',346:'alt',
		19:'pause',20:'caps',27:'escape',
		32:'space',266:'pgup',267:'pgdn',
		269:'end',268:'home',263:'leftarrow',265:'uparrow',262:'rightarrow',264:'downarrow',
		45:'insert',261:'delete',
		48:'num0',49:'num1',50:'num2',51:'num3',52:'num4',
		53:'num5',54:'num6',55:'num7',56:'num8',57:'num9',
		65:'a',66:'b',67:'c',68:'d',69:'e',70:'f',71:'g',
		72:'h',73:'i',74:'j',75:'k',76:'l',77:'m',78:'n',
		79:'o',80:'p',81:'q',82:'r',83:'s',84:'t',85:'u',
		86:'v',87:'w',88:'x',89:'y',90:'z',

		343:'leftmeta',348:'rightmeta',
		96:'pad0',97:'pad1',98:'pad2',99:'pad3',100:'pad4',101:'pad5',
		102:'pad6',103:'pad7',104:'pad8',105:'pad9',
		106:'multiply',107:'add',109:'subtract',110:'decimal',111:'divide',

		290:'f1',291:'f2',292:'f3',293:'f4',294:'f5',295:'f6',
		296:'f7',297:'f8',298:'f9',299:'f10',300:'f11',301:'f12',

		144:'numlock',145:'scrollock',186:'semicolon',187:'equals',188:'comma',
		189:'dash',190:'period',191:'slash',192:'accent',219:'openbracket',
		220:'backslash',221:'closebracket',222:'singlequote',
	}
	this.toCode = {}
	for(var k in this.toKey){
		var key = this.toKey[ k ]
		this.toCode[key] = k
		if(!this.isAttribute(key))
			this.defineAttribute(key, {type:int})
	}

	this.atConstructor = function(device){
		var document = device.document

		
		document.on('keydown', function(e){
			var code = e.which>255?e.which:e.keyCode
			var keyname = this.toKey[ code ]
			if( keyname ) this[keyname] = 1
			var msg = {
				repeat: e.repeat,
				code: code,
				name: keyname
			}
			msg[msg.name] = 1
			
			this.emit('down', msg)
		}.bind(this))

		document.on('keyup', function(e){
			var code = e.which>255?e.which:e.keyCode
			var keyname = this.toKey[ code ]

			if( keyname ) this[keyname] = 0
			var msg = {
				repeat: e.repeat,
				code: code,
				name: keyname
			}
			msg[msg.name] = 1
			
			this.emit('up', msg)

		}.bind(this))
	}

})
