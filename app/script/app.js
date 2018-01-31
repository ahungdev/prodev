$(document).ready(function () {
	App.init();
});

var CLASS = {
	_isActive: 'is-active',
	_modalOpen: 'modal-open'
};

var BODY = $('body'),
	WINDOW = $(window),
	DOCUMENT = $(document),
	WIN_WIDTH = WINDOW.width(),
	WIN_HEIGHT = WINDOW.height(),
	DOC_WIDTH = DOCUMENT.width(),
	DOC_HEIGHT = DOCUMENT.height();

var App = {

	init: function () {
		App.device();
		App.resize(App.device);
		Modal.init();
		//Lines.init();

		$('.owl-carousel').owlCarousel({
			loop: true,
			margin: 0,
			items: 1
		});
	},

	device: function () {

		BODY.removeClass('mobile tablet landscape desktop');

		if (Detect.isLandscape()) {
			BODY.addClass('landscape');
		}

		if (Detect.isMobile()) {
			BODY.addClass('mobile');
		} else if (Detect.isTablet()) {
			BODY.addClass('tablet');
		} else {
			BODY.addClass('desktop');
		}

	},

	resize: function (func, timer) {
		var resizeTimer = 0;
		if (timer === undefined) {
			timer = 300;
		}
		WINDOW.on('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(func, timer);
		});
	},

	scroll: function (func, element) {
		var element = element !== undefined ? $(element) || element : WINDOW;
		element.on('scroll', func);
	},

	setCookie: function (key, value) {
		var expires = new Date();
		expires.setTime(expires.getTime() + (0.5 * 24 * 60 * 60 * 1000));
		document.cookie = key + '=' + value + ';path=/' + ';expires=' + expires.toUTCString();
	},

	getCookie: function (key) {
		var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
		return keyValue ? keyValue[2] : null;
	},

	getResize: function () {
		WIN_WIDTH = WINDOW.width();
		WIN_HEIGHT = WINDOW.height();
		DOC_WIDTH = DOCUMENT.width();
		DOC_HEIGHT = DOCUMENT.height();
	},

	getScrollTop: function () {
		return BODY.scrollTop();
	},

	getScrollBarWidth: function () {
		var outer = $('<div>').css({
			visibility: 'hidden',
			width: 100,
			overflow: 'scroll'
		}).appendTo('BODY'),
			widthWithScroll = $('<div>').css({
				width: '100%'
			}).appendTo(outer).outerWidth();
		outer.remove();
		return 100 - widthWithScroll;
	},

	preload: function (loader, callback) {
		var loader = $(loader) || loader,
			probar = loader.find('.probar'),
			percent = loader.find('.percent'),
			items = [],
			current = 0,
			callback = callback || function (flag) { };

		function init() {
			if (App.getCookie('preload')) {
				animateLoad();
			} else {
				getImages();
			}
		}

		function getImages() {
			BODY.find('*:not(script)').each(function (i, e) {
				var url = '';
				if ($(e).css('background-image').indexOf('none') == -1 && $(e).css('background-image').indexOf('-gradient') == -1) {
					url = $(this).css('background-image');
					if (url.indexOf('url') != -1) {
						var temp = url.match(/url\((.*?)\)/);
						url = temp[1].replace(/\"/g, '');
					}
				} else if ($(e).get(0).nodeName.toLowerCase() == 'img' && typeof ($(e).attr('src')) != 'undefined') {
					url = $(e).attr('src');
				}

				if (url.length > 0) {
					items.push(url);
				}
			});

			if (items.length <= 0) {
				items.push('img/blank.png');
			}

			items.forEach(function (e, i) {
				loadImg(e);
			});

		}

		function loadImg(url) {
			var imgLoad = new Image();
			imgLoad.onload = function () {
				completeLoad();
			}
			imgLoad.onerror = function () {
				completeLoad();
			}
			imgLoad.src = url;
		}

		function completeLoad() {
			current++;
			var percentText = Math.round((current / items.length) * 100);

			percent.text(percentText + '%');

			TweenMax.to(probar, 1, {
				width: percentText + '%',
				ease: Power0.easeOut
			});

			if (current >= items.length) {
				current = items.length;
				App.setCookie('preload', 'loaded');
				animateLoad();
			}
		}

		function animateLoad() {

			percent.text('100%');

			TweenMax.to(probar, 1, {
				width: '100%',
				ease: Power0.easeOut,
				onComplete: function () {
					TweenMax.to(loader, 1, {
						autoAlpha: 0,
						delay: 0.3,
						ease: Power3.easeOut,
						onComplete: function () {
							loader.remove();
							callback(true);
						}
					});
				}
			});
		}

		init();

	}
};

var Detect = {

	isMobile: function () {
		if (navigator.userAgent.match(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i)) return true;
		else return false;
	},

	isTablet: function () {
		if (navigator.userAgent.match(/Tablet|iPad/i)) return true;
		else return false;
	},

	isDesktop: function () {
		if (!this.isMobile() && !this.isTablet()) return true;
		else return false;
	},

	isLandscape: function () {
		if (WIN_HEIGHT < WIN_WIDTH) return true;
		else return false;
	}

};

