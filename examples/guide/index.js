define.class(function($server$, composition, screens, $, search, browser) {

    this.render = function() { return [
        search({
            name:'omdb',
            keyword:'${this.rpc.screens.main.term}'
        }),
        screens(
            browser({
                name:'main',
                term:'Aliens',
                movies:'${this.rpc.omdb.results}'
            })
        )
    ] }
});
