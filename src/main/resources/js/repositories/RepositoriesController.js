define('RepositoriesController', [ 'underscore', 'jquery', 'RepositoriesTable',
		'RepositoryOwners', 'UserRepositories', 'backbone', 'PluginState', 'RepositoriesLoader' ], function(_, $,
		RepositoriesTable, RepositoryOwners, UserRepositories, Backbone, PluginState, RepositoriesLoader) {
	var constr = function(opts) {
		this.initialize(opts);
	};

	_.extend(constr.prototype, {
		initialize : function(opts) {
			this.region = $(opts.region);
			_.bindAll(this, 'onPageSelected', 'onUserExpanded',
					'onChangeOrder', 'onChangeSort', 'onPluginStateFetch');
		},

		start : function() {
			this.pluginState = new PluginState();
			this.runPluginStateChecks();
		},
		
		runPluginStateChecks : function() {
			this.pluginState.fetch().done(this.onPluginStateFetch);
		},
		
		onPluginStateFetch : function() {
			if (this.pluginState.get('state') === 'SCANNING') {
				this.displayLoader();
				setTimeout(_.bind(this.runPluginStateChecks, this), 1000);
			}
			else {
				this.startWhenPluginReady();
			}
		},
		
		displayLoader : function() {
			if (!this.loader) {
				this.loader = new RepositoriesLoader();
				this.region.html(this.loader.render().el);
			}
		},
		
		startWhenPluginReady : function() {
			this.createModels();
			this.createView();
			this.showTable();
			this.fetchFirstPage();
		},

		createModels : function() {
			this.repositoryOwners = new RepositoryOwners();
			this.repositoryOwners.setSorting('size', 1);
			this.repositoriesEvents = {};
			_.extend(this.repositoriesEvents, Backbone.Events);
		},

		createView : function() {
			this.repositoriesTable = new RepositoriesTable({
				collection : this.repositoryOwners,
				repositoriesEvents : this.repositoriesEvents
			});

			this.repositoriesTable.on('page-selected', this.onPageSelected);
			this.repositoriesTable.on('user-expanded', this.onUserExpanded);
			this.repositoriesTable.on('sort-change-order', this.onChangeOrder);
			this.repositoriesTable.on('sort-change-field', this.onChangeSort);

		},

		showTable : function() {
			this.region.html(this.repositoriesTable.el);
		},

		fetchFirstPage : function() {
			this.repositoryOwners.getFirstPage();
		},

		onPageSelected : function(pageNumber) {
			this.repositoryOwners.getPage(pageNumber);
		},

		onUserExpanded : function(userId) {
			var repositories = new UserRepositories([], {
				userId : userId
			});
			repositories.sortBy(this.repositoryOwners.state.sortKey);
			repositories.orderBy(this.repositoryOwners.state.order > 0 ? 'desc' : 'asc');
			repositories.fetch().done(_.bind(function() {
				this.notifyAboutFetchedRepositories(userId, repositories);
			}, this));
		},

		notifyAboutFetchedRepositories : function(userId, repos) {
			this.repositoriesEvents.trigger('userRepositoriesFetched', {
				repositories : repos,
				userId : userId
			});
		},

		onChangeOrder : function() {
			var col = this.repositoryOwners;
			col.setSorting(col.state.sortKey, -col.state.order);
			col.getPage(col.state.currentPage, {
				reset : true
			});

		},

		onChangeSort : function(sortKey) {
			var col = this.repositoryOwners;
			if (sortKey === 'name') {
				col.setSorting(sortKey, -1);
			} else {
				col.setSorting(sortKey, 1);
			}
			col.getPage(col.state.currentPage, {
				reset : true
			});
		},
		
		close : function() {
			
		}

	});

	return constr;
});