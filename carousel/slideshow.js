(function() {
	$.fn.featuredSlideshow = function(options) {
		var opts = $.extend({}, $.fn.featuredSlideshow.defaults, options);
		return this.each(function() {
			var $this = $(this);
			var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
			$('ul.slides li:first-child', $this).addClass('active');
			$('ul.pagination li.page', $this).text(($('ul.slides li.active', $this).prevAll().size() + 1) + ' of ' + $('ul.slides li', $this).size());
			$('ul.pagination .prev', $this).live('click', function() {
				var prev = $('ul.slides li.active', $this).prev().size() == 0 ? $('ul.slides li:last', $this) : $('ul.slides li.active', $this).prev();
				$.fn.featuredSlideshow.advance(prev, $this);
				return false;
			});
			$('ul.pagination .next', $this).live('click', function() {
				var next = $('ul.slides li.active', $this).next().size() == 0 ? $('ul.slides li:first', $this) : $('ul.slides li.active', $this).next();
				$.fn.featuredSlideshow.advance(next, $this);
				return false;
			});
		});
	};
	//public
	$.fn.featuredSlideshow.advance = function($slide, $obj) {
		$slide.animate({ opacity: 0 }, 1, function() {
			$(this).addClass('on_deck');
		});
		$slide.animate({ opacity: 1}, 300, function() {
			$(this).addClass('active').removeClass('on_deck');
			$('ul.slides li', $obj).not(this).removeClass('active');
			$.fn.featuredSlideshow.updatePage($obj);
		});
	};
	$.fn.featuredSlideshow.updatePage = function($obj) {
		var curPage = $('ul.slides li.active', $obj).prevAll().size() + 1;
		$('ul.pagination li.page', $obj).text(curPage + ' of ' + $('ul.slides li').size());
	}
})(jQuery);