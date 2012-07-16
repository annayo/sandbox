(function($) { 

	// plugin definition 
	// plugin defaults set below
	$.fn.carousel = function(options) { 					
		
        // build main options before element iteration 
        var opts = $.extend({}, $.fn.carousel.defaults, options); 
        
        // decalare object vars
        var $this, o, viewPane, left, totalItems, totalPages, currPage, blanks, currItem;		        
		$this = $(this);    
		
        // iterate and reformat each matched element 
        return this.each(function() {  	      	
      
	        // build element specific options 
	        o = $.metadata ? $.extend({}, opts, $this.metadata()) : opts;
			
			$('.carousel_items', $this).wrap('<div class="carousel_wrapper">');
			
			viewPane = $('.carousel_wrapper', $this).width();
	        totalItems = $('.carousel_items li', $this).size();
	        totalPages = Math.ceil(totalItems / o.visibleItems);
	        blanks = (totalPages * o.visibleItems) % totalItems; 
	        currItem = (totalItems > o.visibleItems) ? o.visibleItems+1 : 1;
	        currPage = 1; 	  
	        left = 0;
      
			// log debugging
			//console.log('left:' + left + ' totalItems: ' + totalItems + ' blanks: ' + blanks);
         
			if (totalItems > o.visibleItems) {
				init();
			} else {    
				disable();				
			}   		    
        }); 
        
        var carouselAnimating = false;       
        
		function disable() { 
			// disable carousel			
        	activateCarousel(); 
        	selectItem();     		
		};

        function init() { 			
			bindControls();
			if(blanks > 0) { addBlanks(); }
        	cloneItems(); 
     		selectItem();  
        	activateCarousel();      	
        };	
        
        function activateCarousel() {
        	$('.carousel_items li', $this).removeClass('active');        	
			$('.carousel_items li:nth-child(' + currItem + ')', $this).addClass('active');	
        };
        
        function selectItem() {
        	$('.carousel_items li', $this).click(function(){
        		var direction;
        		currItem = $(this).prevAll().size()+1;
        		activateCarousel();       		
        	});
        };
 		
		function bindControls() {	
			var controls = '<p class="paging"><a class="prev" href="#"><</a><a class="next" href="#">></a></p>'
			$(controls).appendTo($this);
			
			$('.paging a', $this).click(function() { 
			   	if($(this).hasClass('next')) moveCarousel(1, true);
			   	else moveCarousel(-1, true);
			 	return false;
			});				
		};
		
		function moveCarousel(direction, animate) {
			if(!carouselAnimating && direction != 0) {
				left -= (direction * viewPane);
				currPage += direction;				
				if(animate) {
					carouselAnimating = true;
					$('.carousel_items', $this).animate({
						left: left + 'px'						
					}, 300, function() {							
						carouselAnimating = false;							
					});  
				} else {
					$('.carousel_items', $this).css('left', left + 'px');
				}	
				if(currPage > totalPages) {
					currPage = 1;
					replaceClones(direction);
				} else if (currPage < 1) {
					currPage = totalPages;
					replaceClones(direction);
				}	
			}
		};
        
        function addBlanks() {
        	for (var i = 0; i < blanks; i++) {
				$('.carousel_items', $this).append('<li class="blank"><p>blank</p></li>');
			}
        };

        function cloneItems() { 
			// prependClones = index of (totalItems - items in last page), i.e., index of 2nd last page's last item
			var prependClones = this.totalItems - (this.totalItems - (((this.totalPages-1) * o.visibleItems) - 1));
			// OLD: var prependClones = ($('.carousel_items li', $this).size() - o.visibleItems)-1;
	
			//append first set
			var frontClones = $('.carousel_items li:lt('+ o.visibleItems +')', $this).clone().addClass('clone').attr('rel', 'front');
			$('.carousel_items', $this).append(frontClones);

			//prepend last set; avoid prependTo b/c of element reversal  			
			var backClones = $('.carousel_items li[class!="clone"]:gt('+ prependClones +')', $this).clone().addClass('clone').attr('rel', 'back');  
			$('.carousel_items', $this).prepend(backClones);
			
			//reposition list so prepended clones are out of view
			$('.carousel_items', $this).css('left', left - viewPane);
			left = parseInt($('.carousel_items', $this).css('left'), 10);
		};
        
        function replaceClones(direction) {
        	var tempLeft = 0; 
        	if(direction > 0) {
        		//front clones
        		tempLeft = -viewPane;        		
        	} else if(direction < 0) {
        		//back clones
        		tempLeft = -(viewPane * totalPages);        	
        	}        	
        	setTimeout(function(){
				 $('.carousel_items', $this).css({
					'left': tempLeft + 'px'
				});							
			}, 400);
			left = tempLeft; 
        };
	}; 
	
	// plugin defaults 
	$.fn.carousel.defaults = { 
		visibleItems: 4,
		disabledView: false
	}; 

})(jQuery);