'use strict';

(function ($) {
	$(document).ready(function () {
		//костыль для drupal
		function replaceTag(elem, newTag, attrs) {
			var rez = $('<' + newTag + ' />').append($(elem).contents());
			attrs.map(function (attrName) {
				$(rez).attr(attrName, $(elem).attr(attrName));
			});
			return rez;
		}
		$('ul[class^=chosen-]').each(function () {
			$(this).find('li').replaceWith(function () {
				return replaceTag(this, 'option', ['value']);
			});
			$(this).replaceWith(function () {
				return replaceTag(this, 'select', ['data', 'class', 'tabindex']);
			});
		});
		$('.product__filter').each(function () {
			$(this).find('dt').replaceWith(function () {
				return replaceTag(this, 'input', ['class', 'type', 'value', 'id', 'name', 'checked']);
			});
			$(this).find('dd').replaceWith(function () {
				return replaceTag(this, 'label', ['class', 'for']);
			});
		});

		var productOpen = false;

		//внешние svg в ie11
		try {
			svg4everybody();
		} catch (error) {
			console.log(error);
		}

		//ширина скроллбара
		var scrollMeasure = $('<div>').addClass('scroll__measure').get(0);
		$('body').append(scrollMeasure);
		var scrollbarWidth = scrollMeasure.offsetWidth - scrollMeasure.clientWidth;
		$(':root').css('--scrollbar-width', scrollbarWidth + 'px');
		if (scrollbarWidth > 0) {
			$('.scroll--cutt').css({
				marginRight: -scrollbarWidth
			});
		}

		//меню в шапке
		$('.header__menu-btn button').click(function () {
			if (!productOpen) {
				$('.page__header').toggleClass('header--menu-open');
				$('.page').toggleClass('scroll--locked'); //disable page scroll		
			}
		});

		//подменю
		$('.header__menu-list .btn').click(function () {
			var li = $(this).closest('.list__item');
			if ($(li).find('.list').length > 0) {
				$(li).toggleClass('item--active-trail');
			}
		});

		//disable outline on click
		$("body").on("mousedown", "*", function (e) {
			if (($(this).is(":focus") || $(this).is(e.target)) && $(this).css("outline-style") == "none") {
				$(this).css("outline", "none").on("blur", function () {
					$(this).off("blur").css("outline", "");
				});
			}
		});

		//chosen
		var config = {
			'.chosen-select': {},
			'.chosen-select-deselect': { allow_single_deselect: true },
			'.chosen-select-no-single': { disable_search_threshold: 10 },
			'.chosen-select-no-results': { no_results_text: 'Ничего не найдено' },
			'.chosen-select-width': { width: '95%' }
		};
		for (var selector in config) {
			$(selector).chosen(config[selector]);
		}

		//section bg
		$('img[data-bg=true]').each(function () {
			var src = $(this).attr('src');
			var parent = $(this).parent();
			if ($(parent).is('picture')) {
				src = $(parent).find('img').get(0).currentSrc;
				parent = $(parent).parent();
			}
			$(parent).css({
				'background-image': 'url(' + src + ')'
			});
			$(this).hide();
		});

		//slider
		var frontSliderPics = new Swiper('.slider--front-pics .swiper-container', {
			slidesPerView: 1,
			on: {
				slideChange: function slideChange() {
					frontSliderText.slideTo(this.activeIndex);
				}
			}
		});

		var frontSliderText = new Swiper('.slider--front-text .swiper-container', {
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets'
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			on: {
				slideChange: function slideChange() {
					frontSliderPics.slideTo(this.activeIndex);
				}
			}
		});

		//параллакс
		if ($('.parallax__layer').length > 0) {
			var rellax = new Rellax('.parallax__layer');
		}

		//продукты
		var modalHtml = '<div class="blog blog--wide">\n\t<div class="modal product__modal">\n\t\t<div class="wrapper page__wrapper">\n\t\t\t<div class="text--right">\n\t\t\t\t<button class="btn btn--clr product__btn">\n\t\t\t\t\t<svg class="icon icon--active icon--close">\n\t\t\t\t\t\t<use xlink:href="#close"></use>\n\t\t\t\t\t</svg>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class="product product--open">\n\t\t\t\t<div class="text--center">\n\t\t\t\t\t<h4 class="product__title"></h4>\n\t\t\t\t</div>\n\t\t\t\t<div class="product__pic"></div>\n\t\t\t\t<div class="product__barcode"></div>\n\t\t\t\t<div class="product__excerpt"></div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>';

		function loadProductData(product) {
			var productOpen = $('.product--open');
			var fields = ['title', 'barcode', 'pic', 'excerpt'];
			fields.map(function (field) {
				$(productOpen).find('.product__' + field).html('').html($(product).find('.product__' + field).html());
			});
			$(productOpen).find('.product__badges').remove();
			var barcode = $(productOpen).find('.product__barcode');
			if ($(barcode).text().length > 0) {
				$(productOpen).find('.product__excerpt').prepend('<h6>\u0428\u0442\u0440\u0438\u0445-\u043A\u043E\u0434</h6><p>' + $(barcode).text() + '</p>');
				$(barcode).hide();
			}
		}

		function toggleProductModal() {
			var scrolltop;
			if (!productOpen) {
				scrollTop = document.documentElement.scrollTop;
			}
			$('.page').toggleClass('page--product-open');
			$('.product__modal').toggleClass('modal--open');
			$('.page__main>.page__wrapper').toggleClass('item--hidden');
			if (!productOpen) {
				$('html, body').animate({
					scrollTop: 0
				}, 400);
			}
			if (productOpen) {
				document.documentElement.scrollTop = scrollTop;
			}
			productOpen = !productOpen;
		}

		var scrollTop = 0;
		if ($('.product[data-modal="product"]').length > 0) {

			$('.page__main').append(modalHtml);

			$('.product[data-modal="product"]').click(function (evt) {
				evt.preventDefault();
				loadProductData(this);
				toggleProductModal();
			});

			$('.header__menu-btn button').click(function (evt) {
				if (productOpen) {
					toggleProductModal();
					evt.preventDefault();
				}
			});

			$('.product__btn').click(function () {
				toggleProductModal();
			});
		}

		//возвращает скритерии для фильтрации со значениями
		function getFilterCriterias() {
			var criterias = {};
			if ($('#group_filter').length === 1) {
				criterias['group'] = parseInt($('#group_filter').val());
				if (criterias['group'] === 0) {
					delete criterias['group'];
				}
			}
			if ($('#bad_filter').length === 1) {
				criterias['bad'] = $('#bad_filter input:checked').attr('value') === 'bad';
			}
			return criterias;
		}

		// скрывает/показывает продукты/группы продуктов взависимости от критериев
		function filterProducts() {
			var criterias = getFilterCriterias();
			console.log(criterias);
			var visibleTotal = 0;
			for (var group in products) {
				var visibleItems = 0;
				products[group]['items'].map(function (product) {
					product.visible = true;
					for (var key in criterias) {
						product.visible = product.visible && criterias[key] === product[key];
					}
					if (product.visible) {
						$(product.node).show(400);
						visibleItems++;
					} else {
						$(product.node).hide(400);
					}
				});
				if (visibleItems > 0) {
					$(products[group]['node']).show(400);
					visibleTotal++;
				} else {
					$(products[group]['node']).hide(400);
				}
			}
			if (visibleTotal > 0) {
				$('#no-results').hide();
			} else {
				$('#no-results').show();
			}
		}

		var products = {};
		$('.product__group-wrapper').each(function () {
			//парсим продукты
			var group = parseInt($(this).attr('data-group'));
			products[group] = { node: this, items: [] };
			$(this).find('.product').each(function () {
				var item = {
					node: this,
					group: group,
					bad: $(this).attr('data-bad') === 'true',
					product: $(this).attr('data-product') === 'true',
					visible: true
				};
				products[group].items.push(item);
			});
		});

		$('#group_filter, #bad_filter').change(function () {
			filterProducts();
		});
		filterProducts();
	});
})(jQuery);
//# sourceMappingURL=app.js.map
