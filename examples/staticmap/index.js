define.class('$server/composition', function($ui$, screen, view, $$, map) {

    this.render = function() { return [
        screen({}, m= map({location:'Portland, OR', width:500, height:500}))
    ] }


});
