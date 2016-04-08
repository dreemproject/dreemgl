/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require,
		$ui$, view, icon, treeview, cadgrid, foldcontainer, label, button, scrollbar, textbox, numberbox, splitcontainer, menubar,
		$widgets$, palette, propviewer, searchbox, jseditor,
		$server$, sourceset, dataset,
		$system$parse$, astscanner,
		$$, aboutdialog, docviewerdialog, newcompositiondialog, opencompositiondialog, renamedialog,  library, dockpanel, block, connection) {

	this.name = 'flowgraph'
	this.flex = 1
	this.clearcolor = "#565656"
	this.bgcolor = "#565656"
	this.flexdirection = "column"

	this.attributes = {
		sourceset:{},
		inspect:Config({type:Object})
	}

	define.class(this, "selectorrect", view, function() {

		this.bordercolorfn = function(pos) {
			var check = (int(mod(0.20 * (gl_FragCoord.x + gl_FragCoord.y + time * 40.),2.)) == 1)? 1.0: 0.0
			return vec4(check * vec3(0.8), 1)
		}

		this.bordercolor = vec4(1, 1, 1, 0.4)
		this.borderwidth = 2
		this.bgcolor = vec4(1, 1, 1, 0.07)
		this.borderradius = 2
		this.position = "absolute"
		this.visible = false
	})

	this.addToSelection = function(obj) {
		var f = this.currentselection.indexOf(obj)
		if (f == -1) this.currentselection.push(obj)
		else return

		this.updateSelectedItems()

		if (this.currentselection.length > 1) return false
		return true
	}

	this.removeFromSelection = function(obj) {
		if (this.currentblock == obj) {
			this.currentblock = undefined
			this.updatePopupUIPosition()
		}

		var f = this.currentselection.indexOf(obj)
		if (f > -1) this.currentselection.splice(f,1)

		this.updateSelectedItems()
	}

	this.updateSelectedItems = function() {
		for (var a in this.allblocks) {
			var obj = this.allblocks[a]
			var f = this.currentselection.indexOf(obj)
			var newval = 0
			if (f > -1) newval = 1
			if (obj._inselection != newval) obj.inselection = newval
		}
		for (var a in this.allconnections) {
			var obj = this.allconnections[a]
			var f = this.currentselection.indexOf(obj)
			var newval = 0
			if (f > -1) newval = 1
			if (obj._inselection != newval) obj.inselection = newval
		}
		this.updatePopupUIPosition()
	}

	this.inSelection = function(obj) {
		var f = this.currentselection.indexOf(obj)
		if (f > -1) return true
		return false
	}

	this.setupSelectionMove = function() {
		for (var a in this.currentselection) {
			var obj = this.currentselection[a]
			obj.setupMove()
		}
	}

	this.moveSelected = function(dx, dy, store) {
		var snap = 1
		for (var a in this.currentselection) {
			var obj = this.currentselection[a]
			obj.updateMove(dx, dy, snap)
		}

		if (store) {
			this.sourceset.fork(function() {
				for (var a in this.currentselection) {
					var obj = this.currentselection[a]
					if (!(obj instanceof block)) continue
					var flowdata = obj.flowdata
					flowdata.x = obj.pos[0]
					flowdata.y = obj.pos[1]
					this.sourceset.setFlowData(obj.name, flowdata)
				}
			}.bind(this))
		}

		this.updateConnections()
		this.updatePopupUIPosition()
	}

	this.clearSelection = function(update) {
		this.currentblock = undefined
		this.currentconnection = undefined
		this.currentselection = []
		if (update) this.updateSelectedItems()
	}

	this.addBlock = function(folder, blockname) {
		this.sourceset.fork(function() {
			this.sourceset.addBlock(undefined, blockname)
		}.bind(this))
	}

	this.removeBlock = function (block) {
		if (block == undefined) block = this.currentblock
		if (block) {
			this.sourceset.fork(function() {
				this.sourceset.removeBlock(block.name)
			}.bind(this))
			this.removeFromSelection(block)
			this.setActiveBlock(undefined)
			this.updateSelectedItems()
			this.updatePopupUIPosition()
		}
	}

	this.removeConnection = function (conn) {
		if (conn == undefined) conn = this.currentconnection
		if (conn) {
			this.sourceset.fork(function() {
				this.sourceset.deleteWire(
					conn.from,
					conn.fromoutput,
					conn.to,
					conn.toinput
				)
			}.bind(this))
			this.removeFromSelection(conn)
			this.setActiveConnection(undefined)
			this.updateSelectedItems()
			this.updatePopupUIPosition()
		}
	}

	this.updatePopupUIPosition = function() {
		var bg = this.findChild("blockui")
		var cg = this.findChild("connectionui")
		var gg = this.findChild("groupui")
		var gbg = this.findChild("groupbg")

		gbg.visible =false
		gg.visible = false
		bg.visible = false

		return
		// TODO - decide if the group UI is needed at all..

		if (this.currentselection.length == 1) {

			gg.visible = false
			gbg.visible = false
			this.currentblock = undefined
			this.currentconnection = undefined

			var b = this.currentselection[0]

			if (b instanceof block) this.currentblock = b
			if (b instanceof connection) this.currentconnection  = b

			if (this.currentblock) {
				bg.x = this.currentblock.pos[0]
				bg.y = this.currentblock.pos[1]-bg.layout.height - 3
				bg.visible = true
			} else {
				bg.visible = false
			}

			if (this.currentconnection) {
				cg.x = (this.currentconnection.frompos[0] + this.currentconnection.topos[0])/2
				cg.y = (this.currentconnection.frompos[1] + this.currentconnection.topos[1])/2
				cg.visible = true
			} else {
				cg.visible = false
			}
		} else {
			cg.visible = false
			bg.visible = false
			if (this.currentselection.length > 1) {
				gg.visible = true
				gbg.visible = true
				var minx = 10000
				var maxx = -10000
				var miny = 10000
				var maxy = -10000
				var cx = 0
				var cy = 0
				var n = 0
				for (var a in this.currentselection) {
					var bl = this.currentselection[a]
					if (bl instanceof block) {
						n++
						if (bl.pos[0] < minx) minx = bl.pos[0];else if (bl.pos[0]>maxx) maxx = bl.pos[0]
						if (bl.pos[1] < miny) miny = bl.pos[1];else if (bl.pos[1]>maxy) maxy = bl.pos[1]

						var x2 = bl.pos[0] + bl.layout.width
						var y2 = bl.pos[1] + bl.layout.height
						if (x2 < minx) minx = x2; else if (x2 > maxx) maxx = x2
						if (y2 < miny) miny = y2; else if (y2 > maxy) maxy = y2


						cx += bl.pos[0] + bl.layout.width/2
						cy += bl.pos[1] + bl.layout.height/2
					} else {
						if (bl instanceof connection) {
							var ax = bl.frompos[0]
							var ay = bl.frompos[1]

							var bx = bl.topos[0]
							var by = bl.topos[1]

							if (ax > maxx) maxx = ax; else if (ax < minx) minx = ax
							if (bx > maxx) maxx = bx; else if (bx < minx) minx = bx
							if (ay > maxy) maxy = ay; else if (ay < miny) miny = ay
							if (by > maxy) maxy = by; else if (by < miny) miny = by

							cx += (ax + bx) / 2
							cy += (ay + by) / 2
							n++
						}
					}
				}
				cx /= n
				cy /= n

				gg.pos = vec2(cx - cg.layout.width/2, cy - cg.layout.height/2)

				gbg.pos = vec2(minx-20,miny-20)
				gbg.size = vec2(maxx-minx + 40, maxy-miny+ 40)

			} else {
				gg.visible = false
				gbg.visible = false
			}
		}
	}

	this.setActiveBlock = function(block) {
		this.currentblock = block
		if (block) {
			this.currentconnection = undefined
			this.addToSelection(block)
		}
		this.updatePopupUIPosition()
	}

	this.setActiveConnection = function(conn) {
		this.currentconnection = conn
		if (conn) {
			this.currentblock = undefined
			this.addToSelection(conn)
		}
		this.updatePopupUIPosition()
	}

	this.updateConnections = function() {
		var cl = this.find("connectionlayer")
		for (var a in cl.children) {
			cl.children[a].calculateposition()
			//cl.children[a].layout = 1
		}
	}

	this.init = function() {
		this.screen.onstatus = function() {
			var menu = this.find("themenu")
			if (menu) {
				menu.statustext = this.screen.status
			}
		}
		this.currentselection = []
		this.currentblock = undefined
		this.currentconnection = undefined
		this.allblocks = []
		this.allconnections = []
		this.newconnection = {}
		this.model = dataset({
			children:[
				{name:"Role"},
				{name:"Server"}
			],
			name:"Composition"
		})
		this.librarydata = dataset({children:[]})

		this.sourceset = sourceset()

		//this.rpc.fileio.readFlowLibrary(['@/\\.','.git', '.gitignore']).then(function(result) {
		//	var tree = result.value
		//	tree.name = 'Library'
		//	tree.collapsed = false
        //
		//	var lib = this.find('thelibrary')
		//	if (lib) {
		//		lib.dataset = this.librarydata  = dataset(tree)
		//	} else {
		//		this.librarydata  = dataset(tree)
		//	}
		//}.bind(this))


		this.rpc.fileio.readFlowLibrary(['@/\\.','.git', '.gitignore']).then(function(result) {
		}.bind(this))

		this.screen.locationhash = function(event) {
			if (event.value.composition) {
				// ok lets put it in define.js
				require.async(event.value.composition).then(function(result) {
					define.ignore_reload[define.expandVariables(event.value.composition)] = true
					this.sourceset.parse(result)
					// console.log('>>', this.sourceset.ast)
					// write it back to disk
					this.sourceset.onchange = function() {
						this.rpc.fileio.saveComposition(event.value.composition, this.sourceset.last_source)
					}.bind(this)

					var viewer = this.find('jsviewer')
					if (viewer) {
						viewer.sourceset = this.sourceset
					}

					var lib = this.find('thelibrary')
					if (lib) {
						var children = [];
						var defs = this.sourceset.ast.steps[0].params;

						var category;
						for (var i=0;i<defs.length;i++) {
							var def = defs[i];
							var name = def.id.name;
							if (name[name.length - 1] === '$') {
								category = {
									name:name,//.substring(1, name.length).replace(/\$/g, "/"),
									children:[]
								};
								children.push(category);
							} else if (category) {
								category.children.push({name:name + ".js"})
							}
						}

						lib.dataset = this.librarydata = dataset({children:children})
					}

				}.bind(this))
			}
		}.bind(this)

		this.rpc.fileio.readAllPaths(['resources','server.js','resources','cache','@/\\.','.git', '.gitignore']).then(function(result) {
			var filetree = this.find('filetree')
				var tree = result.value
				tree.collapsed = false
				// lets make a dataset
		}.bind(this))
	}

	// right before the recalculateMatrix call
	this.atMatrix = function() {
		this.updateConnections()
	}

	this.updateZoom = function(z) {}

	this.gridDrag = function(event) {
		var cg = this.find("centralconstructiongrid")
		var fg = this.find("flowgraph")
		var sq = this.findChild("selectorrect")
		var min = cg.globalToLocal(event.min)
		var max = cg.globalToLocal(event.max)
		if (sq) {
			sq.visible = true
			sq.redraw()
			sq.pos = vec2(min[0],min[1])
			sq.size = vec3(max[0] - min[0], max[1] - min[1], 1)
			fg.dragselectset = []
			for (var a in fg.allblocks) {
				var bl = fg.allblocks[a]

				cx = bl.pos[0] + bl.layout.width/2
				cy = bl.pos[1] + bl.layout.height/2

				if (cx >= min[0] && cx <= max[0] && cy >= min[1] && cy <=max[1]) {
					bl.inselection = 1
					fg.dragselectset.push(bl)
				} else {
					if (fg.originalselection.indexOf(bl) >-1) {
						bl.inselection = 1
					} else {
						bl.inselection = 0
					}
				}
			}

			for (var a in fg.allconnections) {
				var con = fg.allconnections[a]
				ax = con.frompos[0]
				ay = con.frompos[1]
				bx = con.topos[0]
				by = con.topos[1]

				cx = (ax+bx)/2
				cy = (ay+by)/2

				if ( (ax >= min[0] && ax <= max[0] && ay >= min[1] && ay <=max[1])
						||
					(bx >= min[0] && bx <= max[0] && by >= min[1] && by <=max[1])
					||
					(cx >= min[0] && cx <= max[0] && cy >= min[1] && cy <=max[1])
					)
				{
					con.inselection = 1
					fg.dragselectset.push(con)
				} else {
					if (fg.originalselection.indexOf(con) >-1) {
						con.inselection = 1
					} else {
						con.inselection = 0
					}
				}
			}
		}
	}

	this.gridDragStart = function() {
		this.cancelConnection()
		this.startDragSelect()
	}

	this.gridDragEnd = function() {
		var sq = this.findChild("selectorrect")
		if (sq) {
			sq.visible = false
			sq.redraw()
		}
		this.find("flowgraph").commitdragselect()
	}

	this.updateConnector = function(ev) {
		var connectingconnection = this.find("openconnector")
		if (connectingconnection && connectingconnection.ready) {
		  if (connectingconnection.to === "undefined") {
			  connectingconnection.topos = this.find("centralconstructiongrid").globalToLocal(ev.position);
			  connectingconnection.visible = true
			  connectingconnection.redraw();
		  } else if (connectingconnection.from === "undefined") {
			  connectingconnection.frompos = this.find("centralconstructiongrid").globalToLocal(ev.position);
			  connectingconnection.visible = true
			  connectingconnection.redraw();
		  }
		}
	}

	this.makeNewConnection = function() {

		this.sourceset.fork(function(src) {

			var inserted = src.insertWire(this.newconnection.sourceblock,
				this.newconnection.sourceoutput,
				this.newconnection.targetblock,
				this.newconnection.targetinput);

			if (!inserted) {

				src.deleteWire(
					this.newconnection.sourceblock,
					this.newconnection.sourceoutput,
					this.newconnection.targetblock,
					this.newconnection.targetinput
				)

				src.createWire(
					this.newconnection.sourceblock,
					this.newconnection.sourceoutput,
					this.newconnection.targetblock,
					this.newconnection.targetinput
				)

			}
		}.bind(this))

		this.cancelConnection()
	}

	this.setBlockName = function(block, newname) {

		//TODO fix all the wires that will break when you do this!

		this.sourceset.fork(function(src) {
			var ast = new astscanner(block.nodeprops,[{type:"Property", name:"name"}])
			var value;
			if (ast.atindex > -1 && ast.atparent && ast.atparent.keys) {
				var found = ast.atparent.keys[ast.atindex]
				if (found && found.value) {
					value = found.value;
					value.raw = '"' + newname + '"';
					value.value = newname
				}
			} else {
				ast.at.keys.push({
					key:{
						type:"Property",
						name:"name"
					},
					value:{
						type:"Value",
						kind:"string",
						raw:'"' +  newname + '"',
						value: newname
					}})
			}
		})

	}

	this.cancelConnection = function() {
		console.log("cancelling exiting connection setup...")
		this.newconnection = {}

		var connectingconnection = this.find("openconnector")
		if (connectingconnection && (connectingconnection.ready || connectingconnection.visible)) {
			connectingconnection.from = undefined
			connectingconnection.fromoutput  = undefined
			connectingconnection.to = undefined
			connectingconnection.toinput = undefined
			connectingconnection.visible = false
			connectingconnection.ready = false
			connectingconnection.calculateposition()
			connectingconnection.redraw()
		}
	}

	this.setupConnectionPointerMove = function() {
		console.log("setting up new connection drag...")

		var connectingconnection = this.find("openconnector")
		if (connectingconnection) {
			connectingconnection.ready = true;
			connectingconnection.from = this.newconnection.sourceblock
			connectingconnection.fromoutput = this.newconnection.sourceoutput
			connectingconnection.to = this.newconnection.targetblock
			connectingconnection.toinput = this.newconnection.targetinput

			//console.log(this.newconnection.targetblock,this.newconnection.sourceoutput,this.newconnection.targetblock,this.newconnection.targetinput)

			if (connectingconnection.to && connectingconnection.to !== "undefined" && connectingconnection.to.length > 0) {
				//console.log("setting to??", connectingconnection.to)
				var b = this.find(connectingconnection.to)
				if (b) {
					var ball = b.findChild(connectingconnection.toinput)
					connectingconnection.bgcolor = ball.bgcolor
				}
			} else {
				if (connectingconnection.from && connectingconnection.from !== "undefined"&& connectingconnection.from.length > 0) {
					//console.log(connectingconnection.from)
					var b = this.find(connectingconnection.from)
					if (b) {
						var ball = b.findChild(connectingconnection.fromoutput)
						connectingconnection.bgcolor = ball.bgcolor
					}
				}
			}
			connectingconnection.calculateposition()
		}
	}

	this.setConnectionStartpoint = function(sourceblockname, outputname) {
		this.newconnection.sourceblock = sourceblockname
		this.newconnection.sourceoutput = outputname
		if (this.newconnection.targetblock && this.newconnection.targetblock !== "undefined" ) {
			this.makeNewConnection()
		} else {
			this.setupConnectionPointerMove()
		}
	}

	this.setConnectionEndpoint = function(targetblockname, inputname) {
		//console.log(targetblockname, inputname)
		this.newconnection.targetblock = targetblockname
		this.newconnection.targetinput = inputname
		if (this.newconnection.sourceblock && this.newconnection.sourceblock !== "undefined" ) {
			this.makeNewConnection()
		} else {
			this.setupConnectionPointerMove()
		}
	}

	this.startDragSelect = function() {
		this.dragselectset = []
		if (!this.screen.keyboard.shift) {
			this.clearSelection(true)
		}
		this.originalselection =[]
		for (var i in this.currentselection) {
			this.originalselection.push(this.currentselection[i])
		}
	}

	this.renderConnections = function() {
		if (!this.sourceset) return
		if (!this.sourceset.data) return
		var res = []
		for (var i = 0; i < this.sourceset.data.children.length; i++) {
			var node = this.sourceset.data.children[i]
			// block({name:"e", title:"block E", x:450, y:600})

			if (node.wires) {
				for (var j = 0; j < node.wires.length; j++) {
					var w = node.wires[j];

					// check to make sure the other wire recognizes this as a flow-visible attribute
					var found = false;
					for (var k=0;k<node.inputs.length;k++) {
						var input = node.inputs[k];
						if (w.input === input.name) {
							found = true;
							break;
						}
					}

					if (found) {
						res.push(connection({
							from:w.from,
							fromoutput:w.output,
							to:node.name,
							toinput:w.input,
							stripe:!!(w.multi)
						}))
					} else {
						// console.log("Not rendering", w, "for", node.name)
					}

				}
			}
		}

		return res
	}

	function uppercaseFirst (inp) {
		if (!inp || inp.length == 0) return inp
		return inp.charAt(0).toUpperCase() + inp.slice(1)
	}

	this.renderBlocks = function() {
		var res = []
		if (!this.sourceset) return
		if (!this.sourceset.data) return
		for (var i = 0; i < this.sourceset.data.children.length; i++) {
			var node = this.sourceset.data.children[i]
			// block({name:"e", title:"block E", x:450, y:600})
			var fd = node.flowdata
			if (!fd) {
				fd = {x:0, y:0}
			}
			if (fd.visible !== false) {
				res.push(
					block({
						flowdata:fd,
						pos:vec3(fd.x, fd.y, 0),
						name:node.name,
						title:uppercaseFirst(node.classname + ': ' + node.name),
						nodeindex:i,
						nodeprops:node.propobj,
						editables:node.editables,
						inputs:node.inputs,
						outputs:node.outputs,
						showscreenbutton:!!(fd.screen)
					})
				)
			}
		}
		return res
	}

	this.commitdragselect = function() {
		for (var i in this.dragselectset) {
			var bl = this.dragselectset[i]
			this.addToSelection(bl)
		}
		this.updatePopupUIPosition()
	}

	this.getCompositionName = function() {
		// todo: get actual name from here..
		return "somename.js"
	}

	this.openComposition = function() {
		this.screen.closeModal(false)
		this.screen.openModal(function() {
			return opencompositiondialog({width:this.screen.size[0],height:this.screen.size[1],
				position:"absolute",
				blur: function() {
					this.screen.closeModal(false)
				}
			})
		}.bind(this)).then(function(res) {
			if (res) {
				console.log(res)
				this.screen.locationhash = {
					composition:"$compositions/"+ res
				}
			}
			console.log(" opencomp result: " , res)
		}.bind(this))
	}

	this.newComposition = function() {
		this.screen.closeModal(false)
		this.screen.openModal(function() {
			return newcompositiondialog({width:this.screen.size[0],height:this.screen.size[1],
				position:"absolute",
				blur: function() {
					this.screen.closeModal(false)

				}} )
		}).then(function(res) {
			if (res) {
				this.rpc.fileio.newComposition(res).then(function(result) {
					console.log(result)
					// switch to new thing
					this.screen.locationhash = {
						composition:result.value
					}
				}.bind(this))
			}
			console.log(" newcomp result: " , res)
		}.bind(this))
	}

	this.renameComposition = function() {
		this.screen.closeModal(false)

		this.screen.openModal(function() {
			return renamedialog({width:this.screen.size[0],height:this.screen.size[1],
				position:"absolute",
				blur: function() {
					this.screen.closeModal(false)
				}
			})
		}.bind(this)).then(function(res) {
			console.log(" rename composition result: " , res)
		})
	}

	this.helpAbout = function() {
		this.screen.openModal(function() {
			return aboutdialog({width:this.screen.size[0],height:this.screen.size[1],
				position:"absolute",
				blur: function() {
					this.screen.closeModal(false)
				}
			})
		}.bind(this)).then(function(res) {})
	}

	this.helpReference = function() {
		this.screen.openModal(function() {
			return docviewerdialog({width:this.screen.size[0],height:this.screen.size[1],
				position:"absolute",
				title:"Reference",
				blur: function() {
					this.screen.closeModal(false)
				}
			})
		}.bind(this)).then(function(res) {})
	}

	this.helpGettingStarted = function() {
		this.screen.openModal(function() {
			return docviewerdialog({width:this.screen.size[0],height:this.screen.size[1],
				position:"absolute",
				title:"Getting started",
				blur: function() {
					this.screen.closeModal(false)
				}
			})
		}.bind(this)).then(function(res) {})
	}

	this.undo = function() {
		this.sourceset.undo()
	}

	this.redo = function() {
		this.sourceset.redo()
	}

	this.render = function() {

		//return [
        //
		//	cadgrid({name: "centralconstructiongrid",
		//			pointerstart: this.gridDragStart.bind(this),
		//			pointermove: this.gridDrag.bind(this),
		//			pointerend: this.gridDragEnd.bind(this),
		//			overflow: "scroll" ,bgcolor: "#4e4e4e",gridsize: 5,majorevery: 5,  majorline: "#575757", minorline: "#484848", zoom: function() {this.updateZoom(this.zoom)}.bind(this)}
		//		,view({name: "underlayer", bgcolor: NaN}
		//			,view({name: "groupbg",visible: false, bgcolor: vec4(1,1,1,0.08) , borderradius: 8, borderwidth: 0, bordercolor: vec4(0,0,0.5,0.9),position: "absolute", flexdirection: "column"})
		//		)
		//		,view({name: "connectionlayer", bgcolor: NaN, dataset: this.sourceset, render: function() {
		//				return this.renderConnections()
		//			}.bind(this)}
		//		)
		//		,view({bgcolor: NaN}, connection({name: "openconnector", hasball: false, visible: false}))
		//		,view({name: "blocklayer", bgcolor: NaN,  dataset: this.sourceset, render: function() {
		//			return this.renderBlocks()
		//		}.bind(this)})
        //
		//		,view({name: "popuplayer", bgcolor: NaN},
		//			view({name: "connectionui",visible: false,bgcolor: vec4(0.2,0.2,0.2,0.5),padding: 5, borderradius: vec4(1,14,14,14), borderwidth: 1, bordercolor: "black",position: "absolute", flexdirection: "column"},
		//				label({text: "Connection", bgcolor: NaN, margin: 4})
		//				,button({padding: 0, borderwidth: 0, click: function() {this.removeConnection(undefined)}.bind(this),  icon: "remove",text: "delete", margin: 4, fgcolor: "white", bgcolor: NaN})
		//			)
		//			,view({name: "blockui",visible: false, bgcolor: vec4(0.2,0.2,0.2,0.5),padding: 5, borderradius: vec4(10,10,10,1), borderwidth: 2, bordercolor: "black",position: "absolute", flexdirection: "column"},
		//				//,view({name: "blockui",x: -200,bg: 1,clearcolor: vec4(0,0,0,0),bgcolor: vec4(0,0,0,0),position: "absolute"},
		//				label({text: "Block", bgcolor: NaN, margin: 4})
		//				,button({padding: 0,borderwidth: 0, click: function() {this.removeBlock(undefined)}.bind(this),fgcolor: "white", icon: "remove",text: "delete", margin: 4, fgcolor: "white", bgcolor: NaN})
		//			)
        //
		//			,view({name: "groupui",visible: false, bgcolor: vec4(0.2,0.2,0.2,0.5),borderradius: 8, borderwidth: 2, bordercolor: "black",position: "absolute", flexdirection: "column"},
		//				//,view({name: "blockui",x: -200,bg: 1,clearcolor: vec4(0,0,0,0),bgcolor: vec4(0,0,0,0),position: "absolute"},
		//				label({text: "Group", bgcolor: NaN, margin: 4})
		//				,button({padding: 0,borderwidth: 0, click: function() {this.removeBlock(undefined)}.bind(this),fgcolor: "white", icon: "remove",text: "delete", margin: 4, fgcolor: "white", bgcolor: NaN})
		//			)
		//			,this.selectorrect({name: "selectorrect"})
		//			,view({bgcolor: NaN}, connection({name: "openconnector", hasball: false, visible: false}))
		//		)
		//	)
		//]

		return [
			//menubar({flex: 0, height: 20, viewport: '2d', name: "themenu", menus: [
			//	{name: "File", commands: [
			//		{name: "Open composition", clickaction: function() {this.openComposition();return true;}.bind(this)},
			//		{name: "New composition", clickaction: function() {this.newComposition();return true;}.bind(this)},
			//			{name: "Rename composition", clickaction: function() {this.renameComposition();return true;}.bind(this), enabled: false}
			//		]}
			//	,
			//{name: "Edit", commands: [
			//	{name: "Undo", icon: "undo", clickaction: function() {this.undo();}.bind(this)},
			//	{name: "Redo",icon: "redo",  clickaction: function() {this.redo();}.bind(this)}
            //
			//]}
			//	,
			//{name: "Help", commands: [
			//	{name: "About Flowgraph", clickaction: function() {this.helpAbout();return true;}.bind(this)},
			//	{name: "Getting started", clickaction: function() {this.helpGettingStarted();return true;}.bind(this)},
			//	{name: "Reference", clickaction: function() {this.helpReference();return true;}.bind(this)}
			//]}
			//	]})
			//,
			splitcontainer({}
				,splitcontainer({flex: 0.2, flexdirection: "column", direction: "horizontal"}
					,dockpanel({title: "Composition" , flex: 0.2}
						//,searchbox()

						,treeview({flex: 1, dataset: this.sourceset})
					)
					,dockpanel({title: "Library", viewport: "2D" }
						//,searchbox()
						,library({name: "thelibrary", dataset: this.librarydata})
					)
					//,dockpanel({title:"Inspector", visible:false},
					//	propviewer({
					//		name:"inspector",
					//		target:this.inspect,
					//		flex:1,
					//		overflow:"scroll",
					//		bgcolor:"#4e4e4e",
					//		callback:function(val, editor, commit) {
					//			console.log("callback>>", val, editor, commit)
					//			if (editor && editor.target && editor.propertyname) {
					//				var t = editor.target;
					//				if (typeof(t) === 'string') {
					//					t = editor.find(t);
					//				}
                    //
					//				if (t) {
					//					if (commit === "file") {
					//						var formData = new FormData();
					//						var fileobjname;
					//						for (var i = 0; i < val.length; i++) {
					//							var file = val[i];
					//							fileobjname = file.name;
					//							formData.append('file', file);
					//						}
					//						if (fileobjname) {
					//							var xhr = new XMLHttpRequest();
					//							xhr.open('POST', window.location.pathname, true);
					//							xhr.onload = function() {
					//								if (xhr.status === 200) {
					//									var compfile = t.screen.composition.constructor.module.filename;
					//									var compdir = compfile.substring(0, compfile.lastIndexOf('/'));
					//									var filename = compdir + "/" + fileobjname;
                    //
					//									console.log("oops have to write here", t, editor.propertyname, filename)
                    //
                    //
					//								} else {
					//									console.log('Oops, upload failed', xhr, val);
					//								}
					//							}.bind(this);
					//							xhr.send(formData);
					//						}
					//					} else {
					//						console.log("oops have to write here", t, editor.propertyname, val)
					//					}
					//				}
					//			}
					//		}.bind(this)
					//	})
					// )
				)
				,splitcontainer({flexdirection: "column", direction: "horizontal"}
					,cadgrid({name: "centralconstructiongrid",
							pointerstart: this.gridDragStart.bind(this),
							pointermove: this.gridDrag.bind(this),
							pointerend: this.gridDragEnd.bind(this),
						    pointerhover: this.updateConnector.bind(this),
							overflow: "scroll" ,bgcolor: "#4e4e4e",gridsize: 5,majorevery: 5,  majorline: "#575757", minorline: "#484848", zoom: function() {this.updateZoom(this.zoom)}.bind(this)}
						,view({name: "underlayer", bgcolor: NaN}
							,view({name: "groupbg",visible: false, bgcolor: vec4(1,1,1,0.08) , borderradius: 8, borderwidth: 0, bordercolor: vec4(0,0,0.5,0.9),position: "absolute", flexdirection: "column"})
						)
						,view({name: "connectionlayer", bgcolor: NaN, dataset: this.sourceset, render: function() {
							return this.renderConnections()
						}.bind(this)}
						)
						,view({bgcolor: NaN}, connection({name: "openconnector", hasball: false, visible: false}))
						,view({name: "blocklayer", bgcolor: NaN,  dataset: this.sourceset, render: function() {
							return this.renderBlocks()
						}.bind(this)})

						,view({name: "popuplayer", bgcolor: NaN},
							view({name: "connectionui",visible: false,bgcolor: vec4(0.2,0.2,0.2,0.5),padding: 5, borderradius: vec4(1,14,14,14), borderwidth: 1, bordercolor: "black",position: "absolute", flexdirection: "column"},
								label({text: "Connection", bgcolor: NaN, margin: 4})
								,button({padding: 0, borderwidth: 0, click: function() {this.removeConnection(undefined)}.bind(this),  icon: "remove",text: "delete", margin: 4, fgcolor: "white", bgcolor: NaN})
							)
							,view({name: "blockui",visible: false, bgcolor: vec4(0.2,0.2,0.2,0.5),padding: 5, borderradius: vec4(10,10,10,1), borderwidth: 2, bordercolor: "black",position: "absolute", flexdirection: "column"},
							//,view({name: "blockui",x: -200,bg: 1,clearcolor: vec4(0,0,0,0),bgcolor: vec4(0,0,0,0),position: "absolute"},
								label({text: "Block", bgcolor: NaN, margin: 4})
								,button({padding: 0,borderwidth: 0, click: function() {this.removeBlock(undefined)}.bind(this),fgcolor: "white", icon: "remove",text: "delete", margin: 4, fgcolor: "white", bgcolor: NaN})
							)

							,view({name: "groupui",visible: false, bgcolor: vec4(0.2,0.2,0.2,0.5),borderradius: 8, borderwidth: 2, bordercolor: "black",position: "absolute", flexdirection: "column"},
							//,view({name: "blockui",x: -200,bg: 1,clearcolor: vec4(0,0,0,0),bgcolor: vec4(0,0,0,0),position: "absolute"},
								label({text: "Group", bgcolor: NaN, margin: 4})
								,button({padding: 0,borderwidth: 0, click: function() {this.removeBlock(undefined)}.bind(this),fgcolor: "white", icon: "remove",text: "delete", margin: 4, fgcolor: "white", bgcolor: NaN})
							)
							,this.selectorrect({name: "selectorrect"})
//							,view({bgcolor: NaN}, connection({name: "openconnector", hasball: false, visible: false}))
						)
					)
//					,jseditor({name: 'jsviewer', fontsize: 14,sourceset: this.sourceset, overflow: 'scroll', flex: 0.1})
				)
			)
		]
	}
})
