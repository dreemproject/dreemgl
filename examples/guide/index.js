define.class(function($server$, composition, role, $, search, browser) {

    this.render = function() { return [
        search({
            name:'omdb',
            keyword: wire('this.rpc.role.main.term')
        }),
        role(
            browser({
                name:'main',
                term:'Aliens',
                movies: wire('this.rpc.omdb.results')
            })
        )
    ] }
});
