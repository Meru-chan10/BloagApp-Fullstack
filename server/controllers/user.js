//  Dependencies
const bcrypt = require('bcrypt');
const User = require("../models/User");
const auth = require("../auth");


// Register User
module.exports.registerUser = (req,res) => {

	if (!req.body.email.includes("@")){

	    return res.status(400).send({ error: "Email invalid" });

    }
    else if(req.body.name === "" || req.body.name === " " || req.body.name === null) {
        return res.status(400).send({error: "Name is Required"})
    
	} 
    else if (req.body.password.length < 8) {

	    return res.status(400).send({ error: "Password must be atleast 8 characters" });
    
	} else {

		let newUser = new User({
			image: req.body.image,
            name: req.body.name,
			email : req.body.email,
			password : bcrypt.hashSync(req.body.password, 10)
		})

		return newUser.save()
		.then((user) => res.status(201).send({ message: "Registered Successfully", user }))
		.catch(err => {
			console.error("Error in saving: ", err)
			return res.status(500).send({ error: "Error in save"})
		})
	}
};


// Login User
module.exports.loginUser = (req,res) => {

	if(req.body.email.includes("@")){

		return User.findOne({ email : req.body.email })
		.then(user => {

			if(user == null){

				return res.status(404).send({ error: "No Email Found" });

			} else {

				const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

				if (isPasswordCorrect) {

					return res.status(200).send({ 
						access : auth.createAccessToken(user)
					})

				} else {

					return res.status(401).send({ message: "Email and password do not match" });

				}
			}
		})
		.catch(err => err);

	} else {

	    return res.status(400).send(false);
	}
};


// User Profile
module.exports.getProfile = (req, res) => {
    const userId = req.user.id;

    return User.findById(userId).select('-password')
    .then(user => {

        if(!user){
            return res.status(404).send({ error: 'User not found' })
        }else {
            return res.status(200).send(user);
        }  
    })
    .catch(error => errorHandler(error, req, res));
};