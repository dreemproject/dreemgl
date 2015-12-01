// Copyright 2015 Teem2 LLC, MIT License (see LICENSE,

define.class(function(node){
	this.atConstructor = function(){}
	
	this.events = ['move']

	this.attributes = {
		x: {type:float},
		y: {type:float},
		isdown: {type:int},
		left: {type:int},
		middle: {type:int},
		right: {type:int},
		click: {type:int},
		blurred: {type:int},
		dblclick: {type:int},
		clicker: {type:int},
		leftdown: {type:int},
		leftup: {type:int},
		rightdown: {type:int},
		rightup: {type:int},
		wheelx: {type:int},
		wheely: {type:int},
		zoom: {type:int}
	}

})