var Modal = {

	_modal: {},
	_modalDialog: {},
	_modalBack: {},
	_modalShow: {},
	_modalClose: {},
	_modalDialogShow: {},
	_modalOverlay: {},
	_modalDialogHeight: 0,
	_bodyPos: 0,
	_isModalShow: true,
	_isModalResize: false,

	init: function () {

		Modal._modal = $('.modal');
		Modal._modalOverlay = $('.modal-overlay');
		Modal._modalDialog = Modal._modal.find('.modal-dialog');
		Modal._modalClose = Modal._modal.find('.button-close');
		Modal._modalClose.on('click', Modal.close);

		$('.button-login').on('click', function (evt) {
			evt.preventDefault();
			Modal.open('.modal-login');
		});

		$('.button-register').on('click', function (evt) {
			evt.preventDefault();
			Modal.open('.modal-register', '.modal-login');
		});

	},

	open: function (element, modalBack) {

		Modal._modalShow = $(element) || element;
		Modal._modalBack = modalBack !== undefined ? modalBack : '';
		Modal._modalDialogShow = Modal._modalShow.find('.modal-dialog');
		Modal._isModalResize = true;
		Modal.show();

	},

	show: function () {

		if (Modal._isModalShow) {

			Modal._isModalShow = false;
			Modal._bodyPos = App.getScrollTop();

			TweenMax.set(Modal._modalOverlay, {
				display: 'block',
				autoAlpha: 0
			});

			TweenMax.to(Modal._modalOverlay, 0.3, {
				autoAlpha: 1,
				ease: Power1.easeOut,
				onComplete: function () {
					Modal.animate();
				}
			});

		} else {

			TweenMax.to(Modal._modalDialog, 0.3, {
				autoAlpha: 0,
				marginTop: 100,
				ease: Back.easeOut,
				onComplete: function () {
					Modal._modal.removeAttr('style');
					Modal._modalDialog.removeAttr('style');
					Modal.removePlugin();
					Modal.animate();
				}
			});

		}

	},

	animate: function () {

		TweenMax.set(Modal._modalShow, {
			display: 'block'
		});

		TweenMax.set(Modal._modalDialogShow, {
			autoAlpha: 0,
			marginTop: 100
		});

		TweenMax.to(Modal._modalDialogShow, 0.3, {
			autoAlpha: 1,
			marginTop: 0,
			ease: Back.easeOut
		});

		Modal.setup();
		App.resize(Modal.setup);
		BODY.addClass(CLASS._modalOpen);
		Modal.addPlugin();

	},

	setup: function () {

		if (Modal._isModalResize) {

			App.getResize();
			Modal._modalDialogHeight = Modal._modalDialogShow.outerHeight();

			if (WIN_HEIGHT > Modal._modalDialogHeight) {

				TweenMax.set(Modal._modalDialogShow, {
					position: 'fixed',
					top: '50%',
					left: '50%',
					x: '-50%',
					y: '-50%'
				});

			} else {

				TweenMax.set(Modal._modalDialogShow, {
					position: 'relative',
					top: 'auto',
					left: 'auto',
					x: '0%',
					y: '0%'
				});

			}

			if (DOC_HEIGHT > WIN_HEIGHT) {

				TweenMax.set(BODY, {
					marginTop: -Modal._bodyPos,
					paddingRight: App.getScrollBar()
				});

			} else {

				TweenMax.set(BODY, {
					marginTop: -Modal._bodyPos,
					paddingRight: 0
				});

			}

		}

	},

	close: function () {

		if (Modal._modalBack) {

			Modal.open(Modal._modalBack);

		} else {

			Modal._isModalShow = true;
			Modal._isModalResize = false;

			TweenMax.to(Modal._modalDialogShow, 0.3, {
				autoAlpha: 0,
				marginTop: 100,
				ease: Back.easeIn,
				onComplete: function () {
					TweenMax.to(Modal._modalOverlay, 0.3, {
						autoAlpha: 0,
						delay: 0.2,
						ease: Power1.easeOut,
						onComplete: function () {
							BODY.removeClass(CLASS._modalOpen);
							BODY.removeAttr('style');
							WINDOW.scrollTop(Modal._bodyPos);
							Modal._modal.scrollTop(0);
							Modal._modalShow.removeAttr('style');
							Modal._modalDialogShow.removeAttr('style');
							Modal._modalOverlay.removeAttr('style');
							Modal.removePlugin();
						}
					});
				}
			});
		}
	},

	addPlugin: function () {

	},

	removePlugin: function () {

	}
};

