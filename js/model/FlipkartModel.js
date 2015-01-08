/**
 * Class FlipkartDto, implements BaseModel
 */
var FlipkartModel = function () {
	BaseModel.apply(this, arguments);
};

FlipkartModel.prototype = Object.create(BaseModel.prototype);

FlipkartModel.prototype.getDetails = function (data) {
		var details = new Details();
		var name = $(data).find("[itemprop='name']");
		var imageUrl = $(data).find("img.productImage")[0].src;
		
		details.name = name[0].innerHTML;
		details.imageUrl = imageUrl;
		details.type = 'flipkart';
		details.additionTime = Date.now();
		
		return details;
};

FlipkartModel.prototype.getAllPrices = function (data) {
		var exchangeInfo = this.checkForExchangeOffer(data);
		
		var priceInfoObject = new PriceInfo();
		var html = $(data).find("div[itemprop='offers']");
		var otherPriceIndex = 0;
		
		if(exchangeInfo == null) {
			// if exchange offer is not going on, then first element is price by WS Retail (main seller of flipkart)
			if(html.length != 0) {
				var meta = $(html[0]).find("meta[itemprop='price']");
				var price = Utils.parseInt(meta[0].getAttribute('content'));
				var sellingPrice = $(html[0]).find(".selling-price.omniture-field")[0].getAttribute("data-evar48");
				otherPriceIndex = 1;
				
				if(sellingPrice < price)
					price = sellingPrice;
				
				priceInfoObject.mainPrice = price;
			}
		} else {
			// else mainPrice
			priceInfoObject.mainPrice = exchangeInfo.mainPrice;
			priceInfoObject.exchangePrice = exchangeInfo.exchangePrice;
		}
			
		// prices from other retailers
		var min = 99999999999999999;
		for(var i=otherPriceIndex; i<html.length; i++) {
			var meta = $(html[i]).find("meta[itemprop='price']");
			var price = Utils.parseInt(meta[0].getAttribute('content'));
			if(price < min) {
				min = price;
				priceInfoObject.otherPrice = price;
			}
		}
		
		return priceInfoObject;
	};
		
FlipkartModel.prototype.checkForExchangeOffer = function (data) {
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
			var exchange_price = $(data).xpath('//*[@id="tab-1"]/a/span/span[2]');
			if(exchange_price.length != 0) {
				eprice = Utils.parseInt(exchange_price[0].innerHTML);
			}
			if(eprice != null) {
				exchangeInfo.exchangePrice = eprice;
			}
		}
		
		return exchangeInfo;
	};