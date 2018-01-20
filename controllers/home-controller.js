var _       = require('lodash'),
    jwt     = require('jsonwebtoken'),
    bcrypt  = require('bcrypt'),
    config = require('./../core/app/config');
var users = [];

module.exports = HomeController;
function HomeController() {
    this.helloworld = function (io) {
        io.echo("hello world");
    };
    this.register = function (io) {
        var input = io.inputs;
        if (typeof input.email !== "undefined" && typeof input.password !== "undefined"){
       	 	var pass = bcrypt.hashSync(input.password, 10);
       	 	var checkExists = false;
       	 	users.forEach(function(item){
       	 	if(input.email == item.email){
       	 		checkExists = true;
       	 	}
       	 });
       	 if(!checkExists){
       	 	users.push({'email': input.email, 'password': pass});
       	 	io.status(200).json({
                status: 200,
                result: users
            });
       	 }else{
       	 	io.status(400).json({
                status: 400,
                result: 'User already exists!'
            });
       	 }
       }else{
       	io.status(400).json({
            status: 400,
            result: 'Thiếu params'
        });
       }
       
    };
    this.sign_in = function (io) {
    	var input = io.inputs;
        if (typeof input.email !== "undefined" && typeof input.password !== "undefined"){
        	if(users.length == 0){
        		io.status(401).json({
		            status: 401,
		            result: 'Authentication failed. User not found.'
		        });
        	}else{
        		users.forEach(function(item){
		       	 	if(input.email == item.email){
		       	 		if(bcrypt.compareSync(input.password, item.password)){
				    		return io.json({token: jwt.sign({ email: input.email}, config.get('app.secret'), { expiresIn: 60*60*5 })});

		       	 		}else{
		       	 			return io.status(401).json({ message: 'Authentication failed. Wrong password.' });
		       	 		}
		       	 	}else{
		       	 		io.status(401).json({
				            status: 401,
				            result: 'Authentication failed. User not found.'
				        });
		       	 	}
	       	 	});
        	}
        	
		}else{
	       	io.status(400).json({
	            status: 400,
	            result: 'Thiếu params'
	        });
	    }
    };

    this.home = function (io) {
    	console.log(io.user);
        io.status(200).json({
            status: 200,
            result: io.user
        });
    };
}
