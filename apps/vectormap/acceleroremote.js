define.class("$ui/view", function(require,$ui$, view,label, button, noisegrid,speakergrid)
{
	this.flex = 1;
	this.attributes = {
		target: "index"
	}
	this.render = function(){
		return [
			speakergrid({flex:1, padding: 70},noisegrid({padding:20,borderradius: 20, justifycontent: "center"},

				view({bg:0, alignself:"center", flexdirection:"column"}
					,label({name:"thelabel", text: "", bg:0})
					,button({icon:"arrows",margin: 10, padding:20, pointerstart : function(){this.setAccelTarget("Move");}.bind(this), pointerend: function(){this.setAccelTarget("");}.bind(this)})
					,button({icon:"video-camera",margin: 10, padding:20, pointerstart : function(){this.setAccelTarget("Pan");}.bind(this), pointerend: function(){this.setAccelTarget("");}.bind(this)})
				)
			)
			)
		]
	};

	this.setAccelTarget = function(target){
		this.acceltarget = target;
	}

	this.setAccel = function(x,y,z){
		//	this.find("thelabel").text = x + "_" + y + "_" + z;
		if (this.acceltarget == "Move"){
			this.rpc[this.target].acceleromove(x,y,z);

		}
		if (this.acceltarget == "Pan"){
			this.rpc[this.target].acceleropan(x,y,z);
		}
	}

	this.init = function()
	{
		this.acceltarget = "";
		window.ondevicemotion = function(event) {
			var ax = event.accelerationIncludingGravity.x;
			var ay = event.accelerationIncludingGravity.y;
			var az = event.accelerationIncludingGravity.z;

			this.setAccel(ax,ay,az);

		}.bind(this)
	}
}
)
