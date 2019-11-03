jQuery(document).ready(function(jQuery) {
	var MQL = 1;
	//primary navigation slide-in effect
	if(jQuery(window).width() > MQL) {
		var headerHeight = jQuery('.site-header').height();
		jQuery(window).on('scroll',{ previousTop: 0}, 
	    function () {
		    var currentTop = jQuery(window).scrollTop();
		    //check if user is scrolling up
		    if (currentTop < this.previousTop ) {
		    	//if scrolling up...
				jQuery('.site-banner').removeClass('fade');
		    	if (currentTop > 0 && jQuery('.site-header').hasClass('is-fixed')) {
		    		jQuery('.site-header').addClass('is-visible');
		    	} else {
		    		jQuery('.site-header').removeClass('is-visible is-fixed');
		    	}
		    } else {
		    	//if scrolling down...
				jQuery('.site-banner').addClass('fade');
		    	jQuery('.site-header').removeClass('is-visible');
		    	if( currentTop > headerHeight && !jQuery('.site-header').hasClass('is-fixed')) jQuery('.site-header').addClass('is-fixed');
		    }
		    this.previousTop = currentTop;
		});
	}

	//open/close primary navigation
	jQuery('.primary-nav-trigger').on('click', function(){
		jQuery('.menu-icon').toggleClass('is-clicked'); 
		jQuery('.site-header').toggleClass('menu-is-open');
		
		//in firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
		if( jQuery('.site-navigation-wrapper').hasClass('is-visible') ) {
			jQuery('.site-navigation-wrapper').removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
				jQuery('body').removeClass('overflow-hidden');
			});
		} else {
			jQuery('.site-navigation-wrapper').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
				jQuery('body').addClass('overflow-hidden');
			});	
		}
	});
	/*--------------------------------------------------------------
	Search toggle
	--------------------------------------------------------------*/

	/* show/hide search form via search icon */
	jQuery('.site-header .search-trigger').click(function(){
		if( jQuery('.site-header .search-form').hasClass('search-form--active') )
		{
			/* hide search field */
			jQuery('.site-header .search-form').removeClass('search-form--active');			
			return false;
		}
		else
		{
			/* show search field */
			jQuery('.site-header .search-form').addClass('search-form--active');
			/* focus search field */
			jQuery('.site-header .search-field').focus();
			return false;
		}
	});

	/* show/hide search form via search icon */
	jQuery('.site-header .search-trigger').click(function(){
		if( jQuery('.site-header .search-trigger').hasClass('search-form--active') )
		{
			/* hide search field */
			jQuery('.site-header .search-trigger').removeClass('search-form--active');			
			return false;
		}
		else
		{
			/* show search field */
			jQuery('.site-header .search-trigger').addClass('search-form--active');			
			return false;
		}
	});
	var $commentform = jQuery('#commentform'),
	$comments = jQuery('#comments-title'),
	$cancel = jQuery('#cancel-comment-reply-link'),
	cancel_text = $cancel.text();
	jQuery(document).on("submit", "#commentform",
	function() {
		jQuery.ajax({
			url: PUMA.ajax_url,
			data: jQuery(this).serialize() + "&action=ajax_comment",
			type: jQuery(this).attr('method'),
			beforeSend:addComment.createButterbar("提交中...."),
			error: function(request) {
				var t = addComment;
				t.createButterbar(request.responseText);
			},
			success: function(data) {
				jQuery('textarea').each(function() {
					this.value = ''
				});
				var t = addComment,
				cancel = t.I('cancel-comment-reply-link'),
				temp = t.I('wp-temp-form-div'),
				respond = t.I(t.respondId),
				post = t.I('comment_post_ID').value,
				parent = t.I('comment_parent').value;
				if (parent != '0') {
					jQuery('#respond').before('<ol class="children">' + data + '</ol>');
				} else if ( !jQuery('.commentlist').length ) {
					jQuery('#respond').before('<ol class="commentlist">' + data + '</ol>');
				} else {
					jQuery('.commentlist').append(data);// your comments wrapper
				}
				t.createButterbar("提交成功");
				cancel.style.display = 'none';
				cancel.onclick = null;
				t.I('comment_parent').value = '0';
				if (temp && respond) {
					temp.parentNode.insertBefore(respond, temp);
					temp.parentNode.removeChild(temp)
				}
			}
		});
		return false;
	});
	addComment = {
		moveForm: function(commId, parentId, respondId) {
			var t = this,
			div,
			comm = t.I(commId),
			respond = t.I(respondId),
			cancel = t.I('cancel-comment-reply-link'),
			parent = t.I('comment_parent'),
			post = t.I('comment_post_ID');
			$cancel.text(cancel_text);
			t.respondId = respondId;
			if (!t.I('wp-temp-form-div')) {
				div = document.createElement('div');
				div.id = 'wp-temp-form-div';
				div.style.display = 'none';
				respond.parentNode.insertBefore(div, respond)
			} ! comm ? (temp = t.I('wp-temp-form-div'), t.I('comment_parent').value = '0', temp.parentNode.insertBefore(respond, temp), temp.parentNode.removeChild(temp)) : comm.parentNode.insertBefore(respond, comm.nextSibling);
			jQuery("body").animate({
				scrollTop: jQuery('#respond').offset().top - 180
			},
			400);
			parent.value = parentId;
			cancel.style.display = '';
			cancel.onclick = function() {
				var t = addComment,
				temp = t.I('wp-temp-form-div'),
				respond = t.I(t.respondId);
				t.I('comment_parent').value = '0';
				if (temp && respond) {
					temp.parentNode.insertBefore(respond, temp);
					temp.parentNode.removeChild(temp);
				}
				this.style.display = 'none';
				this.onclick = null;
				return false;
			};
			try {
				t.I('comment').focus();
			}
			 catch(e) {}
			return false;
		},
		I: function(e) {
			return document.getElementById(e);
		},
		clearButterbar: function(e) {
			if (jQuery(".butterBar").length > 0) {
				jQuery(".butterBar").remove();
			}
		},
		createButterbar: function(message) {
			var t = this;
			t.clearButterbar();
			jQuery("body").append('<div class="butterBar butterBar--center"><p class="butterBar-message">' + message + '</p></div>');
			setTimeout("jQuery('.butterBar').remove()", 3000);
		}
	};
});
jQuery(window).scroll(function() {
	var st = jQuery(this).scrollTop(),
	backToTop = jQuery('.back-to-top');
	if (st > 200) {
			backToTop.removeClass('u-hide');
		} else {
			backToTop.addClass('u-hide');
	}
})
console.log('QQ:4398929');
	
var backToTop = function() {
		jQuery("html,body").animate({
			scrollTop: 0
		},
		800);
	}

jQuery(document).on("click", "#fa-loadmore", function() {
	var _self = jQuery(this),
		_postlistWrap = jQuery('.blockGroup'),
		_button = jQuery('#fa-loadmore'),
		_data = _self.data();
	if (_self.hasClass('is-loading')) {
		return false
	} else {
		_button.html('加载中 o(∩_∩)o');
		_self.addClass('is-loading');
		jQuery.ajax({
			url: PUMA.ajax_url,
			data: _data,
			type: 'post',
			dataType: 'json',
			success: function(data) {
				if (data.code == 500) {
					_button.data("paged", data.next).html('加载更多');
					alert('服务器正在努力找回自我  o(∩_∩)o')
				} else if (data.code == 200) {
					_postlistWrap.append(data.postlist);
					if (data.next) {
						_button.data("paged", data.next).html('加载更多')
					} else {
						_button.remove()
					}
				}
				_self.removeClass('is-loading')
			}
		})
	}
});