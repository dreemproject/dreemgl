define.class('$server/composition', function($ui$, screen, view, label, $$, get) {
    this.render = function() { return [
        get({url:'http://google.com'}),
        screen({}, label({
            text:wire('this.rpc.get.response'),
            fgcolor:"black"
        }))
    ] }
});
