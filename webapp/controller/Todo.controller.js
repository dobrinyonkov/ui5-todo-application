sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/StandardListItem',
], function (Controller, StandardListItem) {
	"use strict";

	return Controller.extend("todo.controller.Todo", {
		onInit() {
			// cache input to later get their values
			this.list = this.byId("list");
			this.titleInput = this.byId("title");
			this.firstNameInput = this.byId("firstName");
			this.lastNameInput = this.byId("lastName");
			this.topicSelect = this.byId("topic");
			this.estimateInput = this.byId("estimate");
			this.completedCheckBox = this.byId("completed");
		},

		resetValues: function() {
			this.titleInput.setValue("");
			this.topicSelect.setSelectedKey("Work");
			this.estimateInput.setValue("");
			this.firstNameInput.setValue("");
			this.lastNameInput.setValue("");
			this.completedCheckBox.setSelected(false);
		},

		handleSavePress: function () {
			var sFullName = this.getFullName(),
				sDescription = this.topicSelect.getSelectedItem().getText();

			if (sFullName) {
				sDescription += " | " + sFullName;
			}

			this.list.addItem(new StandardListItem({
				selected: this.completedCheckBox.getSelected(),
				title: this.titleInput.getValue(),
				description: sDescription,
				counter: parseInt(this.estimateInput.getValue())
			}));

			this.resetValues();
		},


		getFullName: function () {
			var firsName = this.firstNameInput.getValue(),
				lastName = this.lastNameInput.getValue();

			return [firsName, lastName].filter(Boolean).join(" ");
		},
	});
});
