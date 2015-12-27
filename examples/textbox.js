//Pure JS based composition
define.class('$server/composition',function($ui$, screen, view, textbox, label){
	this.render = function(){ return [
		screen({clearcolor:'#484230', flexdirection:'row'},
			textbox({value:"T1", bgcolor:'red'}),
			textbox({value:"T2", bgcolor:'orange'}),
			label({fgcolor:'red', mouseleftdown:function(){
				// lets open a modal dialog
				this.screen.openModal(
					label({text:'hello'})
				).then(function(result){
					console.log(result)
				})
			},text:'HELLLLOOO'})
		)
	]}
})