define.class(function($ui$, screen, view, button, label, $, movie) {

    this.attributes = {
        term: {type:String},
        movies: {type:Array}
    };

    this.bgcolor = 'red'

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
            {flexdirection:'column', flex:1, overflow:'scroll'},
            label({ name:'search', width:300, height:30, text:'Aliens', fgcolor:'black'}),
            button({text:'Search', width:90, click:function() {
                // sets the term on our screen, this should fire the server thing
                this.screen.term = this.parent.search.text;
            }}),
            view(this.renderMovies())
        )
    ] }

});