var priceChecker = {
	check: function(link, model, storageCollectionKey, successCallBack) {
		var ajax = new XMLHttpRequest();
		ajax.onload = function () {
					console.log(link);
					console.log(ajax.responseURL.split("\?")[0]);
					storage.getFromCollection(storageCollectionKey, link, function (data) {
						try {
							var details = model.getDetails(ajax.responseText);
							if(details.name != null) {
								var newLink = null;
								if(details.name != data.details.name) {
									data.details.name = details.name;
									newLink = ajax.responseURL.split("\?")[0];
								}
								var sellersFromPage = model.getAllSellers(ajax.responseText);
								var sellersFromDB = data.sellerInfos;
								var changedSeller = [];
								var newOffers = {};
								sellersFromDB.forEach(function (sellerFromDB) {
									var sellerFormPage = priceChecker.getSeller(sellersFromPage, sellerFromDB);
									if(sellerFormPage != null) {
										sellerFromDB.isAvailable = true;
										var changedOffers = [];
										if(sellerFromDB.offers != null) {
											changedOffers = priceChecker.getNewOffers(sellerFromDB.offers, sellerFormPage.offers);
										} else {
											changedOffers = sellerFormPage.offers;
										}
										if(changedOffers.length > 0) {
											newOffers[sellerFormPage.name] = changedOffers;
										}
										if(sellerFormPage.offers != null) {
											sellerFromDB.offers = [];
											sellerFormPage.offers.forEach(function (offer) {
												sellerFromDB.offers.push(offer);
											});
										}
										if(sellerFromDB.price != sellerFormPage.price) {
											var priceHistory = new PriceHistory();
											priceHistory.priceChange = sellerFormPage.price - sellerFromDB.price;
											priceHistory.date = Date.now();
											sellerFromDB.priceHistory.push(priceHistory);
											sellerFromDB.price = sellerFormPage.price;
											changedSeller.push(sellerFromDB);
										}
									} else {
										sellerFromDB.isAvailable = false;
									}
								});
								data.sellerInfos = sellersFromDB;
								
								// calculate minSeller
								var newMinSeller = null;
								var minSeller = priceChecker.getMinSeller(sellersFromPage);
								if(minSeller == null) {
									// minSeller is null only if no seller exists
									data.minSellerInfo.seller.isAvailable = false;
								} else if(minSeller.equals(data.minSellerInfo.seller)) {
									data.minSellerInfo.seller.isAvailable = true;
								} else {
									newMinSeller = minSeller;
									if(minSeller.equals(data.minSellerInfo.seller) && !data.minSellerInfo.userInterested) {
										newMinSeller = null;
									}
									data.minSellerInfo.seller = minSeller;
									data.minSellerInfo.userInterested = true;
									// check if newMinSeller is not already present
									sellersFromDB.forEach(function (seller) {
										if(minSeller.equals(seller)) {
											newMinSeller = null;
										}
									});
								}
								
								if(newLink != null && link != newLink) { // handle 302 or 301 url change
									storage.addToCollection(storageCollectionKey, newLink, data, function () {
										storage.removeFromCollection(storageCollectionKey, link, function () {
											if(successCallBack != null) {
												successCallBack(data, changedSeller, newOffers, newMinSeller);
											}
										}, null);
									});
								} else {
									storage.updateKeyInCollection(storageCollectionKey, link, data, function() {
										if(successCallBack != null) {
											successCallBack(data, changedSeller, newOffers, newMinSeller);
										}
									});
								}
							}
						} catch (e) {
							if(e instanceof OutOfStockException) {
								if(data != null) {
									data.isInStock = false;
									storage.updateKeyInCollection(storageCollectionKey, link, data, function() {
										if(successCallBack != null)
											successCallBack(data, [], {}, null);
									});
								}
							}
							console.log(e);
						}
					});
			};
			
			ajax.addEventListener("error", function (evt) {
				// TODO log errors
				console.log(evt);
			}, false);
			ajax.open("get", link, true);
			ajax.send();
	},

	getMinSeller: function (sellers) {
		var minPrice = Number.MAX_SAFE_INTEGER;
		var minSeller = null;
		for(var i=0; i<sellers.length; i++) {
			if(sellers[i].price < minPrice) {
				minPrice = sellers[i].price;
				minSeller = sellers[i];
			}
		};
		return minSeller;
	},
	
	getSeller: function (sellers, seller) {
		for(var i=0; i<sellers.length; i++) {
			if(sellers[i].name == seller.name)
				return sellers[i];
		};

		return null;
	},
	
	getNewOffers: function (oldOffers, newOffers) {
		var offers = [];
		newOffers.forEach(function (offer) {
			var offerPresent = false;
			for(var i=0;i<oldOffers.length;i++) {
				if(oldOffers[i] == offer) {
					offerPresent = true;
					break;
				}
			}
			if(!offerPresent) {
				offers.push(offer);
			}
		});
		
		return offers;
	},
	
	comparePrice: function (oldPriceInfo, newPriceInfo) {
		var priceChangeInfo = new PriceChangeInfo();
		priceChangeInfo.time = Date.now();
		priceChangeInfo.priceInfo.mainPrice = newPriceInfo.mainPrice - oldPriceInfo.mainPrice;
		priceChangeInfo.priceInfo.exchangePrice = newPriceInfo.exchangePrice - oldPriceInfo.exchangePrice;
		priceChangeInfo.priceInfo.otherPrice = newPriceInfo.otherPrice - oldPriceInfo.otherPrice;
		
		return priceChangeInfo;
	}
};