define.class('$server/composition', function($ui$, screen, view) {

    this.render = function() { return [
        screen({}, view({}))
    ] }
});
