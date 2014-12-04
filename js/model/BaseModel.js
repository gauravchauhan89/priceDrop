/**
 * This is the abstract base class for all models
 */
function BaseModel() {
	if(this.constructor === BaseModel) {
		throw new Error("Can't instantiate abstract class!");
	}
}

BaseModel.prototype = {
		getAllPrices : function () {
			throw new Error("Abstract method!");
		}
};