/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */


define(function () {


	var CSS_UNDEFINED;

	var CSS_DIRECTION_INHERIT = 'inherit';
	var CSS_DIRECTION_LTR = 'ltr';
	var CSS_DIRECTION_RTL = 'rtl';

	var CSS_FLEX_DIRECTION_ROW = 'row';
	var CSS_FLEX_DIRECTION_ROW_REVERSE = 'row-reverse';
	var CSS_FLEX_DIRECTION_COLUMN = 'column';
	var CSS_FLEX_DIRECTION_COLUMN_REVERSE = 'column-reverse';

	var CSS_JUSTIFY_FLEX_START = 'flex-start';
	var CSS_JUSTIFY_CENTER = 'center';
	var CSS_JUSTIFY_FLEX_END = 'flex-end';
	var CSS_JUSTIFY_SPACE_BETWEEN = 'space-between';
	var CSS_JUSTIFY_SPACE_AROUND = 'space-around';

	var CSS_ALIGN_FLEX_START = 'flex-start';
	var CSS_ALIGN_CENTER = 'center';
	var CSS_ALIGN_FLEX_END = 'flex-end';
	var CSS_ALIGN_STRETCH = 'stretch';

	var CSS_POSITION_RELATIVE = 'relative';
	var CSS_POSITION_ABSOLUTE = 'absolute';

	var leading = {
		'row': 'left',
		'row-reverse': 'right',
		'column': 'top',
		'column-reverse': 'bottom'
	};
	var trailing = {
		'row': 'right',
		'row-reverse': 'left',
		'column': 'bottom',
		'column-reverse': 'top'
	};
	var pos = {
		'row': 'left',
		'row-reverse': 'right',
		'column': 'top',
		'column-reverse': 'bottom'
	};
	var dim = {
		'row': 'width',
		'row-reverse': 'width',
		'column': 'height',
		'column-reverse': 'height'
	};
/*
	function capitalizeFirst(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function getSpacing(node, type, suffix, locations) {
		for (var i = 0; i < locations.length; ++i) {
			var location = locations[i];
			if(!location) debugger
			var key = type + capitalizeFirst(location) + suffix;
			if (key in node.style) {
				return node.style[key];
			}

			key = type + suffix;
			if (key in node.style) {
				return node.style[key];
			}
		}

		return 0;
	}*/

	function fillNodes(node, nochildren) {
		var newnode = {children:[], ref:node, layout:{width:undefined, height:undefined, absx:0, absy:0, top:0, left:0, right:0, bottom:0}}
		node.oldlayout = node.layout
		var layout = node._layout = newnode.layout

		/*
		var style = newnode.style

		if(node._pos){
			if(!isNaN(node._pos[0])) style.left = node._pos[0];
			if(!isNaN(node._pos[1])) style.top = node._pos[1];
		}
		if (node._alignitems) style.alignItems = node._alignitems;
		if (node._aligncontent) style.alignContent = node._aligncontent;
		if (node._justifycontent) style.justifyContent = node._justifycontent;
		if (node._alignself) style.alignSelf = node._alignself;
		if (node._flexwrap) style.flexWrap = node._flexwrap;
		if (node.measure) style.measure = node.measure.bind(node);
		if (node._flexdirection) style.flexDirection = node._flexdirection;
		
		if (node._margin[0] == node._margin[1] == node._margin[2] == node._margin[3]) style.margin = node._margin[0];
		style.marginLeft = node._margin[0];
		style.marginRight = node._margin[2];
		style.marginTop = node._margin[1];
		style.marginBottom = node._margin[3];

		if (node._padding[0] == node._padding[1] == node._padding[2] == node._padding[3]) style.padding = node._padding[0];
		style.paddingLeft = node._padding[0];
		style.paddingRight = node._padding[2];
		style.paddingTop = node._padding[1];
		style.paddingBottom = node._padding[3];

		if (node._size){
			if (!isNaN(node._size[0]))	style.width = node._size[0];
			if (!isNaN(node._size[1]))	style.height = node._size[1];
		}
		if (node._position) style.position = node._position;
		if (node._flex) style.flex = node._flex;
		*/
		if(!nochildren && node.children) for(var i = 0; i < node.children.length;i++){
			var child = node.children[i]
			if(child._viewport){ // its using a different layout pass
				// if we are flex, we have to compute the layout of this child
				if(!isNaN(child._flex)){
					newnode.children.push(fillNodes(child, true))
				}
				else{
					// otherwise this child has an already computed layout
					newnode.children.push({
						flex:undefined,
						ref:child,
						layout:child.layout,
						children:[]
					})
				}
			}
			else newnode.children.push( fillNodes(child) )
		}

		return newnode
	}

	function extractNodes(node) {
		var layout = node.layout;
		delete node.layout;
		if (node.children && node.children.length > 0) {
			layout.children = node.children.map(extractNodes);
		} else {
			delete node.children;
		}

		delete layout.right;
		delete layout.bottom;
		delete layout.direction;

		return layout;
	}
/*
	function getPositiveSpacing(node, type, suffix, locations) {
		for (var i = 0; i < locations.length; ++i) {
			var location = locations[i];

			var key = type + capitalizeFirst(location) + suffix;
			if (key in node.style && node.style[key] >= 0) {
				return node.style[key];
			}

			key = type + suffix;
			if (key in node.style && node.style[key] >= 0) {
				return node.style[key];
			}
		}

		return 0;
	}*/

	function isUndefined(value) {
		return value === undefined;
	}

	function isRowDirection(flexDirection) {
		return flexDirection === CSS_FLEX_DIRECTION_ROW ||
					 flexDirection === CSS_FLEX_DIRECTION_ROW_REVERSE;
	}

	function isColumnDirection(flexDirection) {
		return flexDirection === CSS_FLEX_DIRECTION_COLUMN ||
					 flexDirection === CSS_FLEX_DIRECTION_COLUMN_REVERSE;
	}
/*
	function getLeadingLocations(axis) {
		var locations = [leading[axis]];
		if (isRowDirection(axis)) {
			locations.unshift('start');
		}

		return locations;
	}

	function getTrailingLocations(axis) {
		var locations = [trailing[axis]];
		if (isRowDirection(axis)) {
			locations.unshift('end');
		}

		return locations;
	}
*/
	//function getMargin(node, locations) {
	//	return getSpacing(node, 'margin', '', locations);
	//}

	function getLeadingMargin(node, axis) {
		var style = node.ref
		if(axis === 'row') return style._margin[0] >=0? style._margin[0]: 0
		if(axis === 'column') return style._margin[1] >=0? style._margin[1]: 0
		throw new Error('implement other axes')
	}

	function getTrailingMargin(node, axis) {
		var style = node.ref
		if(axis === 'row') return style._margin[2] >=0? style._margin[2]: 0
		if(axis === 'column') return style._margin[3] >=0? style._margin[3]: 0
		throw new Error('implement other axes')
	}

	//function getPadding(node, locations) {
	//	return getPositiveSpacing(node, 'padding', '', locations);
	//}
	function getLeadingPadding(node, axis) {
		var style = node.ref
		if(axis === 'row') return style._padding[0] >=0? style._padding[0]: 0
		if(axis === 'column') return style._padding[1] >=0? style._padding[1]: 0
		throw new Error('implement other axes')
	}

	function getTrailingPadding(node, axis) {
		var style = node.ref
		if(axis === 'row') return style._padding[2] >=0? style._padding[2]: 0
		if(axis === 'column') return style._padding[3] >=0? style._padding[3]: 0
		throw new Error('implement other axes')
	}

	//function getBorder(node, locations) {
	//	return getPositiveSpacing(node, 'border', 'Width', locations);
	//}

	function getLeadingBorder(node, axis) {
		var style = node.ref
		if(axis === 'row') return style._borderwidth[0] >=0? style._borderwidth[0]: 0
		if(axis === 'column') return  style._borderwidth[1] >=0? style._borderwidth[1]: 0
		throw new Error('implement other axes')
	}

	function getTrailingBorder(node, axis) {
		var style = node.ref
		if(axis === 'row') return style._borderwidth[2] >=0? style._borderwidth[2]: 0
		if(axis === 'column') return  style._borderwidth[3] >=0? style._borderwidth[3]: 0
		throw new Error('implement other axes')
	}

	function getLeadingPaddingAndBorder(node, axis) {
		var style = node.ref
		if(axis === 'row') return (style._padding[0] >=0? style._padding[0]: 0) + (style._borderwidth[0] >=0? style._borderwidth[0]: 0) 
		if(axis === 'column') return (style._padding[1] >=0? style._padding[1]: 0) + (style._borderwidth[1] >=0? style._borderwidth[1]: 0)
		throw new Error('implement other axes')
	}

	function getTrailingPaddingAndBorder(node, axis) {
		var style = node.ref
		if(axis === 'row') return (style._padding[2] >=0? style._padding[2]: 0) + (style._borderwidth[2] >=0? style._borderwidth[2]: 0)
		if(axis === 'column') return (style._padding[3] >=0? style._padding[3]: 0) + (style._borderwidth[3] >=0? style._borderwidth[3]: 0)
		throw new Error('implement other axes')
	}

	function getBorderAxis(node, axis) {
		var style = node.ref
		if(axis === 'row') return (style._borderwidth[0] >=0? style._borderwidth[0]: 0) + (style._borderwidth[2] >=0? style._borderwidth[2]: 0)
		if(axis === 'column') return (style._borderwidth[1] >=0? style._borderwidth[1]: 0) + (style._borderwidth[3] >=0? style._borderwidth[3]: 0)
		throw new Error('implement other axes')
	}

	function getMarginAxis(node, axis) {
		var style = node.ref
		if(axis === 'row') return (style._margin[0] >=0? style._margin[0]: 0) + (style._margin[2] >=0? style._margin[2]: 0)
		if(axis === 'column') return (style._margin[1] >=0? style._margin[1]: 0) + (style._margin[3] >=0? style._margin[3]: 0)
		throw new Error('implement other axes')
	}

	function getPaddingAndBorderAxis(node, axis) {
		// expand the fucker
		var style = node.ref
		if(axis === 'row'){
			return (style._padding[0] >=0? style._padding[0]: 0) + (style._borderwidth[0] >=0? style._borderwidth[0]: 0) +
			       (style._padding[2] >=0? style._padding[2]: 0) + (style._borderwidth[2] >=0? style._borderwidth[2]: 0)
		}
		else if(axis === 'column') {
			return (style._padding[1] >=0? style._padding[1]: 0) + (style._borderwidth[1] >=0? style._borderwidth[1]: 0) +
			       (style._padding[3] >=0? style._padding[3]: 0) + (style._borderwidth[3] >=0? style._borderwidth[3]: 0)
		}
		throw new Error('implement other axes')
	}

	function getJustifyContent(node) {
		var v = node.ref._justifycontent
		if(v) return v
		return 'flex-start';
	}

	function getAlignContent(node) {
		var v = node.ref._aligncontent
		if(v) return v
		return 'flex-start';
	}

	function getAlignItem(node, child) {
		if(child.ref && child.ref._alignself){
			return child.ref._alignself
		}
		if(node.ref._alignitems){
			return node.ref._alignitems
		}
		return 'stretch'
	}

	function resolveAxis(axis, direction) {
		if (direction === CSS_DIRECTION_RTL) {
			if (axis === CSS_FLEX_DIRECTION_ROW) {
				return CSS_FLEX_DIRECTION_ROW_REVERSE;
			} else if (axis === CSS_FLEX_DIRECTION_ROW_REVERSE) {
				return CSS_FLEX_DIRECTION_ROW;
			}
		}

		return axis;
	}

	function resolveDirection(node, parentDirection) {
		var direction = node.ref._direction;

		if (!direction) {
			direction = CSS_DIRECTION_INHERIT;
		}

		if (direction === CSS_DIRECTION_INHERIT) {
			direction = (parentDirection === undefined ? CSS_DIRECTION_LTR : parentDirection);
		}

		return direction;
	}

	function getFlexDirection(node) {
		if(node.ref._flexdirection){
			return node.ref._flexdirection
		}
		return CSS_FLEX_DIRECTION_COLUMN;
	}

	function getCrossFlexDirection(flexDirection, direction) {
		if (isColumnDirection(flexDirection)) {
			return resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);
		} else {
			return CSS_FLEX_DIRECTION_COLUMN;
		}
	}

	function getPositionType(node) {
		if(!node.ref) debugger
		if(node.ref && node.ref._position){
			return node.ref._position
		}
		return 'relative';
	}

	function getFlex(node) {
		return node.ref._flex
	}

	function isFlex(node) {
		return (
			getPositionType(node) === CSS_POSITION_RELATIVE &&
			getFlex(node) > 0
		);
	}

	function isFlexWrap(node) {
		return node.ref._flexwrap === 'wrap'
	}

	function getDimWithMargin(node, axis) {
		return node.layout[dim[axis]] + getMarginAxis(node, axis);
	}

	var dim = {
		'row': 'width',
		'row-reverse': 'width',
		'column': 'height',
		'column-reverse': 'height'
	};


	function isDimDefined(node, axis) {
		if(axis === 'row') return !isNaN(node.ref._size[0])
		if(axis === 'column') return !isNaN(node.ref._size[1])
		throw new Error('axis not defined')
	}

	function isPosDefined(node, pos) {
		if(pos === 'left') return !isNaN(node.ref._pos[0])
		if(pos === 'top') return !isNaN(node.ref._pos[1])
		if(pos === 'right') return !isNaN(node.ref._corner[0])
		if(pos === 'bottom') return !isNaN(node.ref._corner[1])

		return false
		throw new Error('pos not defined')
	}

	function isMeasureDefined(node) {
		return node.ref.measure !== undefined
	//	return 'measure' in node.style;
	}

	function getPosition(node, pos) {
		var refpos = node.ref._pos
		if(pos === 'left') return isNaN(refpos[0])?0:refpos[0]
		if(pos === 'top') return isNaN(refpos[1])?0:refpos[1]
		var refcorner = node.ref._corner
		if(pos === 'right') return isNaN(refcorner[0])?0:refcorner[0]
		if(pos === 'bottom') return isNaN(refcorner[1])?0:refcorner[1]
		throw new Error('pos not defined')
	}

	function boundAxis(node, axis, value) {

		var min, max
		if(axis === 'row') min = node.ref._minsize[0], max = node.ref._maxsize[0]
		else if(axis === 'column') min = node.ref._minsize[1], max = node.ref._maxsize[1]
		else throw new Error('axis not defined')

		var boundValue = value;
		if (!isNaN(max) && max >= 0 && boundValue > max) {
			boundValue = max
		}
		if (!isNaN(min) && min >= 0 && boundValue < min) {
			boundValue = min
		}
		return boundValue
	}

	function fmaxf(a, b) {
		if (a > b) {
			return a;
		}
		return b;
	}

	// When the user specifically sets a value for width or height
	function setDimensionFromStyle(node, axis) {
		// The parent already computed us a width or height. We just skip it
		if (!isUndefined(node.layout[dim[axis]])) {
			return;
		}
		// We only run if there's a width or height defined
		if (!isDimDefined(node, axis)) {
			return;
		}

		// The dimensions can never be smaller than the padding and border
		var bound 
		if(axis === 'row') bound = node.ref._size[0]
		else if(axis === 'column') bound = node.ref._size[1]
		else throw new Error('axis not found')

		node.layout[dim[axis]] = fmaxf(
			boundAxis(node, axis, bound),
			getPaddingAndBorderAxis(node, axis)
		);
	}
	
	var round = Math.round

	function setTrailingPosition(node, child, axis) {
		child.layout[trailing[axis]] = round(node.layout[dim[axis]] -
				child.layout[dim[axis]] - child.layout[pos[axis]]);
	}

	// If both left and right are defined, then use left. Otherwise return
	// +left or -right depending on which is defined.
	function getRelativePosition(node, axis) {
		var lead
		if(axis === 'row') lead = !isNaN(node.ref._pos[0])
		else if(axis === 'column') lead = !isNaN(node.ref._pos[1])
		//console.log(leading[axis])
		if (lead) {
			return getPosition(node, leading[axis]);
		}
		return -getPosition(node, trailing[axis]);
	}

function layoutNodeImpl(node, parentMaxWidth, /*css_direction_t*/parentDirection) {
		var/*css_direction_t*/ direction = resolveDirection(node, parentDirection);
		var/*(c)!css_flex_direction_t*//*(java)!int*/ mainAxis = resolveAxis(getFlexDirection(node), direction);
		var/*(c)!css_flex_direction_t*//*(java)!int*/ crossAxis = getCrossFlexDirection(mainAxis, direction);
		var/*(c)!css_flex_direction_t*//*(java)!int*/ resolvedRowAxis = resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);

		// Handle width and height style attributes
		setDimensionFromStyle(node, mainAxis);
		setDimensionFromStyle(node, crossAxis);

		// Set the resolved resolution in the node's layout
		node.layout.direction = direction;

		// The position is set by the parent, but we need to complete it with a
		// delta composed of the margin and left/top/right/bottom
		node.layout[leading[mainAxis]] += getLeadingMargin(node, mainAxis) +
			getRelativePosition(node, mainAxis);
		node.layout[trailing[mainAxis]] += getTrailingMargin(node, mainAxis) +
			getRelativePosition(node, mainAxis);
		node.layout[leading[crossAxis]] += getLeadingMargin(node, crossAxis) +
			getRelativePosition(node, crossAxis);
		node.layout[trailing[crossAxis]] += getTrailingMargin(node, crossAxis) +
			getRelativePosition(node, crossAxis);

		// Inline immutable values from the target node to avoid excessive method
		// invocations during the layout calculation.
		var/*int*/ childCount = node.children.length;
		var/*float*/ paddingAndBorderAxisResolvedRow = getPaddingAndBorderAxis(node, resolvedRowAxis);

		if (isMeasureDefined(node)) {
			var/*bool*/ isResolvedRowDimDefined = !isUndefined(node.layout[dim[resolvedRowAxis]]);

			var/*float*/ width = CSS_UNDEFINED;
			if (isDimDefined(node, resolvedRowAxis)) {
				width = node.ref._size[0];
			} else if (isResolvedRowDimDefined) {
				width = node.layout[dim[resolvedRowAxis]];
			} else {
				width = parentMaxWidth -
					getMarginAxis(node, resolvedRowAxis);
			}
			width -= paddingAndBorderAxisResolvedRow;

			// We only need to give a dimension for the text if we haven't got any
			// for it computed yet. It can either be from the style attribute or because
			// the element is flexible.
			var/*bool*/ isRowUndefined = !isDimDefined(node, resolvedRowAxis) && !isResolvedRowDimDefined;
			var/*bool*/ isColumnUndefined = !isDimDefined(node, CSS_FLEX_DIRECTION_COLUMN) &&
				isUndefined(node.layout[dim[CSS_FLEX_DIRECTION_COLUMN]]);

			// Let's not measure the text if we already know both dimensions
			if (isRowUndefined || isColumnUndefined) {
				var/*css_dim_t*/ measureDim = node.ref.measure(
					/*(c)!node->context,*/
					/*(java)!layoutContext.measureOutput,*/
					width
				);
				if (isRowUndefined) {
					node.layout.width = measureDim.width +
						paddingAndBorderAxisResolvedRow;
				}
				if (isColumnUndefined) {
					node.layout.height = measureDim.height +
						getPaddingAndBorderAxis(node, CSS_FLEX_DIRECTION_COLUMN);
				}
			}
			if (childCount === 0) {
				return;
			}
		}

		var/*bool*/ isNodeFlexWrap = isFlexWrap(node);

		var/*css_justify_t*/ justifyContent = getJustifyContent(node);

		var/*float*/ leadingPaddingAndBorderMain = getLeadingPaddingAndBorder(node, mainAxis);
		var/*float*/ leadingPaddingAndBorderCross = getLeadingPaddingAndBorder(node, crossAxis);
		var/*float*/ paddingAndBorderAxisMain = getPaddingAndBorderAxis(node, mainAxis);
		var/*float*/ paddingAndBorderAxisCross = getPaddingAndBorderAxis(node, crossAxis);

		var/*bool*/ isMainDimDefined = !isUndefined(node.layout[dim[mainAxis]]);
		var/*bool*/ isCrossDimDefined = !isUndefined(node.layout[dim[crossAxis]]);
		var/*bool*/ isMainRowDirection = isRowDirection(mainAxis);

		var/*int*/ i;
		var/*int*/ ii;
		var/*css_node_t**/ child;
		var/*(c)!css_flex_direction_t*//*(java)!int*/ axis;

		var/*css_node_t**/ firstAbsoluteChild = null;
		var/*css_node_t**/ currentAbsoluteChild = null;

		var/*float*/ definedMainDim = CSS_UNDEFINED;
		if (isMainDimDefined) {
			definedMainDim = node.layout[dim[mainAxis]] - paddingAndBorderAxisMain;
		}

		// We want to execute the next two loops one per line with flex-wrap
		var/*int*/ startLine = 0;
		var/*int*/ endLine = 0;
		// var/*int*/ nextOffset = 0;
		var/*int*/ alreadyComputedNextLayout = 0;
		// We aggregate the total dimensions of the container in those two variables
		var/*float*/ linesCrossDim = 0;
		var/*float*/ linesMainDim = 0;
		var/*int*/ linesCount = 0;
		while (endLine < childCount) {
			// <Loop A> Layout non flexible children and count children by type

			// mainContentDim is accumulation of the dimensions and margin of all the
			// non flexible children. This will be used in order to either set the
			// dimensions of the node if none already exist, or to compute the
			// remaining space left for the flexible children.
			var/*float*/ mainContentDim = 0;

			// There are three kind of children, non flexible, flexible and absolute.
			// We need to know how many there are in order to distribute the space.
			var/*int*/ flexibleChildrenCount = 0;
			var/*float*/ totalFlexible = 0;
			var/*int*/ nonFlexibleChildrenCount = 0;

			// Use the line loop to position children in the main axis for as long
			// as they are using a simple stacking behaviour. Children that are
			// immediately stacked in the initial loop will not be touched again
			// in <Loop C>.
			var/*bool*/ isSimpleStackMain =
					(isMainDimDefined && justifyContent === CSS_JUSTIFY_FLEX_START) ||
					(!isMainDimDefined && justifyContent !== CSS_JUSTIFY_CENTER);
			var/*int*/ firstComplexMain = (isSimpleStackMain ? childCount : startLine);

			// Use the initial line loop to position children in the cross axis for
			// as long as they are relatively positioned with alignment STRETCH or
			// FLEX_START. Children that are immediately stacked in the initial loop
			// will not be touched again in <Loop D>.
			var/*bool*/ isSimpleStackCross = true;
			var/*int*/ firstComplexCross = childCount;

			var/*css_node_t**/ firstFlexChild = null;
			var/*css_node_t**/ currentFlexChild = null;

			var/*float*/ mainDim = leadingPaddingAndBorderMain;
			var/*float*/ crossDim = 0;

			var/*float*/ maxWidth;
			for (i = startLine; i < childCount; ++i) {
				child = node.children[i];
				child.lineIndex = linesCount;

				child.nextAbsoluteChild = null;
				child.nextFlexChild = null;

				var/*css_align_t*/ alignItem = getAlignItem(node, child);

				// Pre-fill cross axis dimensions when the child is using stretch before
				// we call the recursive layout pass
				if (alignItem === CSS_ALIGN_STRETCH &&
						getPositionType(child) === CSS_POSITION_RELATIVE &&
						isCrossDimDefined &&
						!isDimDefined(child, crossAxis)) {
					child.layout[dim[crossAxis]] = fmaxf(
						boundAxis(child, crossAxis, node.layout[dim[crossAxis]] -
							paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
						// You never want to go smaller than padding
						getPaddingAndBorderAxis(child, crossAxis)
					);
				} else if (getPositionType(child) === CSS_POSITION_ABSOLUTE) {
					// Store a private linked list of absolutely positioned children
					// so that we can efficiently traverse them later.
					if (firstAbsoluteChild === null) {
						firstAbsoluteChild = child;
					}
					if (currentAbsoluteChild !== null) {
						currentAbsoluteChild.nextAbsoluteChild = child;
					}
					currentAbsoluteChild = child;

					// Pre-fill dimensions when using absolute position and both offsets for the axis are defined (either both
					// left and right or top and bottom).
					for (ii = 0; ii < 2; ii++) {
						axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;
						if (!isUndefined(node.layout[dim[axis]]) &&
								!isDimDefined(child, axis) &&
								isPosDefined(child, leading[axis]) &&
								isPosDefined(child, trailing[axis])) {
							child.layout[dim[axis]] = fmaxf(
								boundAxis(child, axis, node.layout[dim[axis]] -
									getPaddingAndBorderAxis(node, axis) -
									getMarginAxis(child, axis) -
									getPosition(child, leading[axis]) -
									getPosition(child, trailing[axis])),
								// You never want to go smaller than padding
								getPaddingAndBorderAxis(child, axis)
							);
						}
					}
				}

				var/*float*/ nextContentDim = 0;

				// It only makes sense to consider a child flexible if we have a computed
				// dimension for the node.
				if (isMainDimDefined && isFlex(child)) {
					flexibleChildrenCount++;
					totalFlexible += child.ref._flex;

					// Store a private linked list of flexible children so that we can
					// efficiently traverse them later.
					if (firstFlexChild === null) {
						firstFlexChild = child;
					}
					if (currentFlexChild !== null) {
						currentFlexChild.nextFlexChild = child;
					}
					currentFlexChild = child;

					// Even if we don't know its exact size yet, we already know the padding,
					// border and margin. We'll use this partial information, which represents
					// the smallest possible size for the child, to compute the remaining
					// available space.
					nextContentDim = getPaddingAndBorderAxis(child, mainAxis) +
						getMarginAxis(child, mainAxis);

				} else {
					maxWidth = CSS_UNDEFINED;
					if (!isMainRowDirection) {
						if (isDimDefined(node, resolvedRowAxis)) {
							maxWidth = node.layout[dim[resolvedRowAxis]] -
								paddingAndBorderAxisResolvedRow;
						} else {
							maxWidth = parentMaxWidth -
								getMarginAxis(node, resolvedRowAxis) -
								paddingAndBorderAxisResolvedRow;
						}
					}

					// This is the main recursive call. We layout non flexible children.
					if (alreadyComputedNextLayout === 0) {
						layoutNode(/*(java)!layoutContext, */child, maxWidth, direction);
					}

					// Absolute positioned elements do not take part of the layout, so we
					// don't use them to compute mainContentDim
					if (getPositionType(child) === CSS_POSITION_RELATIVE) {
						nonFlexibleChildrenCount++;
						// At this point we know the final size and margin of the element.
						nextContentDim = getDimWithMargin(child, mainAxis);
					}
				}

				// The element we are about to add would make us go to the next line
				if (isNodeFlexWrap &&
						isMainDimDefined &&
						mainContentDim + nextContentDim > definedMainDim &&
						// If there's only one element, then it's bigger than the content
						// and needs its own line
						i !== startLine) {
					nonFlexibleChildrenCount--;
					alreadyComputedNextLayout = 1;
					break;
				}

				// Disable simple stacking in the main axis for the current line as
				// we found a non-trivial child. The remaining children will be laid out
				// in <Loop C>.
				if (isSimpleStackMain &&
						(getPositionType(child) !== CSS_POSITION_RELATIVE || isFlex(child))) {
					isSimpleStackMain = false;
					firstComplexMain = i;
				}

				// Disable simple stacking in the cross axis for the current line as
				// we found a non-trivial child. The remaining children will be laid out
				// in <Loop D>.
				if (isSimpleStackCross &&
						(getPositionType(child) !== CSS_POSITION_RELATIVE ||
								(alignItem !== CSS_ALIGN_STRETCH && alignItem !== CSS_ALIGN_FLEX_START) ||
								isUndefined(child.layout[dim[crossAxis]]))) {
					isSimpleStackCross = false;
					firstComplexCross = i;
				}

				if (isSimpleStackMain) {
					child.layout[pos[mainAxis]] += mainDim;
					if (isMainDimDefined) {
						setTrailingPosition(node, child, mainAxis);
					}

					mainDim += getDimWithMargin(child, mainAxis);
					crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
				}

				if (isSimpleStackCross) {
					child.layout[pos[crossAxis]] += linesCrossDim + leadingPaddingAndBorderCross;
					if (isCrossDimDefined) {
						setTrailingPosition(node, child, crossAxis);
					}
				}

				alreadyComputedNextLayout = 0;
				mainContentDim += nextContentDim;
				endLine = i + 1;
			}

			// <Loop B> Layout flexible children and allocate empty space

			// In order to position the elements in the main axis, we have two
			// controls. The space between the beginning and the first element
			// and the space between each two elements.
			var/*float*/ leadingMainDim = 0;
			var/*float*/ betweenMainDim = 0;

			// The remaining available space that needs to be allocated
			var/*float*/ remainingMainDim = 0;
			if (isMainDimDefined) {
				remainingMainDim = definedMainDim - mainContentDim;
			} else {
				remainingMainDim = fmaxf(mainContentDim, 0) - mainContentDim;
			}

			// If there are flexible children in the mix, they are going to fill the
			// remaining space
			if (flexibleChildrenCount !== 0) {
				var/*float*/ flexibleMainDim = remainingMainDim / totalFlexible;
				var/*float*/ baseMainDim;
				var/*float*/ boundMainDim;

				// If the flex share of remaining space doesn't meet min/max bounds,
				// remove this child from flex calculations.
				currentFlexChild = firstFlexChild;
				while (currentFlexChild !== null) {
					baseMainDim = flexibleMainDim * currentFlexChild.ref._flex +
							getPaddingAndBorderAxis(currentFlexChild, mainAxis);
					boundMainDim = boundAxis(currentFlexChild, mainAxis, baseMainDim);

					if (baseMainDim !== boundMainDim) {
						remainingMainDim -= boundMainDim;
						totalFlexible -= currentFlexChild.ref._flex;
					}

					currentFlexChild = currentFlexChild.nextFlexChild;
				}
				flexibleMainDim = remainingMainDim / totalFlexible;

				// The non flexible children can overflow the container, in this case
				// we should just assume that there is no space available.
				if (flexibleMainDim < 0) {
					flexibleMainDim = 0;
				}

				currentFlexChild = firstFlexChild;
				while (currentFlexChild !== null) {
					// At this point we know the final size of the element in the main
					// dimension
					currentFlexChild.layout[dim[mainAxis]] = boundAxis(currentFlexChild, mainAxis,
						flexibleMainDim * currentFlexChild.ref._flex +
								getPaddingAndBorderAxis(currentFlexChild, mainAxis)
					);

					maxWidth = CSS_UNDEFINED;
					if (isDimDefined(node, resolvedRowAxis)) {
						maxWidth = node.layout[dim[resolvedRowAxis]] -
							paddingAndBorderAxisResolvedRow;
					} else if (!isMainRowDirection) {
						maxWidth = parentMaxWidth -
							getMarginAxis(node, resolvedRowAxis) -
							paddingAndBorderAxisResolvedRow;
					}

					// And we recursively call the layout algorithm for this child
					layoutNode(/*(java)!layoutContext, */currentFlexChild, maxWidth, direction);

					child = currentFlexChild;
					currentFlexChild = currentFlexChild.nextFlexChild;
					child.nextFlexChild = null;
				}

			// We use justifyContent to figure out how to allocate the remaining
			// space available
			} else if (justifyContent !== CSS_JUSTIFY_FLEX_START) {
				if (justifyContent === CSS_JUSTIFY_CENTER) {
					leadingMainDim = remainingMainDim / 2;
				} else if (justifyContent === CSS_JUSTIFY_FLEX_END) {
					leadingMainDim = remainingMainDim;
				} else if (justifyContent === CSS_JUSTIFY_SPACE_BETWEEN) {
					remainingMainDim = fmaxf(remainingMainDim, 0);
					if (flexibleChildrenCount + nonFlexibleChildrenCount - 1 !== 0) {
						betweenMainDim = remainingMainDim /
							(flexibleChildrenCount + nonFlexibleChildrenCount - 1);
					} else {
						betweenMainDim = 0;
					}
				} else if (justifyContent === CSS_JUSTIFY_SPACE_AROUND) {
					// Space on the edges is half of the space between elements
					betweenMainDim = remainingMainDim /
						(flexibleChildrenCount + nonFlexibleChildrenCount);
					leadingMainDim = betweenMainDim / 2;
				}
			}

			// <Loop C> Position elements in the main axis and compute dimensions

			// At this point, all the children have their dimensions set. We need to
			// find their position. In order to do that, we accumulate data in
			// variables that are also useful to compute the total dimensions of the
			// container!
			mainDim += leadingMainDim;

			for (i = firstComplexMain; i < endLine; ++i) {
				child = node.children[i];

				if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
						isPosDefined(child, leading[mainAxis])) {
					// In case the child is position absolute and has left/top being
					// defined, we override the position to whatever the user said
					// (and margin/border).
					child.layout[pos[mainAxis]] = getPosition(child, leading[mainAxis]) +
						getLeadingBorder(node, mainAxis) +
						getLeadingMargin(child, mainAxis);
				} else {
					// If the child is position absolute (without top/left) or relative,
					// we put it at the current accumulated offset.
					child.layout[pos[mainAxis]] += mainDim;

					// Define the trailing position accordingly.
					if (isMainDimDefined) {
						setTrailingPosition(node, child, mainAxis);
					}

					// Now that we placed the element, we need to update the variables
					// We only need to do that for relative elements. Absolute elements
					// do not take part in that phase.
					if (getPositionType(child) === CSS_POSITION_RELATIVE) {
						// The main dimension is the sum of all the elements dimension plus
						// the spacing.
						mainDim += betweenMainDim + getDimWithMargin(child, mainAxis);
						// The cross dimension is the max of the elements dimension since there
						// can only be one element in that cross dimension.
						crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
					}
				}
			}

			var/*float*/ containerCrossAxis = node.layout[dim[crossAxis]];
			if (!isCrossDimDefined) {
				containerCrossAxis = fmaxf(
					// For the cross dim, we add both sides at the end because the value
					// is aggregate via a max function. Intermediate negative values
					// can mess this computation otherwise
					boundAxis(node, crossAxis, crossDim + paddingAndBorderAxisCross),
					paddingAndBorderAxisCross
				);
			}

			// <Loop D> Position elements in the cross axis
			for (i = firstComplexCross; i < endLine; ++i) {
				child = node.children[i];

				if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
						isPosDefined(child, leading[crossAxis])) {
					// In case the child is absolutely positionned and has a
					// top/left/bottom/right being set, we override all the previously
					// computed positions to set it correctly.
					child.layout[pos[crossAxis]] = getPosition(child, leading[crossAxis]) +
						getLeadingBorder(node, crossAxis) +
						getLeadingMargin(child, crossAxis);

				} else {
					var/*float*/ leadingCrossDim = leadingPaddingAndBorderCross;

					// For a relative children, we're either using alignItems (parent) or
					// alignSelf (child) in order to determine the position in the cross axis
					if (getPositionType(child) === CSS_POSITION_RELATIVE) {
						/*eslint-disable */
						// This variable is intentionally re-defined as the code is transpiled to a block scope language
						var/*css_align_t*/ alignItem = getAlignItem(node, child);
						/*eslint-enable */
						if (alignItem === CSS_ALIGN_STRETCH) {
							// You can only stretch if the dimension has not already been set
							// previously.
							if (isUndefined(child.layout[dim[crossAxis]])) {
								child.layout[dim[crossAxis]] = fmaxf(
									boundAxis(child, crossAxis, containerCrossAxis -
										paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
									// You never want to go smaller than padding
									getPaddingAndBorderAxis(child, crossAxis)
								);
							}
						} else if (alignItem !== CSS_ALIGN_FLEX_START) {
							// The remaining space between the parent dimensions+padding and child
							// dimensions+margin.
							var/*float*/ remainingCrossDim = containerCrossAxis -
								paddingAndBorderAxisCross - getDimWithMargin(child, crossAxis);

							if (alignItem === CSS_ALIGN_CENTER) {
								leadingCrossDim += remainingCrossDim / 2;
							} else { // CSS_ALIGN_FLEX_END
								leadingCrossDim += remainingCrossDim;
							}
						}
					}

					// And we apply the position
					child.layout[pos[crossAxis]] += linesCrossDim + leadingCrossDim;

					// Define the trailing position accordingly.
					if (isCrossDimDefined) {
						setTrailingPosition(node, child, crossAxis);
					}
				}
			}

			linesCrossDim += crossDim;
			linesMainDim = fmaxf(linesMainDim, mainDim);
			linesCount += 1;
			startLine = endLine;
		}

		// <Loop E>
		//
		// Note(prenaux): More than one line, we need to layout the crossAxis
		// according to alignContent.
		//
		// Note that we could probably remove <Loop D> and handle the one line case
		// here too, but for the moment this is safer since it won't interfere with
		// previously working code.
		//
		// See specs:
		// http://www.w3.org/TR/2012/CR-css3-flexbox-20120918/#layout-algorithm
		// section 9.4
		//
		if (linesCount > 1 && isCrossDimDefined) {
			var/*float*/ nodeCrossAxisInnerSize = node.layout[dim[crossAxis]] -
					paddingAndBorderAxisCross;
			var/*float*/ remainingAlignContentDim = nodeCrossAxisInnerSize - linesCrossDim;

			var/*float*/ crossDimLead = 0;
			var/*float*/ currentLead = leadingPaddingAndBorderCross;

			var/*css_align_t*/ alignContent = getAlignContent(node);
			if (alignContent === CSS_ALIGN_FLEX_END) {
				currentLead += remainingAlignContentDim;
			} else if (alignContent === CSS_ALIGN_CENTER) {
				currentLead += remainingAlignContentDim / 2;
			} else if (alignContent === CSS_ALIGN_STRETCH) {
				if (nodeCrossAxisInnerSize > linesCrossDim) {
					crossDimLead = (remainingAlignContentDim / linesCount);
				}
			}

			var/*int*/ endIndex = 0;
			for (i = 0; i < linesCount; ++i) {
				var/*int*/ startIndex = endIndex;

				// compute the line's height and find the endIndex
				var/*float*/ lineHeight = 0;
				for (ii = startIndex; ii < childCount; ++ii) {
					child = node.children[ii];
					if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
						continue;
					}
					if (child.lineIndex !== i) {
						break;
					}
					if (!isUndefined(child.layout[dim[crossAxis]])) {
						lineHeight = fmaxf(
							lineHeight,
							child.layout[dim[crossAxis]] + getMarginAxis(child, crossAxis)
						);
					}
				}
				endIndex = ii;
				lineHeight += crossDimLead;

				for (ii = startIndex; ii < endIndex; ++ii) {
					child = node.children[ii];
					if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
						continue;
					}

					var/*css_align_t*/ alignContentAlignItem = getAlignItem(node, child);
					if (alignContentAlignItem === CSS_ALIGN_FLEX_START) {
						child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
					} else if (alignContentAlignItem === CSS_ALIGN_FLEX_END) {
						child.layout[pos[crossAxis]] = currentLead + lineHeight - getTrailingMargin(child, crossAxis) - child.layout[dim[crossAxis]];
					} else if (alignContentAlignItem === CSS_ALIGN_CENTER) {
						var/*float*/ childHeight = child.layout[dim[crossAxis]];
						child.layout[pos[crossAxis]] = currentLead + (lineHeight - childHeight) / 2;
					} else if (alignContentAlignItem === CSS_ALIGN_STRETCH) {
						child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
						// TODO(prenaux): Correctly set the height of items with undefined
						//                (auto) crossAxis dimension.
					}
				}

				currentLead += lineHeight;
			}
		}

		var/*bool*/ needsMainTrailingPos = false;
		var/*bool*/ needsCrossTrailingPos = false;

		// If the user didn't specify a width or height, and it has not been set
		// by the container, then we set it via the children.
		if (!isMainDimDefined) {
			node.layout[dim[mainAxis]] = fmaxf(
				// We're missing the last padding at this point to get the final
				// dimension
				boundAxis(node, mainAxis, linesMainDim + getTrailingPaddingAndBorder(node, mainAxis)),
				// We can never assign a width smaller than the padding and borders
				paddingAndBorderAxisMain
			);

			if (mainAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
					mainAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
				needsMainTrailingPos = true;
			}
		}

		if (!isCrossDimDefined) {
			node.layout[dim[crossAxis]] = fmaxf(
				// For the cross dim, we add both sides at the end because the value
				// is aggregate via a max function. Intermediate negative values
				// can mess this computation otherwise
				boundAxis(node, crossAxis, linesCrossDim + paddingAndBorderAxisCross),
				paddingAndBorderAxisCross
			);

			if (crossAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
					crossAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
				needsCrossTrailingPos = true;
			}
		}

		// <Loop F> Set trailing position if necessary
		if (needsMainTrailingPos || needsCrossTrailingPos) {
			for (i = 0; i < childCount; ++i) {
				child = node.children[i];

				if (needsMainTrailingPos) {
					setTrailingPosition(node, child, mainAxis);
				}

				if (needsCrossTrailingPos) {
					setTrailingPosition(node, child, crossAxis);
				}
			}
		}

		// <Loop G> Calculate dimensions for absolutely positioned elements
		currentAbsoluteChild = firstAbsoluteChild;
		while (currentAbsoluteChild !== null) {
			// Pre-fill dimensions when using absolute position and both offsets for
			// the axis are defined (either both left and right or top and bottom).
			for (ii = 0; ii < 2; ii++) {
				axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;

				if (!isUndefined(node.layout[dim[axis]]) &&
						!isDimDefined(currentAbsoluteChild, axis) &&
						isPosDefined(currentAbsoluteChild, leading[axis]) &&
						isPosDefined(currentAbsoluteChild, trailing[axis])) {
					currentAbsoluteChild.layout[dim[axis]] = fmaxf(
						boundAxis(currentAbsoluteChild, axis, node.layout[dim[axis]] -
							getBorderAxis(node, axis) -
							getMarginAxis(currentAbsoluteChild, axis) -
							getPosition(currentAbsoluteChild, leading[axis]) -
							getPosition(currentAbsoluteChild, trailing[axis])
						),
						// You never want to go smaller than padding
						getPaddingAndBorderAxis(currentAbsoluteChild, axis)
					);
				}

				if (isPosDefined(currentAbsoluteChild, trailing[axis]) &&
						!isPosDefined(currentAbsoluteChild, leading[axis])) {
					currentAbsoluteChild.layout[leading[axis]] =
						node.layout[dim[axis]] -
						currentAbsoluteChild.layout[dim[axis]] -
						getPosition(currentAbsoluteChild, trailing[axis]);
				}
			}

			child = currentAbsoluteChild;
			currentAbsoluteChild = currentAbsoluteChild.nextAbsoluteChild;
			child.nextAbsoluteChild = null;
		}
	}
	
	
	function layoutNode(node, parentMaxWidth, /*css_direction_t*/parentDirection) {
		
		var total = 1;
		
		//layoutNodeImpl(node, parentMaxWidth, parentDirection);
		//return;
		//var direction = node.style.direction;
		var layout = node.layout;

		//node.layout.should_update = true;
	

		//layout.last_requested_width = node.style.width;
		//layout.last_requested_height = node.style.height;
		//layout.last_parent_max_width = parentMaxWidth;
		//layout.last_direction = direction;

		total += layoutNodeImpl(node, parentMaxWidth, parentDirection);
		//node.getBoundingRect(true);//boundingRectCache = undefined;
		
		//layout.last_width = layout.width;
		//layout.last_height = layout.height;
		//layout.last_top = layout.top;
		//layout.last_left = layout.left;
		//layout.last_bottom = layout.bottom;
		//layout.last_right = layout.right;
		//node.laststyle = node.style;
		//if(node.ref._listen_postLayout || node.ref.onpostLayout) node.ref.emit('postLayout')
		//node.boundingRectCache = undefined;
		
		return total;
	}

	return {
		computeLayout: layoutNode,
		fillNodes: fillNodes,
		extractNodes: extractNodes
	};
});