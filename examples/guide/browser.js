define.class(function($ui$, screen, view, button, textbox, label, $$, movie) {

    this.attributes = {
        term: Config({type:String}),
        movies: Config({type:Array})
    };

    this.renderMovies = function() {
        var mviews = [];
        if (this.movies) {
            for (var i=0;i<this.movies.length;i++) {
                var movieData = this.movies[i];
                mviews.push(movie(movieData));
            }
        }
        return mviews;
    };

    this.render = function() { 

        return [

        view(
            { flexdirection:'column', flex:1, overflow:'scroll' },
            textbox({ name:'search', width:300, height:30, value:'Aliens', fgcolor:'black'}),
            button({text:'Search', width:90, click:function() {
                // sets the term on our screen, this should fire the server thing
                this.screen.term = this.parent.find('search').value;
            }}),
            view(this.renderMovies())
        )
    ] }

});