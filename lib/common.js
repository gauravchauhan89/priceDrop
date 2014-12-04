
/////////// priceInfo Class /////////////
function PriceInfo() {}

PriceInfo.prototype = {
		mainPrice : null,
		exchangePrice : null,
		otherPrices : [],
		isNull : function () {
			if(this.mainPrice == null && this.exchangePrice == null)
				return true;
		}
};
/////////////////////////////////////////

var Utils = {
		parseInt : function (string) {
			if(string == null)
				return null;
			return string.replace(',','').replace('Rs. ', '');
		}
};