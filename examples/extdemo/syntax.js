/* Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($containers$view, $examples$guide$movie, $, slides$device) {

    // `guide$movie` is loading the view found in `./compositions/guide/movie.js`

    // The `this` prefix refers to the current component, regardless of the directory name
    // so `this$slides$device` maps to `./compositions/<this>/slides/device.js`
    // (which in this case is, `./compositions/extdemo/slides/device.js`)

    this.attributes = {
        movieData : {type:Object},
        deviceData: {type:Object, value:{ deviceId:'TK-429', deviceType:'syntax' }}
    };

    this.render = function() {
        // Use the component classes just as you would any normal DreemGL class function.
        return [ $examples$guide$movie(this.movieData), slides$device(this.deviceData) ]
    }

});