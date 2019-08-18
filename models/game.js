var mongoose=require("mongoose");

var gameSchema = new mongoose.Schema({
	whitePlayer: String,
	blackPlayer: String,
	resultW: Number,
	resultB: Number,
	movesW:[{type:String}],
	movesB:[{type:String}],
	comment:[{type: String}],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	}
});

module.exports = mongoose.model("Game", gameSchema);