function PriceInfo() {
	this.mainPrice = null;
	this.exchangePrice = null;
	this.otherPrice = null;
}

PriceInfo.prototype = {
		mainPrice : null,
		exchangePrice : null,
		otherPrice : null,
		isNull : function () {
			if(this.mainPrice == null && this.exchangePrice == null)
				return true;
		}
};
