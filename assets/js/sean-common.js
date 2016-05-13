// 固定右邊導覽列
function fixScroll(fix, unfix, fixz) {
	var desktopFixTop = fix.data('deskFix');
	var mobileFixTop = fix.data('mobileFix');

	$(fix).scrollToFixed({
		/*
			marginTop = 這個固定的區塊，固定時離螢幕頂端的距離是多少？
			單位：px。
			因為這個版導覽列在行動裝置高度會變，所以用了if去判斷螢幕寬度
		*/
		marginTop: function() {
			//	螢幕尺寸為行動裝置時，設定離頂端的距離
			if($(window).width() <= 768) {
				//	沒有填data-mobile-fix的預設值
				if(mobileFixTop == null) {
					return marginTop = 10;
				}
				else {
					return marginTop = mobileFixTop;
				}
			}
			//	螢幕尺寸大於行動裝置時（桌機），設定離頂端的距離
			else {
				//	沒有填data-desk-fix的預設值
				if(desktopFixTop == null) {
					return marginTop = 10;
				}
				else {
					return marginTop = desktopFixTop;
				}
			}
		},
		//	limit = 在哪裡要解除固定
		limit: function() {
			var limit = unfix.offset().top - fix.outerHeight(true) - 32;
			return limit;
		},
		//	固定的東西，z-index是多少
		zIndex: fixz
	});
}