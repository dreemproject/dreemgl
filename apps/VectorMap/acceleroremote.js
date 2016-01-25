define.class("$ui/view", function(require,$ui$, view,label, button, noisegrid, $$, geo, urlfetch)
{		
	this.flex = 1;

	this.render = function(){	
		return [
			noisegrid({flex:1, justifycontent: "center"}, 
			
				view({bg:0, alignself:"center", flexdirection:"column"}
					,label({name:"thelabel", text: "", bg:0})
					,button({text:"Move", mouseleftdown : function(){this.setAccelTarget(this.text);}.bind(this), mouseleftup: function(){this.setAccelTarget("");}.bind(this)})
				)
			)
		]
	};
	
	this.setAccelTarget = function(target){
		this.acceltarget = target;
	}
	
	this.setAccel = function(x,y,z){
		if (this.acceltarget == "Move"){
			this.find("thelabel").text = x + "_" + y + "_" + z;
		}		
	}

	this.init = function()
	{
		window.ondevicemotion = function(event) {  
			var ax = event.accelerationIncludingGravity.x;  
			var ay = event.accelerationIncludingGravity.y;  
			var az = event.accelerationIncludingGravity.z;  
			
			this.setAccel(ax,ay,az);
			
		}.bind(this)
	}	
}  
)