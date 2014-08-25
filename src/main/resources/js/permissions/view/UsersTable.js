define('UsersTable', [ 'Table', 'UserRow', 'UserBatch', 'Config' ], function(
		Table, UserRow, UserBatch, Config) {
	return Table.extend({

		template : org.networkedassets.personalstash.permissions.table,
		itemView : UserRow,
		searchFormatResult : function(object) {
			return org.networkedassets.personalstash.permissions
					.userSearchResult({
						user : object
					})
		},

		searchFormatSelection : function(object) {
			return org.networkedassets.personalstash.permissions
					.userSearchSelection({
						user : object
					})
		},

		initialize : function() {
			Table.prototype.initialize.apply(this, arguments);
			_.bindAll(this, 'onAddSuccess', 'handleAdd');
		},

		searchUrl : function(term) {
			return Config.urlBase + '/users/find/' + term;
		},

		prepareTemplateParams : function() {
			return {
				mode : this.mode,
				header : {
					allow : AJS.I18n.getText('org.networkedassets.atlassian.stash.personalstash.permissions.users.header.denied'),
					deny : AJS.I18n.getText('org.networkedassets.atlassian.stash.personalstash.permissions.users.header.allowed')
				}
			};
		},

		handleAdd : function(values) {
			var userBatch = new UserBatch({
				ids : values
			});
			userBatch.save({}, {
				success : this.onAddSuccess
			});
		},

		onAddSuccess : function() {
			this.collection.fetch();
			this.clearSearchInput();
		}

	});
});