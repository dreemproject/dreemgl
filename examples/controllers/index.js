define.class('$server/composition', function($server$, $ui$, screen, view, label, $$, dpad, game, knob, keyboard) {

    this.render = function() {
        return [
            screen(
                dpad({height:200, width:200, bgcolor:'red'}),
                game({height:200, width:200, bgcolor:'green'}),
                knob({height:200, width:200, bgcolor:'blue'}),
                keyboard({height:200, width:200, bgcolor:'yellow'})
            )
        ]
    }
});
