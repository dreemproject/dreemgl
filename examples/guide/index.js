define.class('$server/composition', function(search, browser) {

    this.render = function() { return [
        search({
            name:'omdb',
            keyword: wire('this.rpc.role.main.term')
        }),
        browser({
            name:'main',
            term:'Aliens',
            movies: wire('this.rpc.omdb.results')
        })
    ] }
});
