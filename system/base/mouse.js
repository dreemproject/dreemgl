// Copyright 2015 Teem2 LLC, MIT License (see LICENSE,

define.class('$system/base/node', function(){
	this.atConstructor = function(){}	
	this.attributes = {
		// event api
		move:Config({type:Event}),
		down:Config({type:Event}),
		up: Config({type:Event}),

		// single value API
		x: Config({type:float}),
		y: Config({type:float}),

		left: Config({type:int}),
		middle: Config({type:int}),
		right: Config({type:int}),
		click: Config({type:int}),
		blurred: Config({type:int}),
		dblclick: Config({type:int}),
		clicker: Config({type:int}),
		leftdown: Config({type:int}),
		leftup: Config({type:int}),
		rightdown: Config({type:int}),
		rightup: Config({type:int}),
		wheelx: Config({type:int}),
		wheely: Config({type:int}),
		zoom: Config({type:int})
	}

})