

var getComputedStyleShim = function(el, camelCase, hyphenated) {
  if (el.currentStyle) return el.currentStyle[camelCase];
  var defaultView = document.defaultView,
    computed = defaultView ? defaultView.getComputedStyle(el, null) : null;
  return (computed) ? computed.getPropertyValue(hyphenated) : null;
};

document.body.className += ' ready';

document.body.onclick = function(e) {
	for (var el = e.target; el && el.nodeType != 9; el = el.parentNode) {
		switch (el.getAttribute('rel')) {
			case 'uncontact':
				e.preventDefault();
				e.stopPropagation();
				var contact = document.getElementById('contact');
				if (!contact.getAttribute('hidden')) {
					contact.setAttribute('hidden', 'hidden');
					var errored = document.getElementsByClassName('errored');
					for (var j = errored.length; error = errored[--j];)
						error.className = error.className.replace(' errored', '')
				}
				return false;
			case 'contact':
				e.preventDefault();
				e.stopPropagation();
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
		var href = el.getAttribute('href');
		if (href && href.indexOf('youtube.com') > -1) {
			var id = (href.match(/v=(.*?)(?:$|\&|\?)/) || [null, null])[1];
			for (var parent = el; parent = parent.parentNode;) 
				if (parent && parent.tagName == 'LI') break;
			if (id && parent) {
				play(id, parent);
				return false;
			}
		} else {
			if (el.tagName == 'LI' && el.className.match(/video|audio/)) {
				var link = el.getElementsByTagName('a')[0];
				if (!link) continue;
				var href = link.getAttribute('href');
				var id = (href.match(/v=(.*?)(?:$|\&|\?)/) || [null, null])[1];
				if (id) {
					play(id, el);
					return false
				}
			}
		}
	}

}


var grids = document.getElementsByClassName('grid');
var itemsByGrid = [];
var columnsByGrid = [];
for (var i = 0, grid; grid = grids[i]; i++) {
	var parent = grid.parentNode;
	var items = itemsByGrid[i] = [];
	var columns = columnsByGrid[i] = [];
	var wrapper = document.createElement('div');
	wrapper.className = 'columns';
	parent.insertBefore(wrapper, grid)
	for (var j = 0; j < 3; j++) {
		var column = document.createElement('ul');
		columns.push(column)
		wrapper.appendChild(column);
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
	if (played)
		setPlayer(played)
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
		var span = document.createElement('span');
		for (var j = el.childNodes.length, child; child = el.childNodes[--j];)
			span.appendChild(child);
		el.appendChild(span);
		span.setAttribute('tooltip', title);
		el.removeAttribute('title')
	}
}

getElementOffset = function(element) {
	var x = 0;
	var y = 0;
	for (var p = element; p = p.parentNode;)
		if (getComputedStyleShim(p, 'position', 'position') == 'relative') {
			x += p.offsetLeft
			y += p.offsetTop;
		}
	return {x: x, y: y};
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
				var offset = getElementOffset(el).x;
				if (el.offsetLeft + el.offsetWidth + offset + tooltip.offsetWidth > window.innerWidth) {
					if (tooltip.className.indexOf('invert') == -1)
					tooltip.className += ' invert'
					tooltip.style.top = el.offsetTop + el.offsetHeight / 2 - tooltip.offsetHeight / 2 + 'px';
					tooltip.style.left = el.offsetLeft - tooltip.offsetWidth;
				} else {
					tooltip.className = tooltip.className.replace(' invert', '')
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

function showPlayer(played) {
	wrap.className += ' visible';
	played.className += ' selected';
	document.body.className += ' playing-' + (played.className.indexOf('audio') > -1 ? 'audio' : 'video');
}

function hidePlayer(played) {
	wrap.className = wrap.className.replace(' visible', '');
  var grid = document.getElementsByClassName('columns')[0];
  if (grid) {
  	grid.style.marginTop = 0;
  	wrap.style.maxHeight = 0;
  }
	document.body.className = document.body.className.replace(' playing-' + (played.className.indexOf('audio') > -1 ? 'audio' : 'video'), '')
	played.className = played.className.replace(' selected', '')
}

var player, embed, playing, api, played
function play(id, element) {
	if (played == element && id == playing) {
		if (playing)
			player.stopVideo()
		hidePlayer(played);
		marginTop = 0;
		playing = played = null;
		return 
	} else {
		if (!embed) {
			wrap = document.createElement('div');
			wrap.className = 'player wrap'
			embed = document.createElement('div');
			embed.setAttribute('id', 'player');
			wrap.appendChild(embed);
			document.body.appendChild(wrap);
		}
		playing = id;
		if (played) hidePlayer(played);
		played = element;
		showPlayer(played);
		if (marginTop && played.className.indexOf('audio') > -1)
			marginTop = 0;
		if (!api) {
			api  = document.createElement('script');
			api.src = 'http://www.youtube.com/iframe_api';
			document.body.appendChild(api);
      onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: playing || id,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          },
			    playerVars: { 'autohidze': 0 },
        });
      }
      function onPlayerReady(event) {
    	  event.target.playVideo();
      	embed = document.getElementById('player')
      	setPlayer(element)
      }
      function onPlayerStateChange(event) {
      	//switch (event.data) {
      	//	case -1:
      	//		if (played && played.className.indexOf('selected') == -1)
				//			showPlayer(played);
      	//		break;
      	//	case 2:
      	//		if (played && played.className.indexOf('selected') > -1) {
	      //			hidePlayer(played);
	      //			marginTop = 0;
	      //		}
      	//		playing = null;
      	//		played = null;
      	//		break;
      	//}
        //if (event.data == YT.PlayerState.PLAYING) {
        //}
      }
		} else {
			if (player) {
				player.stopVideo();
				player.loadVideoById(playing);
      	setPlayer(element)
			}
		}
	}
}

marginTop = 0;
setPlayer = function(element) {
	if (!embed) return;
	var audio = element.className.indexOf('audio') > -1;
	if (!audio) element = document.getElementsByClassName('columns')[0] || element.parentNode;
  var offset = getElementOffset(element);
  offset.x += element.offsetLeft;
  offset.y += element.offsetTop;
  wrap.style.left = offset.x + 'px';
  wrap.style.top = offset.y - marginTop + 'px';
  if (audio) {
	  embed.setAttribute('width', 0);
	  embed.setAttribute('height', 0);
  } else {
  	var height = Math.round(element.offsetWidth * 0.66);
	  embed.setAttribute('width', element.offsetWidth);
	  embed.setAttribute('height', height);
	  marginTop = height + 16;
	  element.style.marginTop = height + 16 + 'px';
	  wrap.style.maxHeight = height + 'px';
  }
}
