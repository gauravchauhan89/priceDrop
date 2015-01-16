function Data() {
	this.details = null;
	this.priceInfo = null;
	this.priceChangeInfo = [];
	this.settings = null;
}

Data.prototype = {
		details: null,
		priceInfo: null,
		settings: null,
		priceChangeInfo: null,
		cloneData: function(data) {
			var newData = new Data();
			newData.details = new Details();
			for(var key in newData.details) {
				if(newData.details.hasOwnProperty(key)) {
					newData.details[key] = data.details[key];
				}
			}
			
			newData.priceInfo = new PriceInfo();
			for(key in newData.priceInfo) {
				if(newData.priceInfo.hasOwnProperty(key)) {
					newData.priceInfo[key] = data.priceInfo[key];
				}
			}
			
			for(var i=0; i<data.priceChangeInfo.length; i++) {
				var priceChangeInfo = new PriceChangeInfo();
				for(key in priceChangeInfo) {
					if(priceChangeInfo.hasOwnProperty(key)) {
						priceChangeInfo[key] = data.priceChangeInfo[i][key];
					}
				}
				newData.priceChangeInfo.push(priceChangeInfo);
			}
			
			newData.settings = new Settings();
			for(key in newData.settings) {
				if(newData.settings.hasOwnProperty(key)) {
					newData.settings[key] = data.settings[key];
				}
			}
			
			return newData;
		}
};