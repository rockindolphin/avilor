$(document).ready(function() {
	
	var productOpen = false;

	//внешние svg в ie11
	svg4everybody();

	//ширина скроллбара
	var scrollMeasure = $('<div>').addClass('scroll__measure').get(0);
	$('body').append(scrollMeasure);
	var scrollbarWidth = scrollMeasure.offsetWidth - scrollMeasure.clientWidth;
	$(':root').css('--scrollbar-width', scrollbarWidth+'px');
	if( scrollbarWidth > 0 ){
		$('.scroll--cutt').css({
			marginRight: -scrollbarWidth
		});		
	}

	//меню в шапке
	$('.header__menu-btn button').click(function(){
		if( !productOpen ){
			$('.page__header').toggleClass('header--menu-open');		
		}
	});

	//подменю
	$('.header__menu-list .btn').click(function(){
		var li = $(this).closest('.list__item');
		if( $(li).find('.list').length > 0 ){
			$(li).toggleClass('item--open');
		}
	});	

	//disable outline on click
	$("body").on("mousedown", "*", function(e) {
		if (($(this).is(":focus") || $(this).is(e.target)) && $(this).css("outline-style") == "none") {
			$(this).css("outline", "none").on("blur", function() {
				$(this).off("blur").css("outline", "");
			});
		}		
	});

	//продукт
	function toggleProductModal(){
		$('.page').toggleClass('page--product-open');
		$('.product__modal').toggleClass('modal--open');
		$('.page__main>.page__wrapper').toggleClass('item--hidden');		
		productOpen = !productOpen;
	}

	$('.product[data-modal="product"]').click(function(){
		toggleProductModal();
	});	
	$('.header__menu-btn button').click(function(evt){
		if( productOpen ){
			toggleProductModal();
			evt.preventDefault();		
		}
	});	
	$('.product__btn').click(function(){
		toggleProductModal();
	});	


	var config = {
		'.chosen-select'           : {},
		'.chosen-select-deselect'  : { allow_single_deselect: true },
		'.chosen-select-no-single' : { disable_search_threshold: 10 },
		'.chosen-select-no-results': { no_results_text: 'Ничего не найдено' },
		'.chosen-select-rtl'       : { rtl: true },
		'.chosen-select-width'     : { width: '95%' }
	};
	for (var selector in config) {
		$(selector).chosen(config[selector]);
	}

	//section bg
	$('img[data-bg=true]').each(function(){
		var src = $(this).attr('src');
		var parent = $(this).parent();
		if( $(parent).is('picture') ){
			src = $(parent).find('img').get(0).currentSrc;
			parent =  $(parent).parent();
		}
		$(parent).css({
			'background-image': `url(${src})`
		});
		$(this).hide();
	});

	//slider
	var frontSliderPics = new Swiper('.slider--front-pics .swiper-container', {
		slidesPerView: 1,
		on: {
			slideChange: function(){
				frontSliderText.slideTo( this.activeIndex );
			} 
		}
	});

	var frontSliderText = new Swiper('.slider--front-text .swiper-container', {
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		on: {
			slideChange: function(){
				frontSliderPics.slideTo( this.activeIndex );
			} 		
		}
	});

	//параллакс
	if( $('.parallax__layer').length > 0 ){
		var rellax = new Rellax('.parallax__layer');	
	}

});	