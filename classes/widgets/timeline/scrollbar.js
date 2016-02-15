define.class('$ui/scrollbar', function () {

	this.position = 'absolute'
	this.vertical = false

	this.attributes = {
		zoom: Config({value: wire('this.parent.zoom')}),
		maxzoom: Config({value: wire('this.parent.maxzoom')}),
		value: Config({value: wire('this.parent.scroll')})
	}

	this.value = function(event){
		if (event.mark) return
		this.parent.scroll = this._value
	}

	this.layout = function(){
		this.layout.left = 0
		this.layout.height = 10
		this.layout.width =  this.parent.layout.width
		this.layout.top =  this.parent.layout.height - this.layout.height
	}

	this.atDraw = function () {
		this.updateScrollbar()
	}

	// internal: show/hide and resize scrollbar
	this.updateScrollbar = function(){
		this._total = this.maxzoom / this.zoom
		this._page = 1
		if (this._total > this._page - 0.1){
			var offset = clamp(this._value, 0, this._total - this._page)
			if (offset !== this._value) {
				this._value = offset
			}
			this.visible = true
		}
		// TODO(aki): hiding breaks atDraw
		// if (this._total == this._page) {
		// 	if (0 !== this._value) this._value = 0
		// 	this.visible = false
		// }
	}

})
