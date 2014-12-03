var flipkart = {
		successCallback : function success(data, textStatus, jqXHR) {
				var allPrices = flipkart.getAllPrices(data);
				if(allPrices != null) {
					if(allPrices.exchangePrice != null) {
						$("#flipkart-list")[0].innerHTML += "Original Price: " + allPrices.mainPrice + "<br />";
						$("#flipkart-list")[0].innerHTML += "Exchange Price: " + allPrices.exchangePrice + "<br />";
					}
					
					if(allPrices.otherPrice.length != 0) {
						$("#flipkart-list")[0].innerHTML += "Other Prices : <br/>";
						for(var i=0; i<allPrices.otherPrice; i++) {
							$("#flipkart-list")[0].innerHTML += allPrices.otherPrice[i] + "<br />";
						}
					}
				}
			},

		getAllPrices : function (data) {
			var exchangeInfo = flipkart.checkForExchangeOffer(data);
			
			var priceInfo = null;
			var html = $(data).find("div[itemprop='offers']");
			var otherPriceIndex = 0;
			
			if(html.length != 0) {
				if(exchangeInfo == null) {
					// if exchange offer is not going on, then first element is price by WS Retail (main seller of flipkart)
					var meta = $(html[0]).find("meta[itemprop='price']");
					var price = flipkart.parseInt(meta[0].getAttribute('content'));
					otherPriceIndex = 1;
					priceInfo = {
							"mainPrice" : price,
							"exchangePrice" : null,
							"otherPrice" : []
					};
				} else {
					// else mainPrice
					priceInfo = {
							"mainPrice" : exchangeInfo.mainPrice,
							"exchangePrice" : exchangeInfo.exchangePrice,
							"otherPrice" : []
					};
				}
				
				// prices from other retailers
				for(var i=otherPriceIndex; i<html.length; i++) {
					var meta = $(html[i]).find("meta[itemprop='price']");
					var price = flipkart.parseInt(meta[0].getAttribute('content'));
					priceInfo.otherPrice.push(price);
				}
			}
			
			return priceInfo;
		},
			
		checkForExchangeOffer : function (data) {
			var exchangeInfo = null;
			var oprice = null;
			var original_price = $(data).find("#exchangePrice");
			if(original_price.length != 0) {
				oprice = flipkart.parseInt(original_price[0].innerHTML);
				exchangeInfo = {
						"mainPrice" : oprice
				};
			}
			
			if(oprice != null) {
				// exchange offer if going on, checking for price with exchange
				var eprice = null;
				var exchange_price = $(data).xpath('//*[@id="tab-1"]/a/span/span[2]/span');
				if(exchange_price.length != 0) {
					eprice = flipkart.parseInt(exchange_price[0].innerHTML);
				}
				if(eprice != null) {
					exchangeInfo.exchangePrice = eprice;
				}
			}
			
			return exchangeInfo;
		},
		
		parseInt : function (string) {
			if(string == null)
				return null;
			return string.replace(',','').replace('Rs. ', '');
		}
};
