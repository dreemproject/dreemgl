define.class('$server/composition', function($ui$, screen, view, textbox, $examples$, request$get, $$, weather) {

    this.render = function() { return [
        request$get({name:'openweather'}),
        screen({name:'weather'},
            view({flexdirection:'column', flex:1},
                textbox({name:'placename', value:'Seoul,KR', fgcolor:'black'}),
                weather({location:wire('find.placename.value'), width:500, height:500, servicename:'openweather'})
            ))
    ] }


});
