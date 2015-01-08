var priceChecker = {
	check: function(link, model, storageCollectionKey, callBack) {
		$.ajax({
			url: link,
			success: function (data) {
				var priceInfo = model.getAllPrices(data);
				storage.getFromCollection(storageCollectionKey, link, function (info) {
					if(info != null) {
						var oldPriceInfo = info.priceInfo;
						var priceChangeInfo = priceChecker.comparePrice(oldPriceInfo, priceInfo);
						
						if(!priceChangeInfo.isNull()) { // if any change 
							info.priceChangeInfo.push(priceChangeInfo);
							info.priceInfo = priceInfo;
							storage.updateKeyInCollection(storageCollectionKey, link, info, function() {
								if(callBack != null)
									callBack(priceChangeInfo);
							});
						} else {
							if(callBack != null)
								callBack(priceChangeInfo);
						}
					}
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				// TODO log errors
			}
		});
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