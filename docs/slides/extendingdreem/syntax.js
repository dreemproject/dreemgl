/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($ui$, view, $docs$examples$components$, movie, $$, slides$device) {

    // internal, `$docs$examples$components$` followed by `movie` is loading the `movie` view found in `./docs/examples/components/movie.js`

    // The `$$` prefix refers to the current directory, regardless of the current directory name
    // so `$$, slides$device` maps to `$root/docs/slides/extendingdreem/slides/device.js`

    this.attributes = {
        movieData : Config({type:Object}),
        deviceData: Config({type:Object, value:{ deviceId:'TK-429', deviceType:'syntax' }})
    };

    this.render = function() {
        // Use the component classes just as you would any normal DreemGL class function.
        return [ movie(this.movieData), slides$device(this.deviceData) ]
    }

});
