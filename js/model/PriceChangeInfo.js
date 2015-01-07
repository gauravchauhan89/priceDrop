function PriceChangeInfo() {
	this.time = null;
	this.priceInfo = new PriceInfo();
};

PriceChangeInfo.prototype = {
	time: null,
	priceInfo: null,
	isNull: function () {
		if((this.priceInfo.mainPrice != null && this.priceInfo.mainPrice != 0) ||
			   (this.priceInfo.exchange != null && this.priceInfo.exchange != 0) ||
			   (this.priceInfo.otherPrice != null && this.priceInfo.otherPrice != 0)) {
				return false;
		}
		
		return true;
	}
};