sap.ui.define([
	"sap/ui/equipment/EquipmentCRUD/model/GroupSortState",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (GroupSortState, JSONModel) {
	"use strict";

	QUnit.module("GroupSortState - grouping and sorting", {
		beforeEach: function () {
			this.oModel = new JSONModel({});
			// System under test
			this.oGroupSortState = new GroupSortState(this.oModel, function () {});
		}
	});

	QUnit.test("Should always return a sorter when sorting", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.sort("PurchasePrice_V").length, 1, "The sorting by PurchasePrice_V returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("EquipmentNumber").length, 1, "The sorting by EquipmentNumber returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("PurchasePrice_V").length, 1, "The group by PurchasePrice_V returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});

	QUnit.test("Should set the sorting to PurchasePrice_V if the user groupes by PurchasePrice_V", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("PurchasePrice_V");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "PurchasePrice_V", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by EquipmentNumber and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "PurchasePrice_V");

		this.oGroupSortState.sort("EquipmentNumber");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});