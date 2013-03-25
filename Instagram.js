// **This plugin is not complete and should not be used as a reference for
// plugin development**
(function() {

	var Instagram = function(delegate) {
		this.OAUTH_CLIENT_ID = '34498eab82ad46b481c1b394cd9e879a';
		this.oauth_authorize_token_url =
			'https://api.instagram.com/oauth/authorize/?client_id=' + this.OAUTH_CLIENT_ID +
			'&redirect_uri=' + encodeURIComponent(delegate.callbackURL()) +
			'&response_type=token&scope=basic';
		this.feedURL = 'https://api.instagram.com/v1/users/self/feed?access_token=';
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
				secret: params.access_token
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

	Instagram.prototype.update = function(user, callback) {
		HTTP.request({
			url: this.feedURL + user.secret
		}, function(err, response) {
			if (err) {
				return callback(err, null);
			}
			response = JSON.parse(response);
			var images = [];
			for (var i = 0; i < response.data.length; i++) {
				var img = new Image();
				img.text = response.data[i].caption.text;
				img.creator = response.data[i].user.full_name;
				img.creatorImageURL = response.data[i].user.profile_picture;
				img.imageURL = response.data[i].images.standard_resolution.url;
				img.imageHeight = response.data[i].images.standard_resolution.height;
				img.imageWidth = response.data[i].images.standard_resolution.width;
				img.identifier = response.data[i].id;
				images.push(img);
			}
			callback(null, images);
		});
	};

	PluginManager.registerPlugin(Instagram, 'me.danpalmer.River.plugins.Instagram');

})();