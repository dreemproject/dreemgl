define.class('$server/composition', function($ui$, screen, view, $examples$, request$get, $$, weather) {

    this.render = function() { return [
        request$get({name:'openweather'}),
        screen({name:'weather'}, w=weather({location:'Paris,FR', width:500, height:500, servicename:'openweather'}))
    ] }


});
