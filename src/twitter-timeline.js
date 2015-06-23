/*
*  AngularJS Directive for Twitter's Embedded Timeline with support for custom CSS.
*  https://github.com/userapp-io/twitter-timeline-angularjs
*/

angular.module('twitter.timeline', [])
	.directive('twitterTimeline', [function() {
		return {
			restrict: 'A',
			scope: {
				cssUrl: "@",
				autoResize: "=",
				twitterScreenName: "@"
			},
			link: function (scope, element, attrs) {
				$('body').removeAttr('data-twttr-rendered');

				element
					.attr('id', 'twitter-feed')
					.attr("width", "100%" || attrs.width)
					.attr('data-chrome', 'noheader transparent')
					.attr('data-widget-id', attrs.twitterTimeline)
					.addClass('twitter-timeline');

				function render() {
					var body = $('.twitter-timeline').contents().find('body');

					if (scope.cssUrl) {
						body.append($('<link/>', { rel: 'stylesheet', href: scope.cssUrl, type: 'text/css' }));
					}

					function setHeight() {
						if (body.find('.stream').length == 0) {
							setTimeout(setHeight, 100);
						} else {
							body.find('.stream').addClass('stream-new').removeClass('stream').css('height', 'auto');
							$('.twitter-timeline').css('height', (body.height() + 20) + 'px');
						}
					}

					if (scope.autoResize) {
						setHeight();
					}
				}


                		function handleScript() {
                			var scriptUrl = (/^http:/.test(document.location) ? 'http' : 'https') + '://platform.twitter.com/widgets.js';
                			$.getScript(scriptUrl, function () {
						render();
						$('.twitter-timeline').load(render);
					});
                		}
                		
				if (!$('#twitter-wjs').length) {
					if (attrs.twitterScreenName !== "") {
						handleScript();
					} else {
						scope.$watch('twitterScreenName', function (newValue) {
							if (newValue.length > 0) {
								element.attr('data-screen-name', newValue);
								handleScript();
							}
						});
					}
				}
			}
		};
	}]);
