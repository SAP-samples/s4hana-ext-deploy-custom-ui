sap.ui.define([
	"sap/ui/equipment/EquipmentCRUD/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, MessageBox, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("sap.ui.equipment.EquipmentCRUD.controller.CreateEntity", {
		equipmentType: "",
		currencyId: "",
		statusId: "",
		_oBinding: {},

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			var that = this;
			this.getRouter().getTargets().getTarget("create").attachDisplay(null, this._onDisplay, this);
			this._oODataModel = this.getOwnerComponent().getModel();
			this._oResourceBundle = this.getResourceBundle();
			this._oViewModel = new JSONModel({
				enableCreate: false,
				delay: 0,
				busy: false,
				mode: "create",
				viewTitle: ""
			});
			this.setModel(this._oViewModel, "viewModel");

			// Register the view with the message manager
			sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
			var oMessagesModel = sap.ui.getCore().getMessageManager().getMessageModel();
			this._oBinding = new sap.ui.model.Binding(oMessagesModel, "/", oMessagesModel.getContext("/"));
			this._oBinding.attachChange(function (oEvent) {
				var aMessages = oEvent.getSource().getModel().getData();
				for (var i = 0; i < aMessages.length; i++) {
					if (aMessages[i].type === "Error" && !aMessages[i].technical) {
						that._oViewModel.setProperty("/enableCreate", false);
					}
				}
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler (attached declaratively) for the view save button. Saves the changes added by the user. 
		 * @function
		 * @public
		 */
		onSave: function () {
			var that = this,
				oModel = this.getModel();

			// abort if the  model has not been changed
			if (!oModel.hasPendingChanges()) {
				MessageBox.information(
					this._oResourceBundle.getText("noChangesMessage"), {
						id: "noChangesInfoMessageBox",
						styleClass: that.getOwnerComponent().getContentDensityClass()
					}
				);
				return;
			}
			this.getModel("appView").setProperty("/busy", true);
			if (this._oViewModel.getProperty("/mode") === "edit") {
				// attach to the request completed event of the batch
				oModel.attachEventOnce("batchRequestCompleted", function (oEvent) {
					if (that._checkIfBatchRequestSucceeded(oEvent)) {
						that._fnUpdateSuccess();
					} else {
						that._fnEntityCreationFailed();
						MessageBox.error(that._oResourceBundle.getText("updateError"));
					}
				});
			}
			oModel.submitChanges();
		},

		_checkIfBatchRequestSucceeded: function (oEvent) {
			var oParams = oEvent.getParameters();
			var aRequests = oEvent.getParameters().requests;
			var oRequest;
			if (oParams.success) {
				if (aRequests) {
					for (var i = 0; i < aRequests.length; i++) {
						oRequest = oEvent.getParameters().requests[i];
						if (!oRequest.success) {
							return false;
						}
					}
				}
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Event handler (attached declaratively) for the view cancel button. Asks the user confirmation to discard the changes. 
		 * @function
		 * @public
		 */
		onCancel: function () {
			// check if the model has been changed
			if (this.getModel().hasPendingChanges()) {
				// get user confirmation first
				this._showConfirmQuitChanges(); // some other thing here....
			} else {
				this.getModel("appView").setProperty("/addEnabled", true);
				// cancel without confirmation
				this._navBack();
			}
		},

		/* =========================================================== */
		/* Internal functions
		/* =========================================================== */
		/**
		 * Navigates back in the browser history, if the entry was created by this app.
		 * If not, it navigates to the Details page
		 * @private
		 */
		_navBack: function () {
			var oHistory = sap.ui.core.routing.History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();

			this.getView().unbindObject();
			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				this.getRouter().getTargets().display("object");
			}
		},

		/**
		 * Opens a dialog letting the user either confirm or cancel the quit and discard of changes.
		 * @private
		 */
		_showConfirmQuitChanges: function () {
			var oComponent = this.getOwnerComponent(),
				oModel = this.getModel();
			var that = this;
			MessageBox.confirm(
				this._oResourceBundle.getText("confirmCancelMessage"), {
					styleClass: oComponent.getContentDensityClass(),
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							that.getModel("appView").setProperty("/addEnabled", true);
							oModel.resetChanges();
							that._navBack();
						}
					}
				}
			);
		},

		/**
		 * Prepares the view for editing the selected object
		 * @param {sap.ui.base.Event} oEvent the  display event
		 * @private
		 */
		_onEdit: function (oEvent) {
			var oData = oEvent.getParameter("data"),
				oView = this.getView();
			this._oViewModel.setProperty("/mode", "edit");
			this._oViewModel.setProperty("/enableCreate", true);
			this._oViewModel.setProperty("/viewTitle", this._oResourceBundle.getText("editViewTitle"));

			oView.bindElement({
				path: oData.objectPath
			});
		},

		/**
		 * Prepares the view for creating new object
		 * @param {sap.ui.base.Event} oEvent the  display event
		 * @private
		 */

		_onCreate: function (oEvent) {
			if (oEvent.getParameter("name") && oEvent.getParameter("name") !== "create") {
				this._oViewModel.setProperty("/enableCreate", false);
				this.getRouter().getTargets().detachDisplay(null, this._onDisplay, this);
				this.getView().unbindObject();
				return;
			}

			this._oViewModel.setProperty("/viewTitle", this._oResourceBundle.getText("createViewTitle"));
			this._oViewModel.setProperty("/mode", "create");
			var oContext = this._oODataModel.createEntry("YY1_EQUIPMENT", {
				success: this._fnEntityCreated.bind(this),
				error: this._fnEntityCreationFailed.bind(this)
			});
			this.getView().setBindingContext(oContext);
		},

		/**
		 * Checks if the save button can be enabled
		 * @private
		 */
		_validateSaveEnablement: function () {
			var aInputControls = this._getFormFields(this.byId("newEntitySimpleForm"));
			var oControl;
			for (var m = 0; m < aInputControls.length; m++) {
				oControl = aInputControls[m].control;
				if (aInputControls[m].required) {
					var sValue = oControl.getValue();
					if (!sValue) {
						this._oViewModel.setProperty("/enableCreate", false);
						return;
					}
				}
			}
			this._checkForErrorMessages();
		},

		/**
		 * Checks if there is any wrong inputs that can not be saved.
		 * @private
		 */

		_checkForErrorMessages: function () {
			var aMessages = this._oBinding.oModel.oData;
			if (aMessages.length > 0) {
				var bEnableCreate = true;
				for (var i = 0; i < aMessages.length; i++) {
					if (aMessages[i].type === "Error" && !aMessages[i].technical) {
						bEnableCreate = false;
						break;
					}
				}
				this._oViewModel.setProperty("/enableCreate", bEnableCreate);
			} else {
				this._oViewModel.setProperty("/enableCreate", true);
			}
		},

		/**
		 * Handles the success of updating an object
		 * @private
		 */
		_fnUpdateSuccess: function () {
			this.getModel("appView").setProperty("/busy", false);
			this.getView().unbindObject();
			this.getRouter().getTargets().display("object");
		},

		/**
		 * Handles the success of creating an object
		 *@param {object} oData the response of the save action
		 * @private
		 */
		_fnEntityCreated: function (oData) {
			var sObjectPath = this.getModel().createKey("YY1_EQUIPMENT", oData);
			this.getModel("appView").setProperty("/itemToSelect", "/" + sObjectPath); //save last created
			this.getModel("appView").setProperty("/busy", false);
			this.getRouter().getTargets().display("object");
		},

		/**
		 * Handles the failure of creating/updating an object
		 * @private
		 */
		_fnEntityCreationFailed: function () {
			this.getModel("appView").setProperty("/busy", false);
		},

		/**
		 * Handles the onDisplay event which is triggered when this view is displayed 
		 * @param {sap.ui.base.Event} oEvent the on display event
		 * @private
		 */
		_onDisplay: function (oEvent) {
			var oData = oEvent.getParameter("data");
			if (oData && oData.mode === "update") {
				this._onEdit(oEvent);
			} else {
				this._onCreate(oEvent);
			}
		},

		/**
		 * Gets the form fields
		 * @param {sap.ui.layout.form} oSimpleForm the form in the view.
		 * @private
		 */
		_getFormFields: function (oSimpleForm) {
			var aControls = [];
			var aFormContent = oSimpleForm.getContent();
			var sControlType;
			for (var i = 0; i < aFormContent.length; i++) {
				sControlType = aFormContent[i].getMetadata().getName();
				if (sControlType === "sap.m.Input" || sControlType === "sap.m.DateTimeInput" ||
					sControlType === "sap.m.CheckBox") {
					aControls.push({
						control: aFormContent[i],
						required: aFormContent[i - 1].getRequired && aFormContent[i - 1].getRequired()
					});
				}
			}
			return aControls;
		},

		//valueHelp for equipment type input
		handleValueHelp: function (oEvent) {
			this.equipmentType = oEvent.getSource().getId();

			if(!this._oEquipmentTypeValueHelpDialog){
				this._oEquipmentTypeValueHelpDialog = new sap.m.SelectDialog({
					confirm: this._handleValueHelpClose1.bind(this),
					search: this._handleValueHelpSearch1
				});
				
				this._oEquipmentTypeValueHelpDialog.bindAggregation("items", {
				path: "/YY1_EQUIPMENTTYPE",
				template: new sap.m.StandardListItem({
						title: "{Description}",
						description: "{Code}"
					})
				});
				
				this._oEquipmentTypeValueHelpDialog.setModel(this.getOwnerComponent().getModel());
				
				this._oEquipmentTypeValueHelpDialog.filterFor = function(sQuery){
					var oFilter = [];
					if (sQuery) {
						oFilter = [new Filter([ // a filter which applies OR condition
										new Filter("Description", FilterOperator.Contains, sQuery),
										new Filter("Code", FilterOperator.Contains, sQuery)
									],
									false)];
					}
					this.getBinding("items").filter(oFilter);
				};
			}
			var sQuery = oEvent.getSource().getValue();
			this._oEquipmentTypeValueHelpDialog.open(sQuery);
			this._oEquipmentTypeValueHelpDialog.filterFor(sQuery);
		},

		_handleValueHelpSearch1: function (evt) {
			var sQuery = evt.getParameter("value");
			evt.getSource().filterFor(sQuery);
		},

		_handleValueHelpClose1: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.equipmentType);
				productInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		//valueHelp for Currency
		handleValueHelpC: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.currencyId = oEvent.getSource().getId();

			// create value help dialog
			var selDialogue = new sap.m.SelectDialog({
				confirm: this._handleValueHelpCloseC.bind(this),
				search: this._handleValueHelpSearchC
			});
			selDialogue.bindAggregation("items", {
				path: "/I_Currency",
				template: new sap.m.StandardListItem({
					title: "{Currency_Text}",
					description: "{Currency}"

				})
			});
			var oModel = this.getOwnerComponent().getModel();
			selDialogue.setModel(oModel);
			selDialogue.open();

			// create a filter for the binding
			selDialogue.getBinding("items").filter([new Filter(
				"Currency_Text",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			selDialogue.open(sInputValue);
		},

		_handleValueHelpSearchC: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Currency_Text",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpCloseC: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var currencyInput = this.getView().byId(this.currencyId);
				currencyInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		//valueHelp for Equipment Status
		handleValueHelpS: function (oEvent) {
			this.statusId = oEvent.getSource().getId();

			if(!this._oEquipmentStatusValueHelpDialog){
				this._oEquipmentStatusValueHelpDialog = new sap.m.SelectDialog({
					confirm: this._handleValueHelpCloseS.bind(this),
					search: this._handleValueHelpSearchS
				});
				
				this._oEquipmentStatusValueHelpDialog.bindAggregation("items", {
				path: "/YY1_EQUIPMENTSTATUS",
				template: new sap.m.StandardListItem({
						title: "{Description}",
						description: "{Code}"
					})
				});
				
				this._oEquipmentStatusValueHelpDialog.setModel(this.getOwnerComponent().getModel());
				
				this._oEquipmentStatusValueHelpDialog.filterFor = function(sQuery){
					var oFilter = [];
					if (sQuery) {
						oFilter = [new Filter([ // a filter which applies OR condition
										new Filter("Description", FilterOperator.Contains, sQuery),
										new Filter("Code", FilterOperator.Contains, sQuery)
									],
									false)];
					}
					this.getBinding("items").filter(oFilter);
				};
			}
			
			var sQuery = oEvent.getSource().getValue();
			this._oEquipmentStatusValueHelpDialog.open(sQuery);
			this._oEquipmentStatusValueHelpDialog.filterFor(sQuery);
		},

		_handleValueHelpSearchS: function (oEvent) {
			var sQuery = oEvent.getParameter("value");
			oEvent.getSource().filterFor(sQuery);
		},

		_handleValueHelpCloseS: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var statusInput = this.getView().byId(this.statusId);
				statusInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		}
	});

});