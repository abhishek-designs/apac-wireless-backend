'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passportFacebook = require('passport-facebook');

var _socialAuthController = require('../api/controllers/socialAuthController');

var _socialAuthController2 = _interopRequireDefault(_socialAuthController);

require('dotenv/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var facebookStrategy = new _passportFacebook.Strategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.BASE_URL + '/customers/facebook/callback',
  profileFields: ['email', 'displayName']
}, _socialAuthController2.default.passportCallback);

exports.default = facebookStrategy;