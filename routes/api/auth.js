const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// Bring in the User model
const User = require('../../models/User');
const logger = require('../../logs_config/winston');

// @route 	POST api/auth
// @desc 	Auth user
// @access 	Public

router.post('/', (req, res) => {
	const { email, password } = req.body;

	//Simple Validation
	if (!email || !password) {
		return res.status(400).json({ msg: 'Please enter all fields' });
	}

	User.findOne({ email })
		.then(user => {
			if (!user) return res.status(400).json({ msg: 'User doesnt exist' });

			//Validate password
			bcrypt.compare(password, user.password)
				.then(isMatch => {
					if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
					jwt.sign(
						{ id: user.id },
						config.get('jwtSecret'),
						{ expiresIn: 3600 },
						(err, token) => {
							if (err) throw err;
							const activityId = token.split('.')[2];
							logger.info('User Logged in',{'userId':user.id,'activityId':activityId,'context':'auth.js'});
							return res.json({
								token,
								user: {
									id: user.id,
									name: user.name,
									email: user.email,
									role: user.role
								}
							});
						}
					)
				})
		})
});

// @route 	GET api/auth/user
// @desc 	Get user
// @access 	Private

router.get('/user', auth, (req, res) => {
	User.findById(req.user.id)
		.select('-password')
		.then(user => res.json(user));
});


module.exports = router;