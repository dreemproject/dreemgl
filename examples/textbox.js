//Pure JS based composition
define.class('$server/composition',function($ui$, screen, view, textbox, button, label){
	this.render = function(){ return [
		screen({clearcolor:'#484230', flexdirection:'row'},
			textbox({value:"T1", bgcolor:'red'}),
			textbox({value:"T2", bgcolor:'orange'}),
			button({text:'test'}),
			label({fgcolor:'red', mouseleftdown:function(){
				// lets open a modal dialog
				this.screen.openModal(
					view({
						miss:function(){
							this.resolve(false)
						},
						init:function(){
							console.log('here')
						},
						pos:[0,0],
						size:[300,300],position:'absolute',text:'I IZ HERE'
					}, button({text:'test'}))
				).then(function(result){
					console.log(result)
				})
			},text:'HELLLLOOO'})
		)
	]}
})