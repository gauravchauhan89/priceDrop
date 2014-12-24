function PriceInfo() {
	this.name = null;
	this.mainPrice = null;
	this.exchangePrice = null;
	this.otherPrices = [];
}

PriceInfo.prototype = {
		name : null,
		mainPrice : null,
		exchangePrice : null,
		otherPrices : [],
		isNull : function () {
			if(this.mainPrice == null && this.exchangePrice == null)
				return true;
		}
};
