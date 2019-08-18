var middlewareObj={};
var Game=require("../models/game");

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated())
		{
			return next();
		}
	res.redirect('/login');
};

middlewareObj.checkGameOwnership = function(req, res, next){
	//is user logged in ?
	if(req.isAuthenticated()){
		Game.findById(req.params.id, (err, foundGame)=>{
		if(err)
			{
				res.redirect("back");
			}
		else
			{
				//is the game is owned by the logged in user ?
				if(foundGame.author.id.equals(req.user._id))
					{
						next();
					}	
				else
					{
						res.send("back");
					}
			}
		});
	}	
	else
	{
		res.redirect("back");
	}
};

module.exports= middlewareObj;