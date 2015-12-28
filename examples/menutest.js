//Pure JS based composition
define.class('$server/composition', function($ui$, screen, view, button,label, speakergrid){
	
	define.class(this, "popupmenu", function($ui$, view, label, button){
		this.bgcolor = "gray" 
		this.flexdirection = "column" 
		this.attributes = {
				commands:[
					{name:"New project with a long name", action:function(){console.log("new project with a long name") ;}},
					{name:"Open", action:function(){console.log("Open") ;}},
					{name:"Save", action:function(){console.log("Save") ;}}
			]}
		this.render = function(){
			if (!this.commands) return [];
			var res = [];
			for(var a in this.commands){
				var c = this.commands[a];
				res.push(button({alignself:"stretch" , buttoncolor2:"red", bgcolor:"green", buttoncolor1: "white" ,hovercolor1: "purple", text:c.name, aclick:c.action, margin:1}))
			}
			
			return res;
		}
	})
	
	this.justifycontent = "center" ;
	this.alignitems = "center" 
	
	this.render = function(){ return [
		screen({clearcolor:vec4('black')},
			view({flex:1, bg:'false'},
				speakergrid({ }
				,view({bgcolor:"green" , flexdirection:"column"},view({bg:false},this.popupmenu({position:"relative",margin:10,flex:0}))))
			)
		)
	]}
})