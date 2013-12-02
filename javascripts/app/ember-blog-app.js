// Ember application object
EmberBlog = Ember.Application.create({
  ready: function() {
    console.log('Ember is ready!');
  }
});

// Configure the Store to use the Fixture Adapter
EmberBlog.ApplicationAdapter = DS.FixtureAdapter.extend();

// A simple client-side model for a blog post
EmberBlog.BlogPost = DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string')
});

// Application Router
EmberBlog.Router.map(function() {
  this.resource('BlogPosts', { path: '/posts' }, function() {
    this.route('new');
    // this.route('show', {
    //   path: ':blog_post_id' 
    // });
  });
  this.resource('BlogPost', { 
    path: '/posts/:post_id' 
  });
});

// BlogPosts Route retrieves all BlogPosts
EmberBlog.BlogPostsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('BlogPost');
  }
});

// BlogPosts New Route, creates a new BlogPost
EmberBlog.BlogPostsNewRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('BlogPost');
  },
  actions: {
    save: function() {
      var route = this;
      this.get('currentModel').save().then(function(post) {
        console.log('Succesfully saved post: ' + post.get('title'));
        route.transitionTo('BlogPosts.index');
      }, function(post) {  
        console.log('Error saving post: ' + post.get('title'));
        route.transitionTo('BlogPosts');
      });
    },
    cancel: function() {
      this.get('currentModel').deleteRecord();
      this.transitionTo('BlogPosts');
    }
  }
});

EmberBlog.BlogPostRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('BlogPost', params.post_id);
  }
});

// EmberBlog.BlogPostsEditRoute = Ember.Route.extend({
//   model: function(params) {
//     this.store.find('BlogPost', params.user_id);
//   },
//   setupController: function(controller, model) {
//     controller.set('content', model);
//   }
// });

// Index controller
EmberBlog.IndexController = Ember.Controller.extend({
  postsCount: 0,
  init: function() {
    cntrl = this;
    this.store.find('BlogPost').then(function(posts) {
      cntrl.set('postsCount', posts.get('length'));
    });
  }
});

// Add some fixtures
EmberBlog.BlogPost.FIXTURES = [
  { id: '1', title: 'RWX Rocks!', body: "We're learning Ember" },
  { id: '2', title: 'HTML5 is here', body: '... to stay' },
  { id: '3', title: 'Groovy or Ruby?', body: 'Which one to choose?' },
  { id: '4', title: 'Is Maven making you angry?', body: 'Try Gradle!' }
];