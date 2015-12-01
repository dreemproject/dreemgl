/* Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// Access the `active` attribute on the command line with these:
//
// curl -d '{"rpcid":"devbus", "type":"attribute", "attribute":"active", "get":true}' http://localhost:2000/extdemo
//
// curl -d '{"rpcid":"devbus", "type":"attribute", "attribute":"active", "value":{ "My Phone":"phone", "SmartLamp":"smartbulb", "Brother 101":"printer" }}' http://localhost:2000/extdemo
//
// Use `notify` method via the command line with one of:
//
// curl -d '{"rpcid":"devbus", "type":"method", "method":"notify", "args":["ID", "TYPE", "join"]}' http://localhost:2000/extdemo
//
// curl -d '{"rpcid":"devbus", "type":"method", "method":"notify", "args":["ID", "TYPE", "part"]}' http://localhost:2000/extdemo

define.class(function ($server$, service) {

    this.attributes = {active: {type: Object, value:{}}};

    this.notify = function(id, type, action) {
        var active = this.active;
        if (action == 'join') {
            active[id] = type;
        } else if (action == 'part') {
            delete active[id];
        }
        this.active = active;
    }

});
