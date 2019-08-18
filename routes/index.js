var express=require("express");
var	router=express.Router();
var passport=require("passport");
var User=require("../models/user");


router.get('/', (req, res)=>{
	res.render("home");
});
router.get('/rules', (req, res)=>{
	res.redirect("https://www.chess.com/learn-how-to-play-chess");
});
router.get('/notations', (req, res)=>{
	res.render("notations");
});

//=========================================================================
//	AUTH ROUTES
//=========================================================================

//	REGISTER
router.get('/register', (req, res)=>{
	res.render("register");
});
router.post('/register', (req, res)=>{
	var newUser= new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err)
			{
				console.log(error);
				return res.render('/register');
			}
		passport.authenticate("local")(req, res, ()=>{
			res.redirect('/mygames');
		});
	});
});

//	LOGIN
router.get('/login', (req, res)=>{
	res.render("login");
});
router.post('/login', passport.authenticate("local", {
	successRedirect:"/mygames",
	failureRedirect:"/login"
}), (req, res)=>{
});

//	LOGOUT
router.get('/logout', (req, res)=>{
	req.logout();
	res.redirect('/mygames');
});

module.exports=router;