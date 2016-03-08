/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",
  function (require, exports, $ui$, screen, view, $behaviors$, draggable) {
    var assert = (require('$system/lib/chai.js')).assert;
    var results = [];

    this.render = function() {
      var v1 = view({
        x:5, y:10, width:100, height:150, bgcolor:'green',

        atConstructor: function() {results.push('atConstructor v1');},
        init: function() {results.push('init v1');},
        render: function() {results.push('render v1'); return [v1sub];},
        atRender: function() {results.push('atRender v1');},
        atChildrenRendered: function() {results.push('atChildrenRendered v1');}
      });

      var v1sub = view({
        x:5, y:5, width:20, height:20, bgcolor:'yellow',

        atConstructor: function() {results.push('atConstructor v1sub');},
        init: function() {results.push('init v1sub');},
        render: function() {results.push('render v1sub');},
        atRender: function() {results.push('atRender v1sub');},
        atChildrenRendered: function() {results.push('atChildrenRendered v1sub');}
      });

      var v2 = view({
        x:105, y:10, width:50, height:75, bgcolor:'green',

        atConstructor: function() {results.push('atConstructor v2');},
        init: function() {results.push('init v2');},
        render: function() {results.push('render v2');},
        atRender: function() {results.push('atRender v2');},
        atChildrenRendered: function() {results.push('atChildrenRendered v2');}
      });

      var s = screen({
        name: 'default',
        atConstructor: function() {results.push('atConstructor screen');},
        init: function() {results.push('init screen');},
        render: function() {results.push('render screen'); return [v1, v2];},
        atRender: function() {results.push('atRender screen');},
        atChildrenRendered: function() {
          results.push('atChildrenRendered screen');

          var expected = [
            // Construct Phase
              'atConstructor v1',
                'atConstructor v1sub',
              'atConstructor v2',
            'atConstructor screen',

            // Render Phase
            'init screen',
            'render screen',
            'atRender screen',
              'init v1',
              'render v1',
              'atRender v1',
                'init v1sub',
                'render v1sub',
                'atRender v1sub',
                'atChildrenRendered v1sub',
              'atChildrenRendered v1',
              'init v2',
              'render v2',
              'atRender v2',
              'atChildrenRendered v2',
            'atChildrenRendered screen'
          ];
          assert.equal(results.join(','), expected.join(','), 'All functions should have been called in the correct order.');
          console.log('Tests Ran');
        }
      });

      return[s];
    };
  }
);
