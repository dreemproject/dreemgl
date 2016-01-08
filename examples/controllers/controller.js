define.class("$ui/view", function() {

    this.attributes = {
        value:'',
        activekeys:[]
    };

    this.press = function(key) {
        if (this.activekeys.indexOf(key) < 0) {
            var active = this.activekeys.slice();
            active.unshift(key);
            this.activekeys = active;
        }
        this.value = key;
    };

    this.unpress = function(key) {
        if (this.activekeys.indexOf(key) >= 0) {
            var active = this.activekeys.slice();
            active.splice(active.indexOf(key), 1);
            this.activekeys = active;
        }
        this.value = this.activekeys[0];
    };

    this.onactivekeys = function() {
        console.log("active key are now", this.activekeys)
    }

    this.onvalue = function() {
        console.log("current value", this.value)
    }


});