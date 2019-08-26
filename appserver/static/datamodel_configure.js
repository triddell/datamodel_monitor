require.config({
    paths: {
        "datamodelModel" : '../app/datamodel_monitor/components/models/datamodelModel'
    }
});

require([
    'underscore',
    'backbone',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    '../app/datamodel_monitor/components/views/datamodelView',
    "datamodelModel",
    'splunkjs/mvc/simplexml/ready!'
], function(_, Backbone, $, mvc, TableView, SearchManager, ModalView, ModalModel) {

    var tokens = mvc.Components.get("submitted");

	var eventBus = _.extend({}, Backbone.Events);
	var lookupTable = mvc.Components.get("lookupTable");
	var lookupSearch = mvc.Components.get("lookupSearch");
	var removeRow = mvc.Components.get("removeRow");
	var addRow = mvc.Components.get("addRow");
	var updateRow = mvc.Components.get("updateRow");
	var model = ModalModel;

	$(document).find('.dashboard-body').append('<button id="addNewRow" class="btn btn-primary">Add New</button>');

	$(document).on('click', '#addNewRow', function(e) {

		e.preventDefault();

		model.set({
			_key: "",
            comments: "",
            contact: "",
            datamodel: "",
            late_seconds: "",
            field_value: "",
		});

		var modal = new ModalView({ model : model,
			eventBus : eventBus,
			mode : 'New',
			tokens : tokens });

		modal.show();

	});

	lookupTable.on("click", function(e) {
        e.preventDefault();
		var target = $(e.data)[0]["click.value2"];

		var event = $(e.data)[0];

		model.set({
			_key: event['row.key'],
			comments: event['row.comments'],
			contact: event['row.contact'],
			datamodel: event['row.datamodel'],
			late_seconds: event['row.late_seconds'],
			field_value: event['row.field_value'],
		});

		if(target === 'Edit') {

			tokens.set('key_update_tok',$(e.data)[0]['row.key']);
			var modal = new ModalView({ model : model,
				eventBus : eventBus,
				mode : 'Edit',
				tokens : tokens });
			modal.show();
		}

		if(target === 'Clone') {

			var modal = new ModalView({ model : model,
				eventBus : eventBus,
				mode : 'New',
				tokens : tokens });
			modal.show();
		}

		if(target === 'Remove') {
			console.log('REMOVE');
			tokens.set('key_remove_tok', model.get("_key"));
			tokens.set('comments_remove_tok', model.get("comments"));
			tokens.set('contact_remove_tok', model.get("contact"));
			tokens.set('datamodel_remove_tok', model.get("datamodel"));
			tokens.set('field_value_remove_tok', model.get("field_value"));
			tokens.set('late_seconds_remove_tok', model.get("late_seconds"));

			eventBus.trigger("remove:row");

			//removeRow.startSearch();
		}

    });

	lookupSearch.on("search:done", function(props) {
		console.log('DONE');
	});

	eventBus.on("add:row", function(e) {
		addRow.startSearch();
	});

	eventBus.on("update:row", function(e) {
		updateRow.startSearch();
	});

	eventBus.on("remove:row", function(e) {
		removeRow.startSearch();
	});

	addRow.on('search:failed', function(properties) {
		console.error("FAILED:", properties);
	});

	addRow.on("search:done", function(props) {
		lookupSearch.startSearch();
	});

	updateRow.on("search:done", function(props) {
		lookupSearch.startSearch();
	});

	removeRow.on("search:done", function(props) {
		lookupSearch.startSearch();
	});


});
//# sourceURL=datamodel_configure.js