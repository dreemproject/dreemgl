define.class('$server/composition', function($ui$, screen, textbox, view, $$, map) {

    this.render = function() { return [
        screen({},
            view({flexdirection:'column', flex:1},
              textbox({name:'placename', value:'Portland, OR', fgcolor:'red'}),
              map({location:wire('find.placename.value'), width:250, height:250}))
            )
    ] }


});
