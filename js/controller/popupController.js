document.addEventListener('DOMContentLoaded', function () {
		var link = "http://www.flipkart.com/wd-elements-2-5-inch-1-tb-external-hard-drive/p/itmdmhdqfhr4ndhq?pid=ACCDMHDQJHVRPYAN&otracker=ch_vn_computer_s_promowidget_banner_0_image";
		$.ajax({
			url: link,
			success: flipkart.successCallback,
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	});