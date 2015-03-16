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

FlipkartModel.prototype.getAllSellers = function (data) {
		var isOutStock = $(data).find(".out-of-stock-wrap");
		if(isOutStock != undefined && isOutStock.length != 0) {
			throw new OutOfStockException();
		}
		
		if($(data).find("[itemprop='name']") == undefined) {
			// page is not loaded properly
			throw "Page is not properly loaded.";
		}
		
		var sellers = [];
		var sellerWrap = $(data).find(".seller-table-wrap")[0];
		if(sellerWrap != undefined) {
			var sellerTable = JSON.parse(sellerWrap.getAttribute('data-config'));
			console.log(sellerTable);
			for(var i=0;i<sellerTable['dataModel'].length;i++) {
				var sellerFromFlipkart = sellerTable['dataModel'][i];
				var seller = new Seller();
				seller.name = sellerFromFlipkart['sellerInfo']['name'];
				seller.rating = sellerFromFlipkart['sellerRatingInfo']['ratingOutOfFive'];
				seller.isNewSeller = sellerFromFlipkart['sellerRatingInfo']['isNewSeller'];
				seller.price = sellerFromFlipkart['priceInfo']['sellingPrice'];
				seller.priceHistory = [];
				for(var j=0;j<sellerFromFlipkart['offerInfo']['listingOffers'].length;j++) {
					seller.offers.push(sellerFromFlipkart['offerInfo']['listingOffers'][j]['description']);
					if(sellerFromFlipkart['offerInfo']['listingOffers'][j]['exchange']) {
						seller.exchangeOffer = true;
					}
				}
				
				sellers.push(seller);
			}
			
			console.log(sellers);
		} else {
			console.log("1/0 Seller!!");

			// 1 Seller
			
			var sellerDiv = $(data).find(".seller-badge-wrap")[0];
			if(sellerDiv != undefined) {
				var seller = new Seller();
				seller.name = $(sellerDiv).find(".seller-name")[0].innerHTML;
				seller.rating = $(sellerDiv).find(".rating-out-of-five")[0].innerHTML.trim().split("/")[0].trim();
				seller.isNewSeller = false;
				seller.priceHistory = [];
				var offerWrap = $(data).find(".offers-info-wrap")[0];
				if(offerWrap != undefined) {
					var offerDiv = $(offerWrap).find(".offers")[0];
					if(offerDiv != undefined) {
						var offers = $(offerDiv).find(".offer-text");
						for(var i=0;i<offers.length;i++) {
							seller.offers.push(offers[i].innerHTML.trim());
						}
					}
				}
				
				var exchangeInfo = this.checkForExchangeOffer(data);
				if(exchangeInfo == null) {
					seller.exchangeOffer = false;
					
					var html = $(data).find("div[itemprop='offers']");
					if(html.length != 0) {
						var meta = $(html[0]).find("meta[itemprop='price']");
						seller.price = Utils.parseInt(meta[0].getAttribute('content'));
						var sellingPrice = $(html[0]).find(".selling-price.omniture-field")[0].getAttribute("data-evar48");
						
						if(sellingPrice < seller.price)
							seller.price = sellingPrice;
					}
				} else {
					seller.exchangeOffer = true;
					seller.price = exchangeInfo.mainPrice;
					seller.exchangePrice = exchangeInfo.exchangePrice;
				}
				
				sellers.push(seller);
			} else {
				// 0 seller
			}
			
			console.log(sellers);
		}
		
		return sellers;
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