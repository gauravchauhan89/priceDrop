function addToStore(seller, minSeller) {
	if(seller != null) {
		var url = window.location.href.split("\?")[0];
		// get data from DB
		storage.getFromCollection(flipkartDataKey, url, function (productData) {
			if(productData == null) {
				var flipkartDto = new FlipkartModel();
				var details = flipkartDto.getDetails(document);
				details.url = url;
				var id = null;
				try {
					id = url.split("/p/")[1];
				} catch (e) {
					// ignore error
				}
				if(id != null && id != undefined) {
					details.id = id;
				}
				
				var data = new Data();
				
				data.sellerInfos.push(seller);
				data.minSellerInfo = new MinSeller();
				data.minSellerInfo.seller = minSeller;
				data.minSellerInfo.userInterested = true;
				data.details = details;
				data.settings = new Settings();
				data.isInStock = true;
				//data.settings.notificationAmount = data.priceInfo.mainPrice;
				
				storage.addToCollection(flipkartDataKey, url, data);
				
			} else {
				if(!isSellerPresent(productData.sellerInfos, seller)) {
					productData.sellerInfos.push(seller);
					if(productData.minSellerInfo == null) {
						productData.minSellerInfo = new MinSeller();
						productData.minSellerInfo.seller = minSeller;
						productData.minSellerInfo.userInterested = true;
					} else {
						if(!minSeller.equals(productData.minSellerInfo.seller)) {
							productData.minSellerInfo.seller = minSeller;
							productData.minSellerInfo.userInterested = true;
						}
					}
					storage.updateKeyInCollection(flipkartDataKey, url, productData, null);
				}
			}
		});
	}
}

function isSellerPresent(sellers, seller) {
	for(var i=0;i<sellers.length;i++) {
		if(seller.equals(sellers[i]))
			return true;
	}
	return false;
}

function addButton(formEle, size, disable, seller, minSeller) {
	var lineBreak = document.createElement("BR");
	var lineBreak1 = document.createElement("BR");
	var input = document.createElement("INPUT");
	input.type = "button";
	input.value =  "Add to PD";
	input.onclick = function () {
		addToStore(seller, minSeller);
		input.className += " disabled";
	};
	input.className += " btn-buy-now current";
	if(size == 'big') {
		input.className += " btn-big";
	} else if(size == 'medium') {
		input.className += " btn-medium";
	}
	
	if(disable == true) {
		input.className += " disabled";
	}
	formEle.appendChild(lineBreak);
	formEle.appendChild(lineBreak1);
	formEle.appendChild(input);
};

function isSellerAlreadyAdded(sellers, sellerName) {
	if(sellers == null)
		return false;
	return sellers.some(function (seller) {
		if(seller.name == sellerName)
			return true;
	});
}

function getSeller(sellers, sellerName) {
	for(var i=0; i<sellers.length; i++) {
		if(sellers[i].name == sellerName)
			return sellers[i];
	};

	return null;
}

function getMinSeller(sellers) {
	var minPrice = Number.MAX_SAFE_INTEGER;
	var minSeller = null;
	for(var i=0; i<sellers.length; i++) {
		if(sellers[i].price < minPrice) {
			minPrice = sellers[i].price;
			minSeller = sellers[i];
		}
	};
	return minSeller;
}

function checkReady() {
	if(document.readyState != 'complete') {
		setTimeout(checkReady, 500);
	}
}

checkReady();

var form = document.getElementsByName("buy-now-form");
if(form != undefined) {
	var url = window.location.href.split("\?")[0];

	storage.getFromCollection(flipkartDataKey, url, function (data) {
		var sellerDiv = $(".seller-badge-wrap")[0];
		if(sellerDiv != undefined) {
			try {
				var sellersFromDB = null;
				if(data != null) {
					sellersFromDB = data['sellerInfos'];
				}
				var sellersFromPage = (new FlipkartModel()).getAllSellers(document);
				
				var sellerName = $(sellerDiv).find(".seller-name")[0].innerHTML;
				if(!isSellerAlreadyAdded(sellersFromDB, sellerName)) {
					var seller = getSeller(sellersFromPage, sellerName);
					var minSeller = Seller.prototype.clone(getMinSeller(sellersFromPage));
					addButton(form[0], 'big', false, seller, minSeller);
				} else {
					addButton(form[0], 'big', true, null, null);
				}
	
				setTimeout(function () {
					// check for table of sellers
					var sellerWrap = $(".seller-table")[0];
					if(sellerWrap != undefined) {
						// we have table of sellers
						var sellerTable = $(sellerWrap).find("tbody")[0];
						if(sellerTable != undefined) {
							var sellerRows = $(sellerTable).find("tr");
							for(var i=0; i<sellerRows.length;i++) {
								var buyForm = $(sellerRows[i]).find("form")[0];
								var name = $(sellerRows[i]).find(".seller-name")[0].innerHTML;
								if(!isSellerAlreadyAdded(sellersFromDB, name)) {
									var seller = getSeller(sellersFromPage, name);
									var minSeller = Seller.prototype.clone(getMinSeller(sellersFromPage));
									addButton(buyForm, 'medium', false, seller, minSeller);
								} else {
									addButton(buyForm, 'medium', true, null, null);
								}
							}
						}
					}
				}, 1000);
			} catch (e) {
				console.log(e);
			}
		}
	});
};
