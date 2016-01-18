define.class("$server/composition",
  function ($ui$, screen) {
    // Create a single screen with background color 'green'
    this.render = function () {
      var c = "green";
      console.log("c=" + c)
      return [screen({name: 'default', clearcolor: c})];
    }
  }
);