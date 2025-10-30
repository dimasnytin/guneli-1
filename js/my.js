
        // Сортировка
        $('.portfolio-sort__item').click(function () {
            $('.portfolio-sort__item').removeClass('active');
            $(this).addClass('active');
            let orderby = '';
            let order = '';
            if($(this).data('orderby')){
                orderby = $(this).data('orderby');
                order = $(this).data('order');
            }
            $('#filter').find('input[name="orderby"]').val(orderby);
            $('#filter').find('input[name="order"]').val(order);
            sendFilter();
        })

        $('.portfolio-filters__open').click(function(){
            $('.portfolio-filters').addClass('active');
        });
        $('.portfolio-filters__close, .portfolio-filters__btn').click(function(){
            $('.portfolio-filters').removeClass('active');
        });

        $('.portfolio-filters__btn-reset').click(function(){
            let form = $(this).parents('form')
            form.find('input[type="checkbox"]').prop( "checked", false );
            form.find('input[type="number"]').val('');
            sendFilter();
            return false;
        });
        
        $('#filter').submit(function(){
            sendFilter();
        });

        function sendFilter(reset = true) {
            var filter = $('#filter');
            $.ajax({
                url:filter.attr('action'),
                data:filter.serialize(), 
                type:filter.attr('method'), 
                beforeSend:function(xhr){
                    filter.find('.portfolio-filters__btn-send').text('Загрузка...');
                },
                success:function(data){
                    filter.find('.portfolio-filters__btn-send').text('Применить'); 
                    $('.container-flex').html(data); 
					$('.container-flex [singleSliderNoLoop_JS]').each(function () {
						var $container = $(this).find('.swiper-container'),
							$prevBtn = $(this).find('.slider-prev-btn'),
							$nextBtn = $(this).find('.slider-next-btn'),
							$pagination = $(this).find('.slider-pagination');

						new Swiper($container, {
							direction: 'horizontal',
							slidesPerView: 1,
							speed: 500,
							observer: true,
							observeParents: true,
							spaceBetween: 10,
							navigation: {
								nextEl: $nextBtn,
								prevEl: $prevBtn,
							},
							pagination: {
								el: $pagination,
								type: 'bullets',
							}
						});
					});
					$('.portfolio-pagination').find('.nav-links').attr('data-lastpage', $('.portfolio-maxpages').text()); 
					resetPagination(reset);
                }
            });
            return false;
        }
			
		$('.portfolio-pagination a').on('click', function (e) {
			e.preventDefault();
			let pagination = $('.portfolio-pagination');
			let navLinks = pagination.find('.nav-links');
			let prevBtn = pagination.find('.prev-btn');
			let nextBtn = pagination.find('.next-btn');
			let page = $(this).attr('href').split('?page=')[1];
			navLinks.attr('data-page', page)
			prevBtn.attr('href', `?page=${+page-1}`)
			nextBtn.attr('href', `?page=${+page+1}`)
			if( page == 1 ){
				prevBtn.hide()
			}else{
				prevBtn.show()
			}
			if( page == navLinks.attr('data-lastpage') ){
				nextBtn.hide()
			}else{
				nextBtn.show()
			}
			$('#filter').find('input[name="page_num"]').val(page);
			sendFilter(false);
			$('.portfolio-pagination a').removeClass( 'current' );
  			$('.portfolio-pagination .page-numbers').each(function( index ) {
				if($(this).text() == page)
			  	$(this).addClass( 'current' );
			});
			$([document.documentElement, document.body]).animate({
				scrollTop: $(".portfolio200").offset().top
			}, 500);
		});
			
        
			
		function resetPagination(reset){
			if(reset == false){
				return;
			}
			$('#filter').find('input[name="page_num"]').val(1);
			let maxPage = $('.portfolio-pagination').find('.nav-links').attr('data-lastpage'); 
			if(maxPage == 1){
				$('.portfolio-pagination').find('.nav-links').hide();
			}else{
				$('.portfolio-pagination').find('.nav-links').show();
			}
			$('.portfolio-pagination').find('.prev-btn').attr('href', 1);
			$('.portfolio-pagination').find('.prev-btn').hide();
			$('.portfolio-pagination').find('.next-btn').attr('href', 2);
			$('.portfolio-pagination').find('.next-btn').show();
			$('.portfolio-pagination a').removeClass( 'current' ); 
			$('.portfolio-pagination .page-numbers').first().addClass( 'current' );
		}


        //Динамический поиск
        jQuery(document).ready(function($) {
            $('.search-form__input').on('input', function() {
                var searchQuery = $(this).val();
                if (searchQuery.length > 2) {
                    console.log(searchQuery);
                    $.ajax({
                        url: 'https://alex-dein.ru/portfolio/delivery/wp-admin/admin-ajax.php',
                        type: 'POST',
                        data: {
                            action: 'live_search',
                            search_query: searchQuery
                        },
                        success: function(response) {
                            $('.search-form-results').html(response);
                            if(2501 != 2534){
                                $('.search-form-results-wrap').addClass('active');
                            }
                        }
                    });
                } else {
                    $('.search-form-results').html('');
                    $('.search-form-results-wrap').removeClass('active');
                }
            });
        });


        // Поиск
        $('.header .search-form').submit(function(e){
            e.preventDefault();
            let value = $(this).find('.search-form__input').val();
            let page = 'https://alex-dein.ru/portfolio/delivery/search/';
            location.href = page + '?search=' + value;
        });

		let href = window.location.href;

        if(href.includes('/search/?search')) {
            href = new URL(href)
            let searchVal = href.searchParams.get("search")
            $('.search .search-form__input').val(searchVal)
            searchFunction();
        }
        
        const searchResults = $(".search .search-result");

        $(".search .search-form__input").keyup(function () {
            searchFunction()
        });

        function searchFunction() {
            let search_value = $(".search .search-form__input").val();

            if (search_value.length > 2) {
                $.ajax({
                    url: $('.search-form').attr('action'),
                    type: "POST",
                    data: {
                        "action": "ajax_search",
                        "term": search_value
                    },
                    success: function (results) {
                        searchResults.fadeIn(200).html(results);
						$('select').niceSelect();
                   	 	$('.catalog__item select.item-select').trigger("change");
                        let count = $('.search-count').text();
                        if( count == '0'){
                            $('.search-header').text('Ничего не найдено. Попробуйте еще раз.')
                        }else{
                            let result;
                            switch (count) {
                                case '1':
                                    result = 'результат'
                                    break;
                                case '2':
                                case '3':
                                case '4':
                                    result = 'результата'
                                    break;
                            
                                default:
                                    result = 'результатов'
                                    break;
                            }
                            $('.search-header').html(`Найдено <span>${count}</span> ${result}`)
                        }
                        
                    }
                });
            } else {
                searchResults.fadeOut(200);
            }
        }






		$('[phoneMask_JS]').mask('+7(999)999-99-99');

        //Отправка заявок
        $('form').on('submit', function(e){
            e.preventDefault();
            let thanks = 'https://alex-dein.ru/portfolio/delivery/spasibo/';
            if($(this).data('thanks')){
                thanks = $(this).data('thanks')
            }
            let inputPhone = $(this).find('input[name="phone"]')
            if(inputPhone.val().length >= 15){
                let formData = new FormData(this);
                formData.append('url', document.location.href);
                let file = $(this).data('file');
                let btn = $(this).find('.form-btn');
                btn.find('span').text('Загрузка...');
                btn.text('Загрузка...');
                $.ajax({
                    url: 'https://alex-dein.ru/portfolio/delivery/wp-admin/admin-ajax.php',
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        if (file){
                            let link = document.createElement('a');
                            link.setAttribute('href', file);
                            link.setAttribute('target', '_blank');
                            link.setAttribute('download','download');
                            link.click();
                        }
                        location.href = thanks;
                    },
					error: function(xhr, status, error) {
                                    $(this).find('input[name="phone"]').addClass('validate_error');
                                    btn.find('span').text('Загрузка...');
                                }
                });
            }else{
                inputPhone.addClass('validate_error')
                setTimeout(function(){ 
                    inputPhone.removeClass('validate_error')
                }, 2000);
            }
        })
        