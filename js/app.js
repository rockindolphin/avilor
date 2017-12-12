$(document).ready(function() {
	
	//внешние svg в ie11
	svg4everybody();
	
	// position: sticky; polifill
	var stickyElements = document.querySelectorAll('.stickyfill');
	Stickyfill.add(stickyElements);

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
		$('.page__header').toggleClass('header--menu-open');
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


});	