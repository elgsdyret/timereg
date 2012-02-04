
module.exports = function(){
	return {
		entityNotFound: function(id){			
			return {
				errorCode: 404,
				message: 'entity not found',
				requestedEntityId: id	
			}					
		},
		mongoError: function(err){
			return {
				errorCode: 500				
			}
		}
	};	
};



