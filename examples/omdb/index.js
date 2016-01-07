define.class('$server/composition', function($ui$, screen, view, label, $examples$, $$, omdb) {

    this.render = function() { return [
        omdb({name:'omdb', keyword:'Monkey'}),
        screen({}, v=view({
            flex:1,
            flexdirection:'row',
            movielist:wire('rpc.omdb.results'),
            render:function(){
                var views = [];
                if (this.movielist) {
                    for (var i = 0; i < this.movielist.length; i++) {
                        var movie = this.movielist[i];
                        if (movie.Poster && movie.Poster.startsWith('http')) {
                            views.push(view({bgimage:movie.Poster}))
                        }
                    }
                }
                return views;
            }}))
    ] }
});
