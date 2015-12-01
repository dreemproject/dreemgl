// Copyright 2015 Teem2 LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Server with a single client screen.
// Tests server->client method and attribute access.
// Tests client->server method and attribute access.


define.class(function($server$, composition, screens, $containers$, screen, view, $controls$, label){

  // Server
  var serverobj = define.class(function serverobj(server){
    
    this.attributes = {
      // server attribute: string
      server_str: {type:String, value:'test'},
      // server attribute: number
      server_num: {type:Number, value:123.45},
      // Count of server calls
      server_calls: {type:Number, value:100}
    }

    // Called from client to re-init server state
    this.server_init = function() {
      this.server_calls = 100;
      return true;
    }

    // server method f1: increment server_calls and return value
    this.server_f1 = function() {
      //this.setAttribute('server_calls', this.server_calls+1);
      this.server_calls++;      
      //console.log('server_f1', this.server_calls);
      return this.server_calls;
    }

    // server method f2: Return an attribute from s1. 
    // Also calls a method in s1 which is returned when server_f3 is called
    // Also calls 
    this.s1_f1 = 0;
    this.server_f2 = function() {
      var self = this;
      // Read an attribute from s1 and return it
      var value = this.rpc.screens.s1.s1_calls;

      // Call s1_f1 and record the result in s1_f1.
      this.rpc.screens.s1.s1_f1().then(function(result){
        self.s1_f1 = result.value;
      })

      return value;
    }

    // server method f3: Return the value retrieved in server_f2
    this.server_f3 = function() {
      return this.s1_f1;
    }

    
    this.init = function(){
      console.log("Server running!");
    }

  })

  this.render = function(){ return [
    serverobj({name:'serverobj'}),
    screens(

      // Client composition: s1
      screen(
        {
          name:'s1', 

          // Attributes
          attribute_s1_str:{type:string, value:'s1_str'},
          attribute_s1_num:{type:Number, value:111.11},
          
          // Count of server calls
   	  attribute_s1_calls:{type:Number, value:100},

          // client method s1_init: re-init client state
          s1_init: function() {
            this.s1_calls = 100;
            return true;
          },

          // server method f1: increment s1_calls and return value
          s1_f1: function() {
            this.s1_calls++;      
            //console.log('s1_f1', this.s1_calls);
            return this.s1_calls;
          }
        },

	label({name: 'messages', size:vec2(600,200), rotation: 0, bgcolor:"gray",fgcolor:"white", marginleft: 4, fontsize: 16, position: "relative", text: 'Messages:'}),

        view({
          size: vec2(100,100),
          bgcolor: vec4('green'),

          // Add an error  message; on-screen and to the console
          add_error: function(msg) {
            var args = Array.prototype.slice.call(arguments);
            var m = args.join(' ');
            var text = this.parent.messages.text + '\n' + m;
            this.parent.messages.setAttribute('text', text);
            console.error(m);
          },

          // Unit test
          test: function() {
            var self = this;
            console.log('test running', this.parent.messages);
            this.parent.messages.setAttribute('text', 'Test Running');

            this.setAttribute('bgcolor', vec4('blue'));
            // Call server method
            this.rpc.serverobj.server_f1().then(function(result) {
              // Verify the return value from server_f1()
              if (result.value != 101) {
                self.add_error('server_f1 should return 101', result.value);
              }
              if (result.value != self.rpc.serverobj.server_calls) {
                // Verify return value from server_f1 against the server attr
                self.add_error('Cannot read current value of server_calls attribute from client', result.value, self.rpc.serverobj.server_calls);
              }
            });

            this.rpc.serverobj.server_f2().then(function(result) {
              // Verify the return value from server_f2()
              if (result.value != 100) {
                self.add_error('server_f2 did not return s1_calls:', result.value);
              }

              // server_f3() cannot be called until async part of server_f2()
              // is finished.
              // TODO Use a timer (100 msec) to check for now
              setTimeout(function() {
                self.rpc.serverobj.server_f3().then(function(result) {
                  if (result.value != 101) {
                    self.add_error('server_f3 should return 101', result.value);
                  }
                });
              }, 100);
            });
          },

          init: function(){
            // Initialize the client
            this.rpc.screens.s1.s1_init();

            // Initialize the server. Use a timer to detect a dead server
            var timer = setTimeout(function() {
              console.error('Server appears to be dead');
            }, 500);
            var self = this;
            this.rpc.serverobj.server_init().then(function(result) {
              clearTimeout(timer);

              // Run the test
              self.test();
            })
            
          }
        })
      )

    )
    
  ]}
})
