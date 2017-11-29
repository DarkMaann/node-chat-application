let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10; // for complexity of the bcrypt hashing

let userSchema = new Schema ({
	username: {
		type: String,
		required: true,
		index: {unique: true}
	},
	password: {
		type: String,
		required: true
	}
});

// prehook for saving method
userSchema.pre('save', function(next) {
	let user = this;

	// don't do anything if the user info isn't changed
	if (!user.isModified('password')) return next();

	// hash the password before saving it to database
	bcrypt.hash(user.password, SALT_WORK_FACTOR, (err, hash) => {
		if (err) return next(err);

		user.password = hash;
		
		next();
	});

});

// add comparePassword method to userSchema
userSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null,isMatch);
	});
};

// export the user model
module.exports = mongoose.model('User', userSchema);
