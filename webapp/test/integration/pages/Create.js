sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/PropertyStrictEquals"
], function (Opa5, Common, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals) {
	"use strict";

	var sViewName = "CreateEntity";

	Opa5.createPageObjects({
		onTheCreatePage: {
			baseClass: Common,

			actions: {
				iPressTheCancelButton: function () {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						success: function (oPage) {
							oPage.$("cancel"); //???
						},
						errorMessage: "Did not find the cancel button on detail page"
					});
				}

			},

			assertions: {

				iShouldSeeTheBusyIndicator: function () {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						success: function (oPage) {
							// we set the view busy, so we need to query the parent of the app
							Opa5.assert.ok(oPage.getBusy(), "The detail view is busy");
						},
						errorMessage: "The detail view is not busy."
					});
				},

				iShouldSeeNoBusyIndicator: function () {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						matchers: function (oPage) {
							return !oPage.getBusy();
						},
						success: function (oPage) {
							// we set the view busy, so we need to query the parent of the app
							Opa5.assert.ok(!oPage.getBusy(), "The detail view is not busy");
						},
						errorMessage: "The detail view is busy."
					});
				},

				theCreatePageShowsTheCreateForm: function () {
					return this.iShouldBeOnTheCreateEntityPage();
				},

				iShouldBeOnTheCreateEntityPage: function () {
					this.waitFor({
						controlType: "sap.ui.layout.form.SimpleForm",
						viewName: sViewName,
						matchers: new PropertyStrictEquals({
							name: "title",
							value: "New YY1_EQUIPMENT_CDS.YY1_EQUIPMENTType"
						}),
						success: function () {
							Opa5.assert.ok(true, "was on the create page ");
						},
						errorMessage: "Create page object is not shown"
					});
				},
				iShouldBeOnTheEditEntityPage: function () {
					this.waitFor({
						controlType: "sap.ui.layout.form.SimpleForm",
						viewName: sViewName,
						matchers: new PropertyStrictEquals({
							name: "title",
							value: "Edit YY1_EQUIPMENT_CDS.YY1_EQUIPMENTType"
						}),
						success: function () {
							Opa5.assert.ok(true, "was on the create page ");
						},
						errorMessage: "Create page object is not shown"
					});
				},

				iShouldSeeTheSaveButton: function () {
					return this.waitFor({
						id: "save",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The E-Mail button is visible");
						},
						errorMessage: "The Save button was not found"
					});
				},
				theSaveButtonShouldBeDisabled: function () {
					return this.waitFor({
						viewName: sViewName,
						id: "save",
						matchers: new PropertyStrictEquals({
							name: "enabled",
							value: false
						}),
						success: function () {
							Opa5.assert.ok(true, "The Save button is disabled");
						},
						errorMessage: "The Add button is enabled"
					});
				},
				theSaveButtonShouldBeEnabled: function () {
					return this.waitFor({
						viewName: sViewName,
						id: "save",
						matchers: new PropertyStrictEquals({
							name: "enabled",
							value: true
						}),
						success: function () {
							Opa5.assert.ok(true, "The Save button is enabled");
						},
						errorMessage: "The Add button is disabled"
					});
				}

			}

		}

	});

});