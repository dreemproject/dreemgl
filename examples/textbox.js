//Pure JS based composition
define.class('$server/composition',function($ui$, screen, view, textbox, button, label){

	// what if we do this
	this.style = {
		label:{
			margin:30
		},
	}

 	// so how is that going to work hm?
 	// well we have a _style object.
 	// and that one has an entry for 'textbox'
 	// so what happens? well
 	
 	// we inherit the _style object and copy over props.

 	// we look up textbox in _style
  	// this._classes[name]


	this.render = function(){ return [
		screen({clearcolor:'#484230', flexdirection:'row'},
			textbox({value:"T1", bgcolor:'red'}),
			textbox({value:"T2", bgcolor:'orange'}),
			button({text:'test'}),
			label({fgcolor:'red', mouseleftdown:function(){
				// lets open a modal dialog
				this.screen.openModal(function(){return [
					view({
						miss:function(){
							this.screen.closeModal(false)
						},
						init:function(){
							console.log('here')
						},
						pos:[0,0],
						size:[300,300],position:'absolute',text:'body'
					}, button({text:'test123'}))
				]}).then(function(result){
					console.log(result)
				})
			},text:'Click me to open modal'})
		)
	]}
})