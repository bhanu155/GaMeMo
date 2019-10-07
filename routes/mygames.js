var express=require("express");
var	router=express.Router();
var Game=require("../models/game");
var middleware=require("../middleware");

//=============================
//	RESTful ROUTES
//=============================

//INDEX ROUTE ('/mygames')
router.get('/', middleware.isLoggedIn,  (req, res)=>{
	Game.find({}, (err, allGames)=>{
		if(err)
			{
				console.log(err);
				res.redirect('/login');
			}
		else
			{
				res.render("mygames/index", {games: allGames});
			}
	});
});

//NEW route // display a form
router.get('/new', middleware.isLoggedIn, (req, res)=>{
	res.render("mygames/new");
});

//CREATE route
router.post('/', middleware.isLoggedIn, (req, res)=>{
	var game=req.body.game;
	var author={
		id: req.user._id,
		username: req.user.username
	};
	
	if(req.body.game.result=="white")
		{
			game.resultW=1;
			game.resultB=0;
		}
	else if(req.body.game.result=="black")
		{
			game.resultW=0;
			game.resultB=1;
		}
	else
		{
			game.resultW=0.5;
			game.resultB=0.5;
		}
	game.movesW=(req.body.movesW);
	game.movesB=(req.body.movesB);
	game.comment=(req.body.comment);
	game.author=author;
	Game.create(game, (err, createdGame)=>{
		if(err)
			{
				console.log("error");
			}
		else
			{
				res.redirect('/mygames');
			}
	});
});

//SHOW route
router.get('/:id', middleware.isLoggedIn, (req, res)=>{
	Game.findById(req.params.id, (err, foundGame)=>{
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("mygames/show", {game: foundGame});
			}
	});
});

//EDIT route
router.get('/:id/edit', middleware.checkGameOwnership, ( req, res)=>{
	Game.findById(req.params.id, (err, foundGame)=>{
		if(err)
			{
				res.redirect('/mygames');
			}
		else
			{
				res.render("mygames/edit", {game: foundGame});
			}
	});
});

//UPDATE route
router.put('/:id',	middleware.checkGameOwnership, (req, res)=>{
	var white=0;
	var black=0;
	if(req.body.result=="white"){
		white=1; 	black=0;
	}else if(req.body.result=="black"){
		white=0; 	black=1;
	}else if(req.body.result=="draw"){
		white=0.5;	black=0.5;
	}
	var myquery = { _id: req.params.id };
  	var newvalues = { $set: {
							whitePlayer: req.body.whitePlayer,
							blackPlayer: req.body.blackPlayer,
							resultW: white,
							resultB: black,
							movesW: req.body.movesW,
							movesB: req.body.movesB,
							comment: req.body.comment
						}	 
	};
	
  	Game.updateOne(myquery, newvalues, function(err, result) {
    	if (err){
			throw err;
		}else{
			res.redirect('/mygames/' + req.params.id);
		}
    });
});	
	


//DESTROY route
router.delete('/:id', middleware.checkGameOwnership, (req, res)=>{
	Game.findByIdAndRemove(req.params.id, (err)=>{
		res.redirect('/mygames');
	});
});





module.exports=router;