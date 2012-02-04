
module.exports = function(){
	return function errorHandling(err, req, res, next) {
        res.statusCode = err.errorCode;        
        res.send(err.message || "Server error");
    }
};