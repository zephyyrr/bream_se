(function(window, undefined) {
	var waitingUnits = [];
	
	var Logic = {
		World: null,
		units: [],
		ctrl: false,
		selected : []
	};
	
	Logic.addUnit = function(unit) {
		if (this.World) {
			unit.addTo(this.World);
		} else {
			waitingUnits.push(unit);
		}
		this.units.push(unit);
	};
	
	Logic.applyTo = function(World) {
		this.World = World;
		for (var i = 0; i < waitingUnits.length; i++) {
			waitingUnits[i].addTo(World);
		}
		$(World).keydown(function(e) {
			if (e.which == 17) {
				Logic.ctrl = true;
			}
		});
		$(World).keyup(function(e) {
			if (e.which == 17) {
				Logic.ctrl = false;
			}
		});
		$(World).bind('contextmenu', function(e) {
			for (var i = 0; i < Logic.selected.length; i++) {
				Logic.selected[i].moveTo(e.pageX, e.pageY, Logic.ctrl);
			}
			return false;
		}).click(function() {
			for (var i = 0; i < Logic.selected.length; i++) {
				Logic.selected[i].dom.toggleClass('selected');
			}
			Logic.selected = [];
		});
	};
	
	Logic.run = function() {
		for (var i = 0; i < Logic.units.length; i++) {
			Logic.units[i].update();
		}
		window.requestAnimationFrame(Logic.run);
	};
	
	var State = function(type, x, y) {
		if (type == 'move') {
			f = function(states) {
				var dx = x - this.x;
				var dy = y - this.y;
				if (Math.abs(dx + dy) < this.speed+2) {
					this.states.pop();
					return;
				}
				var a = (dx == 0) ? Math.PI/2 : Math.atan2(dy, dx);
				this.x += Math.cos(a) * this.speed;
				this.y += Math.sin(a) * this.speed;
				this.dom.css('transform', 'translate(' + this.x + 'px, ' + this.y + 'px)');
			};
		}
		f.type = type;
		return f;
	};
	
	var Unit = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
		this.width = 10;
		this.height = 10;
		this.speed = 5;
		this.img = '../img/Bream.svg';
		this.dom = null;
		this.states = [];
	};
	
	Unit.prototype = {
		destroy: function() {
			return;
		},
		moveTo: function(x, y, queue) {
			var s = State('move', x, y);
			var l = this.states.length;
			if (queue) {
				this.states.unshift(s);
			} else {
				while (l > 0 && this.states[l-1].type == s.type) {
					this.states.pop();
					l--;
				}
				this.states.push(s);
			}
			return this;
		},
		addTo: function(w) {
			this.dom = $('<div>').addClass('unit');
			this.dom.css('background-image', this.img);
			this.dom.css('transform', 'translate(' + this.x + 'px, ' + this.y + 'px)');
			var _this = this;
			this.dom.click(function() {
				$(this).toggleClass('selected');
				var i = Logic.selected.indexOf(_this);
				if (i == -1) {
					Logic.selected.push(_this);
				} else {
					Logic.selected.splice(i, 1);
				}
				return false;
			});
			w.append(this.dom);
		},
		update: function() {
			var l = this.states.length -1;
			if (l < 0) {
				return;
			}
			this.states[l].apply(this);
		}
	};
	
	var HQ = (function() {
		var cst = function() {
			this.img = '../img/';
		};
	})();
	
	var u = new Unit(30, 30);
	window.u = u;
	Logic.addUnit(u);
	
	Logic.run();
	window.Logic = Logic;
})(window);