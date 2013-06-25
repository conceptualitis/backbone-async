(function (root) {
    var $ = root.jQuery,
        _ = root._,
        Backbone = root.Backbone,
        requestList = ["GET", "POST", "PUT", "DELETE"];

    // a simple wrapper for AJAX requests
    // you must define an "actions" dict with URLs
    // as keys and this will run the appropriate request
    // when you do something like myModel.async("restaurants", { data: true })
    var async = function (action, data) {
        if (!action) {
            // doing some request chaining so you could
            // do myModel.async().get("restaurants")
            return _.object(_.map(requestList, function (request) {
                return [request.toLowerCase(), $.proxy(function (action) {
                    this.actions[action].type = request;
                    this.async.apply(this, arguments);
                }, this)];
            }, this));
        }

        if (!this.actions || !this.actions[action]) {
            console.log("query information for the action '" + action + "' hasn't been set up");
            return;
        }

        // save this for possible use inside callbacks
        this.actions[action].data = data || {};

        this.actions[action].url = ((typeof this.url === "function") ? this.url() : this.url) + "/" + action;

        // return the jQuery deferred object
        return $.ajax({
            type: this.actions[action].type,
            url: this.actions[action].url,
            data: this.actions[action].data
        })
        .then(
            $.proxy(this.actions[action].success, this),
            $.proxy(this.actions[action].failure, this)
        );
    };

    Backbone.Model.prototype.async = Backbone.Collection.prototype.async = async;

})(this);