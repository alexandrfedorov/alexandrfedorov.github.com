

var getComputedStyleShim = function(el, camelCase, hyphenated) {
  if (el.currentStyle) return el.currentStyle[camelCase];
  var defaultView = document.defaultView,
    computed = defaultView ? defaultView.getComputedStyle(el, null) : null;
  return (computed) ? computed.getPropertyValue(hyphenated) : null;
};


document.body.className = 'ready'
document.body.onclick = function(e) {
	for (var el = e.target; el && el.nodeType != 9; el = el.parentNode) {
		switch (el.getAttribute('rel')) {
			case 'uncontact':
				var contact = document.getElementById('contact');
				if (!contact.getAttribute('hidden')) {
					contact.setAttribute('hidden', 'hidden');
					var errored = document.getElementsByClassName('errored');
					for (var j = errored.length; error = errored[--j];)
						error.className = error.className.replace(' errored', '')
				}
				return false;
			case 'contact':
				var contact = document.getElementById('contact');
				if (contact.getAttribute('hidden')) {
					contact.removeAttribute('hidden');
				} else {
					var errors = 0;
					var name = document.getElementById('name');
					var errored = name.parentNode.className.indexOf('errored') > -1;
					if (name.value.match(/^\s*$/)) {
						errors++;
						if (!errored)
							name.parentNode.className += ' errored';
					} else {
						if (errored)
							name.parentNode.className = name.parentNode.className.replace(' errored', '');
					}

					var email = document.getElementById('email');
					var phone = document.getElementById('phone');
					var errored = email.parentNode.className.indexOf('errored') > -1;
					if (email.value.match(/^\s*$/) && phone.value.match(/^\s*$/)) {
						errors++;
						if (!errored)
							email.parentNode.className += ' errored';
					} else {
						if (errored)
							email.parentNode.className = email.parentNode.className.replace(' errored', '');
					}

					var message = document.getElementById('message');
					var errored = message.parentNode.className.indexOf('errored') > -1;
					if (message.value.match(/^\s*$/)) {
						errors++;
						if (!errored)
							message.parentNode.className += ' errored';
					} else {
						if (errored)
							message.parentNode.className = message.parentNode.className.replace(' errored', '');
					}

					if (!errors) {

					}
				}
				return false;
		}
	}
}


var grids = document.getElementsByClassName('grid');
var itemsByGrid = [];
var columnsByGrid = [];
for (var i = 0, grid; grid = grids[i]; i++) {
	var parent = grid.parentNode;
	var next = grid.nextSibling;
	var items = itemsByGrid[i] = [];
	var columns = columnsByGrid[i] = [];
	for (var j = 0; j < 3; j++) {
		var column = document.createElement('ul');
		columns.push(column)
		parent.insertBefore(column, next);
	}

	columns = columns.filter(function(column) {
		return getComputedStyleShim(column, 'display', 'display') != 'none';
	})

	for (var j = 0, child; child = grid.childNodes[j++];)
		if (child.tagName == 'LI')
			items.push(child);

	for (var j = 0, child, min; child = items[j++];) {
		for (var k = 0, col; col = columns[k++];)
			if (!min || min.offsetHeight > col.offsetHeight)
				min = col;
		min.appendChild(child);
	}

	grid.className += ' distributed'
}

window.onresize = function() {
	for (var i = 0, grid; grid = grids[i]; i++) {
		var columns = columnsByGrid[i].filter(function(column) {
			return getComputedStyleShim(column, 'display', 'display') != 'none';
		})
		var items = itemsByGrid[i];
		for (var j = items.length, child; child = items[--j]; )
			child.parentNode.removeChild(child);

		for (var j = 0, child, min; child = items[j++];) {
			for (var k = 0, col; col = columns[k++];)
				if (!min || min.offsetHeight > col.offsetHeight)
					min = col;
			min.appendChild(child);
		}
	}
}

tooltip = document.createElement('div');
tooltip.className = 'tooltip';
tooltip.setAttribute('hidden', 'hidden')
inside = document.createElement('span');
tooltip.appendChild(inside)
tooltipping = tooltipped = null;
var all = document.body.getElementsByTagName('*');
for (var i = 0, el; el = all[i++];) {
	var title = el.getAttribute('title');
	if (title) {
		el.setAttribute('tooltip', title);
		el.removeAttribute('title')
	}
}

document.body.onmouseover = function(e) {
	for (var el = e.target; el; el = el.parentNode) {
		if (el.nodeType != 1) continue;
		var title = el.getAttribute('tooltip');
		if (title) {
			clearTimeout(tooltipping);
			tooltipping = setTimeout(function() {
				inside.innerHTML = title;
				tooltip.style.display = 'block';
				if (tooltipped)
					tooltipped.className = tooltipped.className.replace(' tooltipped', '');
				el.className += ' tooltipped';
				tooltipped = el;
				el.appendChild(tooltip)
				var offset = 0;
				for (var p = el; p = p.parentNode;)
					if (getComputedStyleShim(p, 'position', 'position') == 'relative') {
						offset += p.offsetLeft
					}
				if (el.offsetLeft + el.offsetWidth + offset + tooltip.offsetWidth > window.innerWidth) {
					if (tooltip.className.indexOf('top') == -1)
					tooltip.className += ' top'
					tooltip.style.top = el.offsetTop + el.offsetHeight
					tooltip.style.left = el.offsetLeft + el.offsetWidth - tooltip.offsetWidth;
				} else {
					tooltip.className = tooltip.className.replace(' top', '')
					tooltip.style.top = el.offsetTop + el.offsetHeight / 2 - tooltip.offsetHeight / 2 + 'px';
					tooltip.style.left = el.offsetLeft + el.offsetWidth + 'px';	
				}
				tooltip.removeAttribute('hidden');
			}, 300);
			break;
		} else if (el.getAttribute('tooltip')) {
			clearTimeout(tooltipping);
		}
	}
}
document.body.onmouseout = function(e) {
	for (var el = e.target; el; el = el.parentNode) {
		if (el.nodeType != 1) continue;
		var title = el.getAttribute('tooltip');
		if (title) {
			clearTimeout(tooltipping);
			tooltipping = setTimeout(function() {
				if (tooltip.getAttribute('hidden')) return;
				tooltip.setAttribute('hidden', 'hidden')
				el.className = el.className.replace(' tooltipped', '');
				tooltipped = null;
				clearTimeout(tooltipping)
				tooltipping = setTimeout(function() {
					tooltip.style.display = 'none'
				}, 300)
			}, 300)
			break;
		}
	}
}