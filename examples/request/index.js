define.class('$server/composition', function($ui$, screen, view, label, $$, get) {
    this.render = function() { return [
        get({url:'http://slashdot.org'}),
        screen({}, label({ text: wire('rpc.get.response'), fgcolor: "black"}))
    ] }
});
