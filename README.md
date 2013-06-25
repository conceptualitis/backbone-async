backbone-async
==============

A function for making simple asynchronous requests in your Backbone applications by adding an `async()` function to both `Backbone.Model` and `Backbone.Collection`.

Backbone-async uses the `url` property of your collections and models to construct requests, so make sure those are defined.


Setup
-----

You'll need to add an `actions` object to your model or collection, a basic example for a model:

```javascript
actions: {
  "type": "GET" // type is optional
  "yelp_reviews": {
    success: function (response) {
      this.add("reviews", response.reviews);
    }
  }
}
```

Usage
-----

If you haven't defined type:

```javascript
// on a model, posts to something like "restaurants/12345/favorite"
restaurant.async().post("favorite");

// and to remove
restaurant.async().delete("favorite");


// on a collection, sends a get request to something like "restaurants/yelp_reviews"
// you can also pass data, here it would be a list of restaurant ids
restaurants.async().get("yelp_reviews", { ids: restaurantIDs });
```


If you've defined type you'll have to do something like this:

```javascript
restaurant.async("favorite");
restaurant.async("unfavorite");

restaurants.async("yelp_reviews", { ids: [12345, 12346, 12347] });
```

Example
-------

In a view right now you might have something like this:

```javascript
events: {
  "click .heart": "favorite"
}

// ...

favorite: function () {
  $.ajax({
    type: "POST",
    url: this.model.url + "/favorite",
    success: $.proxy(function (response) {
      this.model.set("favorite", response.favorite);
    }, this)
  });
}
```

With backbone-async you'd move your success function to the model and end up with a view more like this:

```javascript
events: {
  "click .heart": "favorite"
}

// ...

favorite: function () {
  this.model.async().post("favorite");
}
```

Easy as pie.
