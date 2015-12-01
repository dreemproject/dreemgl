/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define({
	Program:{ steps:2 },
	Empty:{},

	Id: { name:0, flag:0, typing:1 },
	Value: { value:0, raw:0, kind:0, multi:0 },
	This: { },

	Array: { elems:2 },
	Object: { keys:3 },
	Index: { object:1, index:1 },
	Key: { object:1, key:1, exist:0 },
	ThisCall: { object:1, key:1 },

	Block:{ steps:2 },
	List: { items:2 },
	Comprehension:{ for:1, expr:1 },
	Template: { chain:2 },
	Break: { label:1 },
	Continue: { label:1 },
	Label: { label:1, body:1 },

	If: { test:1, then:1, else:1, postfix:0, compr:0 },
	Switch: { on:1, cases:2 },
	Case: { test:1, steps:2 },

	Throw: { arg:1 },
	Try: { try:1, arg:1, catch:1, finally:1 },

	While: { test:1, loop:1 },
	DoWhile: { loop:1, test:1 },
	For: { init:1, test:1, update:1, loop:1, compr:0 },
	ForIn: { left:1, right:1, loop:1, compr:0 },
	ForOf: { left:1, right:1, loop:1, compr:0 },
	ForFrom: { right:1, left:1, loop:1, compr:0 }, // right comes first for type inference
	ForTo: { left:1, right:1, loop:1, in:1, compr:0 },

	Var: { defs:2, const:0 },
	TypeVar: { typing:1, defs:2, dim:1 },
	Struct: { id:1, struct:1, base:1},//, defs:2, dim:1 },
	Define: { id:1, value:1 },
	Enum: { id:1, enums:2 },

	Def: { id:1, init:1, dim:1 },

	Function: { id:1, name:1, params:2, rest:1, body:1, arrow:0, gen:0, def:0 },
	Return: { arg:1 },
	Yield: { arg:1 },
	Await: { arg:1 },

	Unary: { op:0, prefix:0, arg:1 },
	Binary: { op:0, prio:0, left:1, right:1 },
	Logic: { op:0, prio:0, left:1, right:1 },
	Assign: { op:0, prio:0, left:1, right:1 },
	Update: { op:0, prio:0, arg:1, prefix:0 },
	Condition: { test:1, then:1, else:1 },

	New: { fn:1, args:2 },
	Call: { fn:1, args:2, extarg:0 },
	Nest: { fn:1, body:1, arrow:0 },

	Class: { id:1, base:1, body:1 },

	Signal: { left:1, right:1 },
	Quote: { quote:1 },
	AssignQuote: { left:1, quote:1 },
	Rest: { id:1, dots:0 },
	Then: { name:1, do:1 },

	Debugger: { },
	With: { object:1, body:1 }
})