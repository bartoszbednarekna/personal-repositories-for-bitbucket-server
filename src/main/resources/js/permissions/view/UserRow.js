define('UserRow', [ 'backbone' ], function(Backbone) {
	return Backbone.View.extend({

		tagName : 'tr',
		template : org.networkedassets.personalrepos.permissions.userRow,

		events : {
			'click .delete-button' : 'onDelete'
		},

		onDelete : function(e) {
			e.preventDefault();
			this.model.destroy();
			this.remove();
		},

		render : function() {
			this.$el.html(this.template({
				user : this.model.toJSON()
			}));
			return this;
		}
	});
});