var Lines = {
	init: function () {
		Lines.animateLine('pattern-1');
		Lines.animateLine('pattern-2');
	},

	animateLine: function (id) {
		var ctx, circ, nodes, mouse, SENSITIVITY, SIBLINGS_LIMIT, DENSITY, NODES_QTY, ANCHOR_LENGTH, MOUSE_RADIUS;

		SENSITIVITY = 100;
		SIBLINGS_LIMIT = 10;
		DENSITY = 50;
		NODES_QTY = 0;
		ANCHOR_LENGTH = 20;
		MOUSE_RADIUS = 200;

		circ = 2 * Math.PI;
		nodes = [];

		canvas = document.getElementById(id);
		resizeWindow();
		mouse = {
			x: canvas.width / 2,
			y: canvas.height / 2
		};
		ctx = canvas.getContext('2d');
		if (!ctx) {
			alert("Ooops! Your browser does not support canvas");
		}

		function Node(x, y) {
			this.anchorX = x;
			this.anchorY = y;
			this.x = Math.random() * (x - (x - ANCHOR_LENGTH)) + (x - ANCHOR_LENGTH);
			this.y = Math.random() * (y - (y - ANCHOR_LENGTH)) + (y - ANCHOR_LENGTH);
			this.vx = Math.random() * 2 - 1;
			this.vy = Math.random() * 2 - 1;
			this.energy = Math.random() * 100;
			this.radius = Math.random();
			this.siblings = [];
			this.brightness = 0;
		}

		Node.prototype.drawNode = function () {
			var color = "rgba(255, 0, 0, " + this.brightness + ")";
			ctx.beginPath();
			ctx.arc(this.x, this.y, 2 * this.radius + 2 * this.siblings.length / SIBLINGS_LIMIT, 0, circ);
			ctx.fillStyle = color;
			ctx.fill();
		};

		Node.prototype.drawConnections = function () {
			for (var i = 0; i < this.siblings.length; i++) {
				var color = "rgba(255, 0, 0, " + this.brightness + ")";
				ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(this.siblings[i].x, this.siblings[i].y);
				ctx.lineWidth = 1 - calcDistance(this, this.siblings[i]) / SENSITIVITY;
				ctx.strokeStyle = color;
				ctx.stroke();
			}
		};

		Node.prototype.moveNode = function () {
			this.energy -= 2;
			if (this.energy < 1) {
				this.energy = Math.random() * 100;
				if (this.x - this.anchorX < -ANCHOR_LENGTH) {
					this.vx = Math.random() * 2;
				} else if (this.x - this.anchorX > ANCHOR_LENGTH) {
					this.vx = Math.random() * -2;
				} else {
					this.vx = Math.random() * 4 - 2;
				}
				if (this.y - this.anchorY < -ANCHOR_LENGTH) {
					this.vy = Math.random() * 2;
				} else if (this.y - this.anchorY > ANCHOR_LENGTH) {
					this.vy = Math.random() * -2;
				} else {
					this.vy = Math.random() * 4 - 2;
				}
			}
			this.x += this.vx * this.energy / 150;
			this.y += this.vy * this.energy / 150;
		};

		function initNodes() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			nodes = [];
			for (var i = DENSITY; i < canvas.width; i += DENSITY) {
				for (var j = DENSITY; j < canvas.height; j += DENSITY) {
					nodes.push(new Node(i, j));
					NODES_QTY++;
				}
			}
		}

		function calcDistance(node1, node2) {
			return Math.sqrt(Math.pow(node1.x - node2.x, 2) + (Math.pow(node1.y - node2.y, 2)));
		}

		function findSiblings() {
			var node1, node2, distance;
			for (var i = 0; i < NODES_QTY; i++) {
				node1 = nodes[i];
				node1.siblings = [];
				for (var j = 0; j < NODES_QTY; j++) {
					node2 = nodes[j];
					if (node1 !== node2) {
						distance = calcDistance(node1, node2);
						if (distance < SENSITIVITY) {
							if (node1.siblings.length < SIBLINGS_LIMIT) {
								node1.siblings.push(node2);
							} else {
								var node_sibling_distance = 0;
								var max_distance = 0;
								var s;
								for (var k = 0; k < SIBLINGS_LIMIT; k++) {
									node_sibling_distance = calcDistance(node1, node1.siblings[k]);
									if (node_sibling_distance > max_distance) {
										max_distance = node_sibling_distance;
										s = k;
									}
								}
								if (distance < max_distance) {
									node1.siblings.splice(s, 1);
									node1.siblings.push(node2);
								}
							}
						}
					}
				}
			}
		}

		function redrawScene() {
			resizeWindow();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			findSiblings();
			var i, node, distance;
			for (i = 0; i < NODES_QTY; i++) {
				node = nodes[i];
				distance = calcDistance({
					x: mouse.x,
					y: mouse.y
				}, node);
				if (distance < MOUSE_RADIUS) {
					node.brightness = 1 - distance / MOUSE_RADIUS;
				} else {
					node.brightness = 0;
				}
			}
			for (i = 0; i < NODES_QTY; i++) {
				node = nodes[i];
				if (node.brightness) {
					node.drawNode();
					node.drawConnections();
				}
				node.moveNode();
			}
			requestAnimationFrame(redrawScene);
		}

		function initHandlers() {
			document.addEventListener('resize', resizeWindow, false);
			canvas.addEventListener('mousemove', mousemoveHandler, false);
		}

		function resizeWindow() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		function mousemoveHandler(e) {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		}

		initHandlers();
		initNodes();
		redrawScene();
	}
}