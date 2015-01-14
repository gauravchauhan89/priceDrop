var priceChecker = {
	check: function(link, model, storageCollectionKey, callBack) {
		$.ajax({
			url: link,
			success: function (data) {
				var priceInfo = model.getAllPrices(data);
				if(!priceInfo.isNull()) {
					storage.getFromCollection(storageCollectionKey, link, function (data) {
						if(data != null) {
							var oldData = data;
							var oldPriceInfo = oldData.priceInfo;
							var priceChangeInfo = priceChecker.comparePrice(oldPriceInfo, priceInfo);
							
							if(!priceChangeInfo.isNull()) { // if any change 
								data.priceChangeInfo.push(priceChangeInfo);
								data.priceInfo = priceInfo;
								storage.updateKeyInCollection(storageCollectionKey, link, data, function() {
									if(callBack != null)
										callBack(priceChangeInfo, oldData);
								});
							} else {
								if(callBack != null)
									callBack(priceChangeInfo, oldData);
							}
						}
					});
				}
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