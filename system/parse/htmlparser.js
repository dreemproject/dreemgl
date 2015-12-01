/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Simple and fast HTML Parser

define.class(function(require, exports){

	// Reserialize tries to turn the JS datastructure the parser outputs back into valid XML
	exports.reserialize = function(node, spacing, indent){
		if(spacing === undefined) spacing = '\t'
		var ret = ''
		var child = ''
		var nontextchild = false;
		if(node.child){
			for(var i = 0, l = node.child.length; i<l; i++){
				var sub = node.child[i]
				if(sub.tag !== '$text') nontextchild = true
				child += this.reserialize(sub, spacing, indent === undefined?'': indent + spacing)
			}
		}
		if(!node.tag) return child
		if(node.tag.charAt(0) !== '$'){
			ret += indent + '<' + node.tag
			var attr = node.attr
			if(attr) {
				for(var k in attr){
					var val = attr[k]
					if(ret[ret.length - 1] != ' ') ret += ' '
					ret += k
					var delim = "'"
					if(val !== 1){
						if(typeof val === 'string' && val.indexOf(delim) !== -1) delim = '"'
						ret += '=' + delim + val + delim
					}
				}
			}

			if(child) {
				if (!nontextchild) {
					ret += '>' + child + '</' + node.tag + '>\n'
				} else {
					ret += '>\n' + child + indent + '</' + node.tag + '>\n'
				}
			} else {
				ret += '/>\n'
			}
		}
		else{
			if(node.tag == '$text') ret += node.value
			else if(node.tag == '$cdata') ret += indent + '<![CDATA['+node.value+']]>\n'
			else if(node.tag == '$comment') ret += indent + '<!--' + node.value+'-->\n'
			else if(node.tag == '$root') ret += child
			else if(node.tag == '$empty') ret += Array(node.value - 1).join('\n')
		}
		return ret
	}

	exports.childrenByTagName = function(node, name, res){
		if(!res) res = []
		if (!node) return res;
		if(node.child){
			var idx = name.indexOf('/')
			var rest
			if(idx !== -1){
				rest = name.slice(idx + 1)
				name = name.slice(0, idx)
			}
			for(var i = 0, l = node.child.length; i<l; i++){
				var sub = node.child[i]
				if(sub.tag === name){
					if(rest !== undefined){
						exports.childrenByTagName(sub, rest, res)
					}
					else res.push(sub)
				}
			}
		}
		return res
	}

	exports.childByTagName = function(node, name){
		if(node.child){
			var idx = name.indexOf('/')
			var rest
			if(idx !== -1){
				rest = name.slice(idx + 1)
				name = name.slice(0, idx)
			}
			for(var i = 0, l = node.child.length; i<l; i++){
				var sub = node.child[i]
				if(sub.tag === name){
					if(rest !== undefined){
						return exports.childByTagName(sub, rest)
					}
					return sub
				}
			}
		}
	}

	exports.childByAttribute = function(node, name, value, tag){
		for(var i = 0, l = node.child.length; i<l; i++){
			var sub = node.child[i]
			if((tag === undefined || sub.tag == tag) && sub.attr && name in sub.attr){
				if(value === undefined) return sub
				else if(sub.attr[name] == value) return sub
			}
		}
	}

	this.__trace__  = 3

	exports.createChildNode = function(tag, parent){
		var node = this.createNode(tag,0)
		this.appendChild(parent, node)
		return node
	}

	exports.appendChild = 
	this.appendChild = function(node, value){
		var i = 0
		if(!node.child) node.child = [value]
		else node.child.push(value)
	}

	exports.createNode = 
	this.createNode = function(tag, charpos){
		return {tag:tag, pos: charpos}
	} 

	this.atError = function(message, where){
		this.errors.push({message:message, where:where})
	}

	var isempty = /^[\r\n\s]+$/ // discard empty textnodes

	/* Internal Called when encountering a textnode*/
	this.atText = function(value, start){
		if(!value.match(isempty)){
			var node = this.createNode('$text', start)
			node.value = this.processEntities(value, start)
			this.appendChild(this.node,node)
		}
		else{
			var node = this.createNode('$empty', start)
			node.value = value.split(/\n/).length
			this.appendChild(this.node,node)
		}
	}

	/* Internal Called when encountering a comment <!-- --> node*/
	this.atComment = function(value, start, end){
		var node = this.createNode('$comment', start)
		node.value = value
		this.appendChild(this.node, node)
	}

	/* Internal Called when encountering a CDATA <![CDATA[ ]]> node*/
	this.atCDATA = function(value, start, end){
		var node = this.createNode('$cdata', start)
		node.value = value
		this.appendChild(this.node, node)
	}

	/* Internal Called when encountering a <? ?> process node*/
	this.atProcess = function(value, start, end){
		var node = this.createNode('$process', start)
		node.value = value
		this.appendChild(this.node, node)
	}

	/* Internal Called when encountering a tag beginning <tag */
	this.atTagBegin = function(name, start, end){
		var newnode = this.createNode(name, start)

		this.appendChild(this.node, newnode)

		// push the state and set it
		this.parents.push(this.node, this.tagname, this.tagstart)
		this.tagstart = start
		this.tagname = name
		this.node = newnode
	}

	/* Internal Called when encountering a tag ending > */
	this.atTagEnd = function(start, end){
		this.last_attr = undefined
		if(this.self_closing_tags && this.tagname in this.self_closing_tags || this.tagname.charCodeAt(0) == 33){
			this.tagstart = this.parents.pop()
			this.tagname = this.parents.pop()
			this.node = this.parents.pop()
		}
	} 

	/* Internal Called when encountering a closing tag </tag> */
	this.atClosingTag = function(name, start, end){
		this.last_attr = undefined
		// attempt to match closing tag
		if(this.tagname !== name){
			this.atError('Tag mismatch </' + name + '> with <' + this.tagname+'>', start, this.tagstart)
		}
		// attempt to fix broken html
		//while(this.node && name !== undefined && this.tagname !== name && this.parents.length){
		// this.tagname = this.parents.pop()
		// this.node = this.parents.pop()
		//}
		if(this.parents.length){
			this.tagstart = this.parents.pop()
			this.tagname = this.parents.pop()
			this.node = this.parents.pop()
		}
		else{
			this.atError('Dangling closing tag </' + name + '>', start)
		}
	} 

	/* Internal Called when encountering a closing tag </close> */
	this.atImmediateClosingTag = function(start, end){
		this.atClosingTag(this.tagname, start)
	}

	/* Internal Called when encountering an attribute name name= */
	this.atAttrName = function(name, start, end){
		if(name == 'tag' || name == 'child'){
			this.atError('Attribute name collision with JSON structure'+name, start)
			name = '_' + name
		}
		this.last_attr = name
		if(this.node.attr && name in this.node.attr){
			this.atError('Duplicate attribute ' + name + ' in tag '+this.tagname, start)
		}
		if(!this.node.attr) this.node.attr = {}
		this.node.attr[this.last_attr] = null
	} 

	/* Internal Called when encountering an attribute value "value" */
	this.atAttrValue = function(val, start, end){
		if(this.last_attr === undefined){
			this.atError('Unexpected attribute value ' + val, start)
		}
		else{
			this.node.attr[this.last_attr] = this.processEntities(val, start)
		}
	} 

	// all magic HTML this closing tags. set this to undefined if you want XML behavior
	this.self_closing_tags = {
		'area':1, 'base':1, 'br':1, 'col':1, 'embed':1, 'hr':1, 'img':1, 
		'input':1, 'keygen':1, 'link':1, 'menuitem':1, 'meta':1, 'param':1, 'source':1, 'track':1, 'wbr':1
	}

	// todo use these
	var entities = {
		"amp":38,"gt":62,"lt":60,"quot":34,"apos":39,"AElig":198,"Aacute":193,"Acirc":194,
		"Agrave":192,"Aring":197,"Atilde":195,"Auml":196,"Ccedil":199,"ETH":208,"Eacute":201,"Ecirc":202,
		"Egrave":200,"Euml":203,"Iacute":205,"Icirc":206,"Igrave":204,"Iuml":207,"Ntilde":209,"Oacute":211,
		"Ocirc":212,"Ograve":210,"Oslash":216,"Otilde":213,"Ouml":214,"THORN":222,"Uacute":218,"Ucirc":219,
		"Ugrave":217,"Uuml":220,"Yacute":221,"aacute":225,"acirc":226,"aelig":230,"agrave":224,"aring":229,
		"atilde":227,"auml":228,"ccedil":231,"eacute":233,"ecirc":234,"egrave":232,"eth":240,"euml":235,
		"iacute":237,"icirc":238,"igrave":236,"iuml":239,"ntilde":241,"oacute":243,"ocirc":244,"ograve":242,
		"oslash":248,"otilde":245,"ouml":246,"szlig":223,"thorn":254,"uacute":250,"ucirc":251,"ugrave":249,
		"uuml":252,"yacute":253,"yuml":255,"copy":169,"reg":174,"nbsp":160,"iexcl":161,"cent":162,"pound":163,
		"curren":164,"yen":165,"brvbar":166,"sect":167,"uml":168,"ordf":170,"laquo":171,"not":172,"shy":173,
		"macr":175,"deg":176,"plusmn":177,"sup1":185,"sup2":178,"sup3":179,"acute":180,"micro":181,"para":182,
		"middot":183,"cedil":184,"ordm":186,"raquo":187,"frac14":188,"frac12":189,"frac34":190,"iquest":191,
		"times":215,"divide":247,"OElig":338,"oelig":339,"Scaron":352,"scaron":353,"Yuml":376,"fnof":402,
		"circ":710,"tilde":732,"Alpha":913,"Beta":914,"Gamma":915,"Delta":916,"Epsilon":917,"Zeta":918,
		"Eta":919,"Theta":920,"Iota":921,"Kappa":922,"Lambda":923,"Mu":924,"Nu":925,"Xi":926,"Omicron":927,
		"Pi":928,"Rho":929,"Sigma":931,"Tau":932,"Upsilon":933,"Phi":934,"Chi":935,"Psi":936,"Omega":937,
		"alpha":945,"beta":946,"gamma":947,"delta":948,"epsilon":949,"zeta":950,"eta":951,"theta":952,
		"iota":953,"kappa":954,"lambda":955,"mu":956,"nu":957,"xi":958,"omicron":959,"pi":960,"rho":961,
		"sigmaf":962,"sigma":963,"tau":964,"upsilon":965,"phi":966,"chi":967,"psi":968,"omega":969,
		"thetasym":977,"upsih":978,"piv":982,"ensp":8194,"emsp":8195,"thinsp":8201,"zwnj":8204,"zwj":8205,
		"lrm":8206,"rlm":8207,"ndash":8211,"mdash":8212,"lsquo":8216,"rsquo":8217,"sbquo":8218,"ldquo":8220,
		"rdquo":8221,"bdquo":8222,"dagger":8224,"Dagger":8225,"bull":8226,"hellip":8230,"permil":8240,
		"prime":8242,"Prime":8243,"lsaquo":8249,"rsaquo":8250,"oline":8254,"frasl":8260,"euro":8364,
		"image":8465,"weierp":8472,"real":8476,"trade":8482,"alefsym":8501,"larr":8592,"uarr":8593,
		"rarr":8594,"darr":8595,"harr":8596,"crarr":8629,"lArr":8656,"uArr":8657,"rArr":8658,"dArr":8659,
		"hArr":8660,"forall":8704,"part":8706,"exist":8707,"empty":8709,"nabla":8711,"isin":8712,
		"notin":8713,"ni":8715,"prod":8719,"sum":8721,"minus":8722,"lowast":8727,"radic":8730,"prop":8733,
		"infin":8734,"ang":8736,"and":8743,"or":8744,"cap":8745,"cup":8746,"int":8747,"there4":8756,"sim":8764,
		"cong":8773,"asymp":8776,"ne":8800,"equiv":8801,"le":8804,"ge":8805,"sub":8834,"sup":8835,"nsub":8836,
		"sube":8838,"supe":8839,"oplus":8853,"otimes":8855,"perp":8869,"sdot":8901,"lceil":8968,"rceil":8969,
		"lfloor":8970,"rfloor":8971,"lang":9001,"rang":9002,"loz":9674,"spades":9824,"clubs":9827,"hearts":9829,
		"diams":9830
	}

	var entity_rx = new RegExp("&("+Object.keys(entities).join('|')+");|&#([0-9]+);|&x([0-9a-fA-F]+);","g")

	/* Internal Called when processing entities */
	this.processEntities = function(value, start){
		if(typeof value != 'string') value = new String(value)

		return value.replace(entity_rx, function(m, name, num, hex, off){
			if(name !== undefined){
				if(!(name in entities)){
					this.error('Entity not found &'+m, start + off)
					return m
				}
				String.fromCharCode(entities[name])
			}
			else if(num !== undefined){
				return String.fromCharCode(parseInt(num))
			}
			else if(hex !== undefined){
				return String.fromCharCode(parseInt(hex, 16))
			}
		})
	}

	/**
	 * @method parse
	 * Parse an XML/HTML document, returns JS object structure that looks like this
	 * The implemented object serialization has one limitation: dont use attributes named
	 * 'tag' and 'child' and dont use tags starting with $sign: <$tag>
	 * You cant use the attribute name 'tag' and 'child'
	 * each node is a JSON-stringifyable object
	 * the following XML
	 *
	 * <tag attr='hi'>mytext</tag>
	 *
	 * becomes this JS object:
	 * { 
	 *   tag:'$root'
	 *   child:[{
	 *     tag:'mytag'
	 *     attr:'hi'
	 *     child:[{
	 *       tag:'$text'
	 *       value:'mytext'
	 *     }]
	 *   }]
	 * }
	 *
	 * @param {String} input XML/HTML
	 * @return {Object} JS output structure
	 * this.errors[] is array of [errormsg,erroroffset,errormsg,erroroffset]
	 * You will always get the JS object as far as it managed to parse
	 * So check parserobj.errors.length after for errorhandling
	 *
	 */

	this.atConstructor = function(data){
		if(arguments.length) return this.parse(data)
	}

	this.parse = function(source){
		// lets create some state
		var root = this.node = this.createNode('$root',0)

		this.errors = []
		this.parents = []
		this.last_attr = undefined
		this.tagname = ''

		if(typeof source != 'string') source = source.toString()
		var len = source.length
		var pos = 0
		var start = pos
		while(pos < len){
			var ch = source.charCodeAt(pos++)
			if(ch == 60){ // <
				var next = source.charCodeAt(pos)
				if(next == 32 || next == 9 || next == 10 || next == 12 || next ==  37 || 
					next == 40 || next == 41 || next == 45 || 
					next == 35 || next == 36 || next == 92 || next == 94 || 
					(next >=48 && next <= 57)) continue
				// lets emit textnode since last
				if(start != pos - 1){
					this.atText(source.slice(start, pos - 1), start, pos - 1)
				}
				if(next == 33){ // <!
					after = source.charCodeAt(pos+1)
					if(after == 45){ // <!- comment
						pos += 2
						start = pos
						while(pos < len){
							ch = source.charCodeAt(pos++)
							if(ch == 45 && source.charCodeAt(pos) == 45 &&
									source.charCodeAt(pos + 1) == 62){
								pos += 2
								this.atComment(source.slice(start + 1, pos - 3), start, pos)
								//console.log(source.slice(start + 1, pos - 3))
								break
							}
							else if(pos == len) this.atError("Unexpected end of files while reading <!--", start)
						}
						start = pos
						continue
					}
					if(after == 91){ // <![ probably followed by CDATA[ just parse to ]]>
						start = pos
						pos += 8
						while(pos < len){
							ch = source.charCodeAt(pos++)
							if(ch == 93 && source.charCodeAt(pos) == 93 &&
									source.charCodeAt(pos + 1) == 62){
								pos += 2
								this.atCDATA(source.slice(start + 8, pos - 3), start, pos)
								break
							}
							else if(pos == len) this.atError("Unexpected end of file while reading <![", start)
						}
						start = pos
						continue
					}
				}
				if(next == 63){ // <? command
					pos++
					start = pos
					while(pos < len){
						ch = source.charCodeAt(pos++)
						if(ch == 63 && source.charCodeAt(pos) == 62){
							pos++
							this.atProcess(source.slice(start, pos - 2), start - 1, pos)
							break
						}
						else if(pos == len) this.atError("Unexpected end of file while reading <?", start)
					}
					start = pos
					continue
				}
				if(next == 47){ // </ closing tag
					start = pos + 1
					while(pos < len){
						ch = source.charCodeAt(pos++)
						if(ch == 62){
							this.atClosingTag(source.slice(start, pos - 1), start, pos)
							break
						}
						else if(pos == len) this.atError("Unexpected end of file at </"+source.slice(start, pos), start)
					}
					start = pos
					continue
				}
				
				start = pos // try to parse a tag
				var tag = true // first name encountered is tagname
				while(pos < len){
					ch = source.charCodeAt(pos++)
					// whitespace, end of tag or assign
					// if we hit a s
					if(ch == 9 || ch == 10 || ch == 12 || ch == 13 || ch ==32 || ch == 47 || ch == 61 || ch == 62){
						if(start != pos - 1){
							if(tag){ // lets emit the tagname
								this.atTagBegin(source.slice(start, pos - 1), start - 1, pos)
								tag = false
							}// emit attribute name
							else this.atAttrName(source.slice(start, pos - 1), start, pos)
						}
						start = pos
						if(ch == 62){ // >
							this.atTagEnd(pos)
							break
						}
						else if(ch == 47 && source.charCodeAt(pos) == 62){ // />
							pos++
							this.atImmediateClosingTag(pos)
							break
						}
					}
					else if(ch == 34 || ch == 39){ // " or '
						start = pos
						var end = ch
						while(pos < len){
							ch = source.charCodeAt(pos++)
							if(ch == end){
								this.atAttrValue(source.slice(start, pos - 1), start, pos)
								break
							}
							else if(pos == len) this.atError("Unexpected end of file while reading attribute", start)
						}
						start = pos
					}
					else if(ch == 60) this.atError("Unexpected < while parsing a tag", start)
				}
				start = pos
			}
		}
		if(this.parents.length) this.atError("Missign closing tags at end", pos)
		return root
	}
})