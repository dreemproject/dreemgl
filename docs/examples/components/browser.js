/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function($ui$, screen, view, button, textbox, $$, movie) {

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
            { flexdirection:'column', flex:1, overflow:'scroll', bgcolor:"white" },
            view({flexdirection:'row'},
				textbox({ name:'search', value:'Cats', fgcolor:'black', borderwidth:1, bordercolor:'#666'}),
				button({text:'Search', click:function() {
					// sets the term on our screen, this should fire the server thing
					this.screen.term = this.parent.find('search').value;
				}})
			),
            view(this.renderMovies())
        )
    ] }

});
