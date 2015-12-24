//Pure JS based composition
define.class('$server/composition',function($ui$, screen, view, textbox, label){
	this.render = function(){ return [
		screen({clearcolor:'#484230', flexdirection:'row'},
			textbox({value:"T1", bgcolor:'red'}),
			textbox({value:"T2", bgcolor:'orange'}),
			label({fgcolor:'red', text:'HELLLLOOO'})
		)
	]}
})