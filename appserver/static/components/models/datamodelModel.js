define([
    'underscore',
    'backbone',
], function (_, Backbone) {
    "use strict";

    var DatamodelModel = Backbone.Model.extend({

        defaults: {
            _key: "",
            comments: "",
            contact: "",
            datamodel: "",
            late_seconds: "",
            field_value: "",
        }

    });

    return new DatamodelModel();

});