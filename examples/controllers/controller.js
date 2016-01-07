define.class("$ui/view", function() {

    this.attributes = {
        activekey:'',
        activekeys:[]
    };

    this.press = function(key) {
        if (this.activekeys.indexOf(key) < 0) {
            var active = this.activekeys.slice();
            active.unshift(key);
            this.activekeys = active;
        }
        this.activekey = key;
    };

    this.unpress = function(key) {
        if (this.activekeys.indexOf(key) >= 0) {
            var active = this.activekeys.slice();
            active.splice(active.indexOf(key), 1);
            this.activekeys = active;
        }
        this.activekey = this.activekeys[0];
    };

});