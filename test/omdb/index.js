/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function($ui$, screen, view, label, $examples$, $$, omdb) {

    this.render = function() { return [
        omdb({name:'omdb', keyword:'Monkey'}),
        screen(
            view({
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
                }
            })
        )
    ] }
});
