document.addEventListener('DOMContentLoaded', function () {
		var link = "http://www.flipkart.com/samsung-32eh4003-81-cm-32-led-tv/p/itmeyfvrbayqqhey?pid=TVSDU4SFHZ4BZG5M&srno=b_3&ref=458ddc1d-d9f2-4999-a5d2-b114b0666c07";
		$.ajax({
			url: link,
			success: flipkart.successCallback
		});
	});