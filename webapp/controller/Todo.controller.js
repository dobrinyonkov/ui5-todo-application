sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/StandardListItem',
	'sap/m/Text',
	'sap/ui/core/Icon',
	'sap/m/Button',
	'sap/m/ButtonType',
	'sap/m/Dialog',
	'sap/m/DialogType',
	'sap/m/MessageToast',
	'sap/m/MessageStrip',
	'sap/ui/core/InvisibleMessage',
	'sap/ui/core/library',
], function (Controller, StandardListItem, Text, Icon, Button, ButtonType, Dialog, DialogType, MessageToast, MessageStrip, InvisibleMessage, library) {
	"use strict";

	var InvisibleMessageMode = library.InvisibleMessageMode;

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

			this.oInvisibleMessage = InvisibleMessage.getInstance();
		},

		validateTitleInput: function () {
			var sValue,
				oInput = this.titleInput;

			if (oInput) {
				sValue = oInput.getValue().length > 3;

				if (sValue) {
					oInput.setValueState(sap.ui.core.ValueState.Success);
					oInput.setValueStateText("");
				} else {
					oInput.setValueState(sap.ui.core.ValueState.Error);
					oInput.setValueStateText("Enter at least 3 characters!");
				}
			}

			return !!sValue
		},

		resetValues: function () {
			this.titleInput.setValue("");
			this.topicSelect.setSelectedKey("Work");
			this.estimateInput.setValue("");
			this.firstNameInput.setValue("");
			this.lastNameInput.setValue("");
			this.completedCheckBox.setSelected(false);

			this.titleInput.setValueState(sap.ui.core.ValueState.None);
			this.titleInput.setValueStateText("");
		},

		onApprove: function () {
			var sFullName = this.getFullName(),
				sDescription = this.topicSelect.getSelectedItem().getText();

			if (sFullName) {
				sDescription += " | " + sFullName;
			}

			this.list.addItem(new StandardListItem({
				title: this.titleInput.getValue(),
				description: sDescription,
				counter: parseInt(this.estimateInput.getValue())
			}));
		},

		onDelete() {
			if (this._itemToDelete) {
				// after deletion put the focus back to the list
				this.list.attachEventOnce("updateFinished", this.list.focus, this.list);
				
				// delete
				this.list.removeItem(this._itemToDelete);
				this._itemToDelete = null
			}
		},

		handleDeletePress: function(oEvent) {
			this._itemToDelete = oEvent.getParameter("listItem");

			this.getDeleteDialog().open();
		},

		handleSavePress: function () {
			var bValidTitle = this.validateTitleInput();

			if (!bValidTitle) {
				this.generateMsgStrip();
				return;
			}

			this.getApproveDialog().open();
		},

		getApproveDialog: function () {
			var sMessage;
			if (!this.oApproveDialog) {
				sMessage = "New Todo was saved!";

				this.oApproveDialog = new Dialog({
					type: DialogType.Message,
					title: "Confirm",
					content: [
						new Icon("__dialogIcon", { src: "sap-icon://accept", size: "18px" }).addStyleClass("sapUiTinyMargin"),
						new Text("__dialogText", { text: "Do you want to submit this todo?" })
					],
					ariaDescribedBy: ["__dialogIcon", "__dialogText"],
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Submit",
						press: function () {
							this.onApprove();
							this.resetValues();

							MessageToast.show(sMessage);

							this.oApproveDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancel",
						press: function () {
							this.oApproveDialog.close();
						}.bind(this)
					})
				});
			}

			return this.oApproveDialog;
		},
		
		getDeleteDialog: function () {
			var sMessage;
			if (!this.oDeleteDialog) {
				sMessage = "Todo was deleted!";

				this.oDeleteDialog = new Dialog({
					type: DialogType.Message,
					title: "Confirm",
					content: [
						new Icon("__deleteDialogIcon", { src: "sap-icon://delete", size: "18px" }).addStyleClass("sapUiTinyMargin"),
						new Text("__deleteDialogText", { text: "Do you want to delete this todo?" })
					],
					ariaDescribedBy: ["__dialogIcon", "__dialogText"],
					beginButton: new Button({
						icon:"sap-icon://accept",
						type: ButtonType.Icon,
						press: function () {
							this.onDelete();
							this.resetValues();

							this.oDeleteDialog.close();

							MessageToast.show(sMessage);
						}.bind(this)
					}),
					endButton: new Button({
						type: ButtonType.Icon,
						icon:"sap-icon://decline",
						press: function () {
							this.oDeleteDialog.close();
						}.bind(this)
					})
				});
			}

			return this.oDeleteDialog;
		},

		generateMsgStrip: function () {
			var sText = "Please make sure the form is valid!",
				oPlaceHolder = this.byId("page"),
				oMsgStrip = new MessageStrip("msgStrip", {
					text: sText,
					type: "Error"
				}).addStyleClass("sapUiTinyMargin");

			oPlaceHolder.insertContent(oMsgStrip, 0);
			this.oInvisibleMessage.announce(sText, InvisibleMessageMode.Assertive);

			setTimeout(function (){
				oPlaceHolder.removeContent(oMsgStrip);
				oMsgStrip.destroy();
			}, 5000)
		},

		getFullName: function () {
			var firsName = this.firstNameInput.getValue(),
				lastName = this.lastNameInput.getValue();

			return [firsName, lastName].filter(Boolean).join(" ");
		},
	});
});
