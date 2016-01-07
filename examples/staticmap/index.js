define.class('$server/composition', function($ui$, screen, textbox, view, $$, map) {

    this.render = function() { return [
        screen({},
            view({flexdirection:'column', flex:1},
              textbox({name:'place', value:'Portland, OR', fgcolor:'red'}),
              map({location:wire('this.place.value'), width:150, height:150}))
            )
    ] }


});
