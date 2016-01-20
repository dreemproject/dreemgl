// Randomly display squares in a parent view. Move each view when the parent
// view is clicked.



define.class(function($server$, composition, $ui$, screen, view){

  // Create N random views
  this.rviews = function(n) {
    // Create dynamic squares (location and color)
    var dynviews = [];
    for (var i=0; i<n; i++) {
      var v = view({
        pos: rpos()
	,size: vec2(50, 50)
	,bgcolor: rcolor()
        ,position: 'absolute'
      })
      // console.log(v.pos);
      dynviews.push(v);
    }

    return dynviews;
  }

  // When the mouse is clicked, change the location of each view
  this.mousedown = function(event){
    // Rewrite the positions of the views
    for (var i=0; i<this.children.length; i++) {
      this.children[i].pos = rpos();
    }
    //this.changepos();
  }

  this.render = function(){ 
    var views = [
      screen({name:'default', clearcolor:'#484230'},
             view({name: 'top', size: vec2(500,500), bgcolor: vec4('gray'), onmouseleftdown: this.mousedown}
	          ,this.rviews(50))
            )
    ];

    return views
  }
})



// Helper functions

// Return random[0,max)
random = function(max) {
  var rand = Math.floor(Math.random() * max);
  return rand;
}

// Return random color
rcolor = function() {
  var color = vec4(Math.random(), Math.random(), Math.random(), 1);
  return color;
}
  
// Return a random position
rpos = function() {
  var pos = vec3(random(450), random(450), 0);
  return pos;
}


