document.addEventListener('DOMContentLoaded', function () {
		chrome.storage.sync.get('priceDropFlipkartData', function (data) {
			var links = data['priceDropFlipkartData'];
			for(var i=0; i<links.length; i++) {
				$.ajax({
					url: links[i],
					success: flipkart.successCallback,
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(textStatus);
						console.log(errorThrown);
					}
				});
			}
		});
	});

var flipkart = {
		successCallback : function success(data, textStatus, jqXHR) {
				var flipkartDto = new FlipkartModel();
				var allPrices = flipkartDto.getAllPrices(data);
				var details = flipkartDto.getDetails(data);
				$("#flipkart-list")[0].innerHTML += details.name + "<br>";
				if(!allPrices.isNull()) {
					if(allPrices.exchangePrice != null) {
						$("#flipkart-list")[0].innerHTML += "Original Price: " + allPrices.mainPrice + "<br />";
						$("#flipkart-list")[0].innerHTML += "Exchange Price: " + allPrices.exchangePrice + "<br />";
					} else {
						$("#flipkart-list")[0].innerHTML += "Main Price: " + allPrices.mainPrice + "<br />";
					}
					
					if(allPrices.otherPrices.length != 0) {
						$("#flipkart-list")[0].innerHTML += "Other Prices : <br/>";
						for(var i=0; i<allPrices.otherPrices.length; i++) {
							$("#flipkart-list")[0].innerHTML += allPrices.otherPrices[i] + "<br />";
						}
					}
				}
				$("#flipkart-list")[0].innerHTML += '-------------------------------------------------<br>';
			}
};
