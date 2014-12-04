var flipkart = {
		successCallback : function success(data, textStatus, jqXHR) {
				var flipkartDto = new FlipkartDto();
				var allPrices = flipkartDto.getAllPrices(data);
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
			}
};

/**
 * Class FlipkartDto, implements BaseModel
 */
var FlipkartDto = function () {
	BaseModel.apply(this, arguments);
};

FlipkartDto.prototype = Object.create(BaseModel.prototype);

FlipkartDto.prototype.getAllPrices = function (data) {
		var exchangeInfo = this.checkForExchangeOffer(data);
		
		var priceInfoObject = new PriceInfo();
		var html = $(data).find("div[itemprop='offers']");
		var otherPriceIndex = 0;
		
		if(exchangeInfo == null) {
			// if exchange offer is not going on, then first element is price by WS Retail (main seller of flipkart)
			if(html.length != 0) {
				var meta = $(html[0]).find("meta[itemprop='price']");
				var price = Utils.parseInt(meta[0].getAttribute('content'));
				otherPriceIndex = 1;
				priceInfoObject.mainPrice = price;
			}
		} else {
			// else mainPrice
			priceInfoObject.mainPrice = exchangeInfo.mainPrice;
			priceInfoObject.exchangePrice = exchangeInfo.exchangePrice;
		}
			
		// prices from other retailers
		for(var i=otherPriceIndex; i<html.length; i++) {
			var meta = $(html[i]).find("meta[itemprop='price']");
			var price = Utils.parseInt(meta[0].getAttribute('content'));
			priceInfoObject.otherPrices.push(price);
		}
		
		return priceInfoObject;
	};
		
FlipkartDto.prototype.checkForExchangeOffer = function (data) {
		var exchangeInfo = null;
		var oprice = null;
		var original_price = $(data).find("#exchangePrice");
		if(original_price.length != 0) {
			oprice = Utils.parseInt(original_price[0].innerHTML);
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
	};