// **This plugin is not complete and should not be used as a reference for
// plugin development**
(function() {

	var Instagram = function(delegate) {
		this.OAUTH_CLIENT_ID = '34498eab82ad46b481c1b394cd9e879a';
		this.oauth_authorize_token_url =
			'https://api.instagram.com/oauth/authorize/?client_id=' + this.OAUTH_CLIENT_ID +
			'&redirect_uri=' + encodeURIComponent(delegate.callbackURL()) +
			'&response_type=token&scope=basic';

		this.delegate = delegate;
	};

	Instagram.prototype.authRequirements = function(callback) {
		callback({
			authType: "oauth",
			url: this.oauth_authorize_token_url
		});
	};

	Instagram.prototype.authenticate = function(params) {
		var self = this;
		HTTP.request({
			method: 'GET',
			url: 'https://api.instagram.com/v1/users/self/?access_token=' + params.access_token
		}, function(err, response) {
			if (err) {
				console.log(err);
				return;
			}
			response = JSON.parse(response);
			self.delegate.createAccount({
				name: response.data.username,
				identifier: response.data.id,
				secret: params.access_token,
				avatarURL: response.data.profile_picture
			});
		});
	};

	Instagram.prototype.updatePreferences = function(callback) {
		callback({
			'interval': 180,
			'min': 60,
			'max': 900
		});
	};

	PluginManager.registerPlugin(Instagram, 'me.danpalmer.River.plugins.Instagram');

})();