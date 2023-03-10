require([
        'jquery',
        'jquery/ui'
    ],

    function ($) {
        console.log('main-index.js');
        worx2 = {
            init2: function () {
                var _that = this;
                _that.mix();
                _that.product();
                _that.about();
                _that.history();
                _that.ajaxWishList();
                _that.contact();
                _that.brands();
            },
            brands:function(){
                if (jQuery('.barnd-page').length) {
                    window.onresize = function () {
                        mGalleryHeight();
                    }

                jQuery('.barnd-page button.show-more-gall').click(function () {
                    if (!jQuery('.barnd-page .row-6').hasClass('gallery-open')) {
                        jQuery('.barnd-page .row-6').addClass('gallery-open');
                        jQuery('.barnd-page .row-6 .in ul li.all-images').show();
                        mGalleryHeight();
                    } else {
                        jQuery('.barnd-page .row-6').removeClass('gallery-open');
                        jQuery('.barnd-page .row-6 .in ul li.all-images').hide();
                        mGalleryHeight();
                    }
                })
                mGalleryHeight();
                function mGalleryHeight() {
                    var numCols;
                    console.log($(window).width());
                    if ($(window).width() > 1023 ) {
                        numCols = 3;
                    } else {
                        numCols = 2;
                    }
                    const colHeights = Array(numCols).fill(0);
                    const container = document.getElementById('masonry-with-columns');
                    const bottomMargin = 25;
                    Array.from(container.children).forEach((child, i) => {
                        const order = i % numCols;
                        child.style.order = order;
                        colHeights[order] += parseFloat(child.clientHeight) + bottomMargin;
                    })
                    console.log(colHeights);
                    container.style.height = Math.max(...colHeights) + 'px';
                    jQuery('.barnd-page .row-6 ul.gallery-images').css('opacity',1);
                };
                    jQuery('.show-more-brand').on('click', function (e) {
                        e.preventDefault();
                        jQuery('.brand-popup-w').show();
                    })
                    jQuery('.brand-popup-w .close, .brand-popup-w .close-button').on('click', function () {
                        jQuery('.brand-popup-w').hide();
                    })
                    jQuery('.brand-popup-w').on('click', function (e) {
                        if (e.target == jQuery('.brand-popup-w')[0]) {
                            jQuery('.brand-popup-w').hide();
                        };
                    })
                    jQuery(document).keyup(function (e) {
                        if (e.key === "Escape") {
                            jQuery('.brand-popup-w').hide();
                        }
                    });
                };

                var buttonTag = $('.brands-tags-w li button'),
                    brand = $('.brands-list-w ul li'),
                    allBtn = $('.index-row-5-brands-index .button-bottom.button-1.primary');

                let brandUrl = new URL(window.location.href),
                    filterBrand = brandUrl.searchParams.get("category");
                if (filterBrand) {
                    allBtn.show();
                }
                buttonTag.on('click',function(){
                    var tagSel = $(this).attr('tag');
                    if ($(this).hasClass('active')) {
                        if (!filterBrand) {
                            allBtn.hide();
                        }
                        $(this).removeClass('active');
                        brand.each(function(){
                            jQuery(this).removeClass('hide')
                            jQuery('.selected-tag-h2').text('');
                        })
                    } else {
                        buttonTag.each(function(){
                            jQuery(this).removeClass('active')
                        });
                        $(this).addClass('active');
                        jQuery('.selected-tag-h2').text(tagSel);
                        brand.each(function(){
                            if ($(this).attr('tags').indexOf(tagSel) == -1) {
                                $(this).addClass('hide');
                            } else {
                                $(this).removeClass('hide');
                            }
                        })
                    }
                    buttonTag.each(function () {
                        if ($(this).hasClass('active')) {
                            allBtn.show();
                        }
                    });
                })

            },
            ajaxWishList: function () {

                jQuery(document).on('click', '.link.wishlist, .link.wishlist a', function (e) {

                    e.preventDefault();
                    if (jQuery('[data-userlogedin="1"]').length) {
                        window.location.href = '/wishlist/';

                    }
                    if (jQuery('[data-userlogedin="0"]').length) {
                            window.location.href = '/wishlist/';
                    }

                });


                jQuery('.account.wishlist-index-index  .btn-remove.action.delete').on('click', function (e) {
                    if (localStorage.getItem('wishlist_custom') != null) {
                        var wishlistarr = localStorage.getItem('wishlist_custom').split(',');
                        var index = wishlistarr.indexOf(jQuery(e.target).closest('li.product-item').find('[data-product-id]').attr('data-product-id'));
                        if (index !== -1) wishlistarr.splice(index, 1);
                        localStorage.setItem('wishlist_custom', wishlistarr);

                    }
                });

                if (jQuery('.ajax_wish_list_btn').length) {

                    if (jQuery('[data-userlogedin]').attr('data-userlogedin') == 1) {
                        addProductToWishlist(0, 'list', 0);
                    } else {

                        /*
                        if (jQuery('[data-userlogedin]').attr('data-userlogedin') == 0) {
                            if (localStorage.getItem('wishlist_custom') != null) {
                                jQuery('.ajax_wish_list_btn').each(function () {
                                    var wishlistarr = localStorage.getItem('wishlist_custom').split(',');
                                    if (wishlistarr.indexOf(jQuery(this).attr('productid_wish')) != -1) {
                                        jQuery(this).attr('in_wishlist', 1);
                                    }
                                })
                            }
                        }
*/
                        jQuery('.ajax_wish_list_btn').css('opacity', '1');
                    }


                    jQuery('.ajax_wish_list_btn').on('click', function () {
                        if (jQuery(this).attr('in_wishlist') == '0') {
                            addProductToWishlist(jQuery(this).attr('productid_wish'), 'add', this);
                        } else {
                            addProductToWishlist(jQuery(this).attr('productid_wish'), 'remove', this);
                        }
                    });

                    function renderWishList(wishlist) {
                        jQuery('.ajax_wish_list_btn').each(function () {
                            if (wishlist.indexOf(jQuery(this).attr('productid_wish')) != -1) {
                                jQuery(this).attr('in_wishlist', 1);
                            }
                            jQuery('.ajax_wish_list_btn').css('opacity', '1');
                        });

                        localStorage.setItem('wishlist_custom', wishlist);

                    }
                    function addProductToWishlist(productId, action, el) {
                        $.ajax({
                            url: '/upload/index/addtowishlistajax',
                            method: 'post',
                            data: 'productId=' + productId + '&action=' + action,
                            /*dataType: 'json',*/
                            showLoader: true,
                            success: function (data) {
                                console.log(data);
                                var redirect = data.result.redirect;
                                if (redirect) {
                                    if (jQuery('.social-login.login').length) {
                                        jQuery('.social-login.login').trigger('click');
                                    } else {
                                        window.location.href = 'customer/account/login';
                                    }

                                } else {

                                    if (action == 'add') {

                                        if (localStorage.getItem('wishlist_custom') != null) {

                                            var wishlistarr = localStorage.getItem('wishlist_custom').split(',');
                                            console.log(wishlistarr);
                                            console.log(jQuery(el).attr('productid_wish'));
                                            wishlistarr.push(jQuery(el).attr('productid_wish'));
                                            localStorage.setItem('wishlist_custom', wishlistarr);

                                        } else {

                                            console.log(jQuery(el).attr('productid_wish'));
                                            localStorage.setItem('wishlist_custom', jQuery(el).attr('productid_wish'));
                                        }


                                        jQuery(el).attr('in_wishlist', '1');
                                        console.log(' successfully added wish list message');
                                    }
                                    if (action == 'remove') {

                                        if (localStorage.getItem('wishlist_custom') != null) {
                                            var wishlistarr = localStorage.getItem('wishlist_custom').split(',');
                                            var index = wishlistarr.indexOf(jQuery(el).attr('productid_wish'));
                                            if (index !== -1) wishlistarr.splice(index, 1);
                                            localStorage.setItem('wishlist_custom', wishlistarr);
                                        }

                                        jQuery(el).attr('in_wishlist', '0');
                                        console.log(' successfully removed wish list message');
                                    }

                                    if (action == 'list') {
                                        renderWishList(data.list);
                                        console.log(data.list);
                                    }


                                }
                            }
                        });
                    }
                }
            },
            contact: function () {
                jQuery('.faq2-item .question').on('click',function(){
                    var item = jQuery(this).closest('.faq2-item');
                    if (item.hasClass('active')) {
                        item.removeClass('active');
                        item.find('.answer').slideUp();
                    } else {
                        item.addClass('active');
                        item.find('.answer').slideDown();
                    }
                })
            },
            history: function () {
                if ($('.history-w').length) {
                    // $(function () {
                    //     $(window).scroll(function () {
                    //         var aTop = $('.sticky').height();
                    //         if ($(this).scrollTop() >= aTop) {
                    //             $('.sticky').attr('sticky-active','true');
                    //         }else {
                    //             $('.sticky').attr('sticky-active','false');
                    //         }
                    //     });
                    // });

                    var yearmenuitem = jQuery('.history-w .years li');
                    jQuery(yearmenuitem).on('click', function () {
                        var year = $(this).text().trim();
                        var targetel = $('[year10-history="' + year + '"]')

                        $([document.documentElement, document.body]).animate({
                            scrollTop: $(targetel).offset().top - 250
                        }, 1000);

                    })
                }
            },
            about: function () {
                jQuery('.about-row-6 ul').addClass('owl-carousel').owlCarousel({
                    items: 1,
                    rtl: true,
                    nav: true,
                    autoplay : true,
                    autoplaySpeed : 1000,
                    loop : true,
                    responsive: {
                        0: {
                            items: 1
                        },

                        600: {
                            items: 1
                        },
                        800: {
                            items: 1
                        },
                    },
                    margin: 0,
                    onInitialized: function () {
                        jQuery('.about-row-6 ul').css('opacity', '1')
                    }
                });

            },
            product:function(){
                var tabs = jQuery('.product-tabs-row');
                tabs.find('li').on('click',function(){
                    if ($(this).attr('slidedown') == 'true') {
                        $(this).attr('slidedown','false');
                        $(this).find('body').slideUp();
                    } else {
                        $(this).attr('slidedown','true');
                        $(this).find('body').slideDown();
                    }
                })

 jQuery('.events-news-list .row-cols-2').addClass('owl-carousel').owlCarousel({
                    items: 3,
                    rtl: true,
                    nav: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        1023: {
                            items: 3
                        },
                    },
                    margin: 0,
                    onInitialized: function () {
                        jQuery('.events-news-list .row-cols-2').css('opacity', '1')
                    }
                });

                jQuery('.products-related .product-items').addClass('owl-carousel').owlCarousel({
                    items: 3,
                    rtl: true,
                    nav: true,
                    responsive: {
                        0: {
                            items: 1
                        },

                        600: {
                            items: 2
                        },
                        800: {
                            items: 4
                        },
                    },
                    margin: 0,
                    onInitialized: function () {
                        jQuery('.products-related .product-items').css('opacity', '1')
                    }
                });


 jQuery('.products-upsell .product-items').addClass('owl-carousel').owlCarousel({
                    items: 3,
                    rtl: true,
                    nav: true,
                    responsive: {
                        0: {
                            items: 3
                        },
                        1023: {
                            items: 4
                        },
                    },
                    margin: 0,
                    onInitialized: function () {
                        jQuery('.products-upsell .product-items').css('opacity', '1')
                    }
                });

            },
            mix: function(){
                $(document).on('submit', '.newslettersticky-w .form.subscribe', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var dataForm = jQuery('.newslettersticky-w .form.subscribe');
                    var ignore = null;
                    var successMessage = $('.sent');
                    dataForm.mage('validation', {
                        ignore: ignore ? ':hidden:not(' + ignore + ')' : ':hidden'
                    }).find('input:text').attr('autocomplete', 'off');
                    if (dataForm.validation('isValid')) {
                        url = dataForm.attr('action');
                        formDataArray = dataForm.serializeArray();
                        try {
                            jQuery.ajax({
                                url: url,
                                /*url: 'http://magento3.codev.co.il/newsletter/subscriber/new/',*/
                                type: 'post',
                                data: formDataArray,
                                success: function ($response) {
                                    console.log($response);
                                    successMessage.show();
                                    jQuery('.newslettersticky').find('.hideaftersent').hide();
                                    jQuery('.newslettersticky').addClass('success-sent');
                                }
                            });
                        } catch (e) {
                            successMessage.html(e.message);
                        }
                    }
                });

                $(document).on('submit', '.subscribe-news-w .form.subscribe', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var dataForm = jQuery('.subscribe-news-w .form.subscribe');
                    var ignore = null;
                    var successMessage = $('.subscribe-news-w .form-subscribe-success');
                    dataForm.mage('validation', {
                        ignore: ignore ? ':hidden:not(' + ignore + ')' : ':hidden'
                    }).find('input:text').attr('autocomplete', 'off');
                    if (dataForm.validation('isValid')) {
                        url = dataForm.attr('action');
                        formDataArray = dataForm.serializeArray();
                        try {
                            jQuery.ajax({
                                url: url,
                                /*url: 'https://magento3.codev.co.il/newsletter/subscriber/new/',*/
                                type: 'post',
                                data: formDataArray,
                                success: function ($response) {
                                    console.log($response);
                                    successMessage.show();
                                    jQuery('.subscribe-news-w').find('.form-subscribe').hide();
                                    jQuery('.subscribe-news-w').addClass('success-sent');
                                }
                            });
                        } catch (e) {
                            successMessage.html(e.message);
                        }
                    }
                });




                jQuery('.block-search-xs-button').click(function () {
                    jQuery('.homepage-en-w').toggleClass('serachacvive');
                    jQuery('body').toggleClass('serachacvive');
                })

                jQuery('.menu-burger-xs').click(function () {
                    jQuery('.homepage-en-w').toggleClass('menuacvive');
                    jQuery('.menu-burger-xs').toggleClass('open');
                })
                jQuery('.filter-tablist-xs').on('click',function(){
                    jQuery('#layered-filter-block [data-role="title"]').trigger('click');
                })
                smenupos();
                window.onresize = function(event) {
                    smenupos();
                };

                function smenupos() {
                    if (jQuery(window).width() < 1023) {
                        jQuery('nav.navigation').append(jQuery('.top_menu_wrapper'));
                        jQuery('.top_menu_wrapper').show();
                    } else {
                        jQuery('.top_menu_wrapper').insertAfter(jQuery('.firstrowcontainer'));
                    }
                }

                jQuery('.mobilehumburger').off('click').on('click',function(){
                    if (jQuery('body').hasClass('mobilehumburger-open')) {
                        jQuery('.mobilehumburger').removeClass('open');
                        jQuery('body').removeClass('mobilehumburger-open');
                        jQuery('.header-icons ul').removeClass('open');
                    } else {
                        jQuery('.mobilehumburger').addClass('open');
                        jQuery('body').addClass('mobilehumburger-open');
                        jQuery('.header-icons ul').addClass('open');
                    }
                })

                $('.f-up').on('click',function(){
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $("body").offset().top
                        }, 1000);
                })

                if (jQuery('.history-w .header .sticky .years ul li'))

                if (window.innerWidth < 1024) {
                    owlHistoryYears();
                }

                function owlHistoryYears() {
                    if(jQuery('body').hasClass('cms-en-history')) {
                        jQuery('.history-w .header .sticky .years ul').addClass('owl-carousel').owlCarousel({
                            items: 5,
                            dots: false,
                            rtl: false,
                            loop: false,
                            mouseDrag: false,
                            // margin: 20
                        })
                    } else {
                        jQuery('.history-w .header .sticky .years ul').addClass('owl-carousel').owlCarousel({
                            items: 5,
                            dots: false,
                            rtl: true,
                            loop: false,
                            mouseDrag: false,
                            // margin: 20
                        })
                    }
                }

                if (jQuery('.brands-tags-w ul li').length > 8 && window.innerWidth > 1024) {
                    owlBrandsTags();
                } else {
                    jQuery('.brands-tags-w').css('opacity', 1);
                }


                if (jQuery('.brands-tags-w ul li').length > 3 && window.innerWidth < 1024) {
                    owlBrandsTags();
                } else {
                    jQuery('.brands-tags-w').css('opacity', 1);
                }


                function owlBrandsTags(){
                    if(jQuery('body').hasClass('brands-en-index')) {
                        jQuery('.brands-tags-w ul').addClass('owl-carousel arrow-small').owlCarousel({
                            items: 3,
                            nav: true,
                            loop: false,
                            mouseDrag: false,
                            responsive: {
                                0: {
                                    items: 2
                                },
                                768: {
                                    items: 2
                                },
                                1023: {
                                    items: 5
                                },
                                1439: {
                                    items: 6
                                },
                                1919: {
                                    items: 7
                                }
                            },
                            margin: 20,
                            onInitialized: function () {
                                jQuery('.brands-tags-w').css('opacity', 1);
                            }
                        });
                    } else {
                        jQuery('.brands-tags-w ul').addClass('owl-carousel arrow-small').owlCarousel({
                            items: 3,
                            rtl: true,
                            nav: true,
                            loop: false,
                            mouseDrag: false,
                            responsive: {
                                0: {
                                    items: 2
                                },
                                768: {
                                    items: 2
                                },
                                1023: {
                                    items: 5
                                },
                                1439: {
                                    items: 6
                                },
                                1919: {
                                    items: 7
                                }
                            },
                            margin: 20,
                            onInitialized: function () {
                                jQuery('.brands-tags-w').css('opacity', 1);
                            }
                        });
                    }
                }

                jQuery('.owl-carousel-type-1').addClass('owl-carousel').owlCarousel({
                    items: 3,
                    rtl: true,
                    nav: true,
                    loop:true,
                    responsive: {
                        0: {
                            items: 3,
                            margin: 5,
                        },
                        1023: {
                            items: 3,
                            margin: 45,
                        },

                    },
                    onInitialized: function () {
                        jQuery('.owl-carousel-type-1').css('opacity',1);
                        var parent = jQuery('.owl-carousel-type-1 .owl-nav'),
                        prevBtn = parent.find('.owl-prev'),
                        nextBtn = parent.find('.owl-next');

                        prevBtn.appendTo(prevBtn.parent()).removeClass('owl-prev').addClass('owl-next');
                        nextBtn.prependTo(nextBtn.parent()).removeClass('owl-next').addClass('owl-prev');
                    }
                });

                $('.page-products .quick-view').on('click',function (e){
                    e.preventDefault();
                    $('body').trigger('processStart');
                    $(this).closest('.product-item').find('button.button-quickview').trigger('click');
                })

                $('.newslettersticky .label').on('click',function(){
                    $('body').addClass('newslettersticky-active');
                });
                $('.newslettersticky .close').on('click',function(){
                    $('body').removeClass('newslettersticky-active');
                });


                jQuery('a.f-up').on('click'),function(e){
                  e.preventDefault();
                    jQuery("html, body").animate({ scrollTop: 0 }, "slow");

                },
                jQuery('.headerslider').addClass('owl-carousel').owlCarousel({
                    items: 1,
                    rtl: true,
                    nav: true,
                    responsive: {
                        0: {
                            items: 1
                        },

                        600: {
                            items: 1
                        },
                        800: {
                            items: 1
                        },

                    },
                    margin: 0,
                    onInitialized: function () {

                    }
                });


                jQuery('.widget-product-grid.product-items').addClass('owl-carousel').owlCarousel({
                    items: 4,
                    rtl: true,
                    nav: true,
                    responsive: {
                        0: {
                            items: 1
                        },

                        1023: {
                            items: 4
                        }
                    },
                    margin: 0
                });

                jQuery('.about-row-carousel').addClass('owl-carousel').owlCarousel({
                    items : 1,
                    singleItem: true,
                    rtl : true,
                    loop: true,
                    nav: false,
                    autoplay: true,
                    autoplaySpeed : 1000,
                    dots : false
                })

                jQuery('.about-row-trade-medicine').addClass('owl-carousel').owlCarousel({
                    items : 1,
                    singleItem: true,
                    rtl : true,
                    loop: true,
                    nav: false,
                    autoplay: true,
                    autoplaySpeed : 1000,
                    dots : false
                })


                jQuery('.blog-grid-w .row-cols-2').addClass('owl-carousel').owlCarousel({
                    items: 3,
                    rtl: true,
                    nav: true,
                    loop: true,
                    responsive: {
                        0: {
                            items: 3
                        },
                        1023: {
                            items: 3
                        },
                    },
                    margin: 0,
                    onInitialized: function () {
                        jQuery('.row-cols-2').css('opacity', '1')
                    }
                });


                jQuery('.index-row-4-news ul.owl-carousel').addClass('owl-carousel').owlCarousel({
                    items: 1,
                    rtl: true,
                    nav: true,
                    loop:true,
                    responsive: {
                        0: {
                            items: 3
                        },
                        1023: {
                            items: 1
                        }
                    },
                    margin: 0,
                    onInitialized: function () {
 jQuery('.index-row-4-news .in').css('opacity','1')
                    }
                });
            }
        }
        jQuery(document).ready(function () {
          worx2.init2();

            /**
             * Function responsible for handling the product page related article slider, we should see a slider on desktop
             * but on mobile we just want to see the articles stacked vertically, so this function checks the window size and
             * if the window resizes to mobile it destroys the slider but if the window resizes to desktop again in recreates
             * the slider
             */
            function initProductPageArticlesSliderOwl() {
                if (typeof jQuery == 'function') {
                    jQuery('.blog-tree-post-slider .row-cols-2').each(function () {
                        var el = jQuery(this);
                        if (jQuery(window).width() > 767) {
                            jQuery(el).owlCarousel('destroy');
                            jQuery(el).removeClass('owl-carousel');
                            jQuery(this).addClass('owl-carousel').owlCarousel({
                                items: 3,
                                rtl: true,
                                nav: true,
                                dots: true,
                                responsive: {
                                    0: {
                                        items: 1
                                    },
                                    1023: {
                                        items: 3
                                    },
                                },
                                margin: 0,
                                onInitialized: function () {
                                    jQuery('.blog-tree-post-slider .row-cols-2').css('opacity', '1')
                                }
                            });
                        } else {
                            jQuery(el).owlCarousel('destroy');
                            jQuery(el).removeClass('owl-carousel');
                            jQuery(this).addClass('owl-carousel').owlCarousel({
                                items: 1,
                                rtl: true,
                                nav: true,
                                margin: 0,
                                onInitialized: function () {
                                    jQuery('.blog-tree-post-slider .row-cols-2').css('opacity', '1')
                                }
                            });
                        }
                    })
                }
            }

            initProductPageArticlesSliderOwl();

            window.addEventListener('resize', function () {
                initProductPageArticlesSliderOwl();
            });
        })
    }
)











