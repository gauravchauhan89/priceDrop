function PriceInfo() {
	this.mainPrice = null;
	this.exchangePrice = null;
	this.otherPrices = [];
}

PriceInfo.prototype = {
		mainPrice : null,
		exchangePrice : null,
		otherPrices : [],
		isNull : function () {
			if(this.mainPrice == null && this.exchangePrice == null)
				return true;
		}
};
