function Data() {
	this.details = null;
	this.sellerInfos = [];
	this.minSellerInfo = null;
	this.settings = null;
	this.isInStock = null;
}

Data.prototype = {
		details: null,
		sellerInfos: null,
		minSellerInfo: null,
		settings: null,
		isInStock: null,
		cloneData: function(data) {
			var newData = new Data();
			newData.details = new Details();
			for(var key in newData.details) {
				if(newData.details.hasOwnProperty(key)) {
					newData.details[key] = data.details[key];
				}
			}
			
			for(var i=0; i<data.sellerInfos.length; i++) {
				newData.sellerInfos.push(Seller.clone(data.sellerInfos[i]));
			}
			
			newData.settings = new Settings();
			for(key in newData.settings) {
				if(newData.settings.hasOwnProperty(key)) {
					newData.settings[key] = data.settings[key];
				}
			}
			
			newData.minSellerInfo = MinSeller.clone(data.minSellerInfo);
			
			return newData;
		}
};