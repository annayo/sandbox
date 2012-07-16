(function($) { 

	// plugin definition 
	$.fn.gallery = function(options) { 					
		
        // build main options before element iteration 
        var opts = $.extend({}, $.fn.gallery.defaults, options); 
        
        // decalare object vars
        var $this, o, viewPane, left, totalItems, totalPages, currPage, blanks, currItem;		        
		$this = $(this);    
		
        // iterate and reformat each matched element 
        return this.each(function() {  	      	
      
	        // build element specific options 
	        o = $.metadata ? $.extend({}, opts, $this.metadata()) : opts;
			
			$('.carousel ul', $this).wrap('<div class="carousel_wrapper">');
			
			viewPane = $('.carousel_wrapper', $this).width();
	        totalItems = $('.carousel ul li', $this).size();
	        totalPages = Math.ceil(totalItems / o.visibleItems);
	        blanks = (totalPages * o.visibleItems) % totalItems; 
	        currItem = (totalItems > o.visibleItems) ? o.visibleItems+1 : 1;
	        currPage = 1; 	  
	        left = 0;
	        currSlide = 1;
      
			//DEBUGGING ALERT
			//console.log('left:' + left + ' totalItems: ' + totalItems + ' blanks: ' + blanks);
         
			if (totalItems > o.visibleItems) {
				init();
			} else {    
				disable();				
			}   		    
        }); 
        
        var carouselAnimating = false;       
        
		function disable() { 
			//disable carousel			
        	activateCarousel(); 
        	selectItem();     		
		};

        function init() { 			
			bindControls();
			if(blanks > 0) addBlanks();
        	cloneItems(); 
     		selectItem();  
        	activateCarousel();      	
        };	
        
        function activateCarousel() {
        	$('.carousel ul li', $this).removeClass('active');        	
			$('.carousel ul li:nth-child(' + currItem + ')', $this).addClass('active');	
        }
        
        function activateSlide() {
        	$('.slides ul li', $this).removeClass('active');
			$('.slides ul li:nth-child(' + currSlide +')', $this).addClass('active');
        }
         
        function selectItem() {
        	$('.carousel ul li', $this).click(function(){
        		currItem = $(this).prevAll().size()+1;
        		var direction;
        		if(totalItems > o.visibleItems) {
        			direction = -(currSlide - (currItem-o.visibleItems));
        		} else {
        			direction = -(currSlide - currItem);
        		}
        		activateCarousel();       		
        		moveSlide(direction);
        	});
        }
 		
		function bindControls() {	
			var controls = 	'<p class="paging"><a class="prev" href="#"><</a><a class="next" href="#">></a></p>'
			$(controls).appendTo($('.carousel, .slides', $this));
			
			$('.carousel .paging a', $this).click(function() { 
			   	if($(this).hasClass('next')) moveCarousel(1, true);
			   	else moveCarousel(-1, true);
			 	return false;
			});				
			$('.slides .paging a', $this).click(function() { 
			   	if($(this).hasClass('next')) moveSlide(1, true);
			   	else moveSlide(-1, true);
			 	return false;
			});					
		}
		
		function moveSlide(direction) {	
			if(!carouselAnimating) {	
				currSlide += direction;			
				if(currSlide > totalItems) {
					currSlide = 1;
				} else if (currSlide < 1) {
					currSlide = totalItems;
				}	
				
				//NOTE: match current slide to carousel item
				currItem = (totalItems > o.visibleItems) ? currSlide+o.visibleItems : currSlide;			
    			activateCarousel();
    			activateSlide();
    			
    			//NOTE: if any of the following are matched, move carousel    			
    			var condA = (currSlide == (o.visibleItems * currPage+1) && direction > 0); //moving forward
    			var condB = (currSlide == (o.visibleItems * (currPage-1)) && direction < 0); //moving backward
    			var condC = ((currSlide == 1 && direction > 0) && currPage == totalPages); //moving forward @ end of list
    			var condD = ((currSlide == totalItems && direction < 0) && currPage-1 == 0); //moving backward @ beginning of list

				//DEBUG: console.log('condA currPage: ' + currPage + ', currSlide: ' + currSlide + ', currItem: ' + currItem)
    			if(condA || condB || condC || condD) {
					moveCarousel(direction, true);
				} 		
    		}				
		}

		function moveCarousel(direction, animate) {
			if(!carouselAnimating && direction != 0) {
				left -= (direction * viewPane);
				currPage += direction;				
				if(animate) {
					carouselAnimating = true;
					$('.carousel ul', $this).animate({
						left: left + 'px'						
					}, 300, function() {							
						carouselAnimating = false;							
					});  
				} else {
					$('.carousel ul', $this).css('left', left + 'px');
				}	
				if(currPage > totalPages) {
					currPage = 1;
					replaceClones(direction);
				} else if (currPage < 1) {
					currPage = totalPages;
					replaceClones(direction);
				}	
			}
		}
        
        function addBlanks() {
        	for (var i = 0; i < blanks; i++) {
				$('.carousel ul', $this).append('<li class="blank"><p>blank</p></li>');
			}
        }
        
        function cloneItems() { 
        	var prependClones = ($('.carousel ul li', $this).size() - o.visibleItems)-1;

			//append first set
			var frontClones = $('.carousel ul li:lt('+ o.visibleItems +')', $this).clone().addClass('clone').attr('rel', 'front');
			$('.carousel ul', $this).append(frontClones);

			//prepend last set; avoid prependTo b/c of element reversal  			
			var backClones = $('.carousel ul li[class!="clone"]:gt('+ prependClones +')', $this).clone().addClass('clone').attr('rel', 'back');  
			$('.carousel ul', $this).prepend(backClones);
			
			//reposition list so prepended clones are out of view
			$('.carousel ul', $this).css('left', left - viewPane);
			left = parseInt($('.carousel ul', $this).css('left'), 10);
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
				 $('.carousel ul', $this).css({
					'left': tempLeft + 'px'
				});							
			}, 400);
			left = tempLeft; 
        }
	}; 
	
	// plugin defaults 
	$.fn.gallery.defaults = { 
		visibleItems: 4,
		disabledView: false
	}; 

})(jQuery);