jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 YY1_EQUIPMENT in the list
// * All 3 YY1_EQUIPMENT have at least one to_AssignedTo

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/App",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/Browser",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/Master",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/Detail",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/Create",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.ui.equipment.EquipmentCRUD.view."
	});

	sap.ui.require([
		"sap/ui/equipment/EquipmentCRUD/test/integration/MasterJourney",
		"sap/ui/equipment/EquipmentCRUD/test/integration/NavigationJourney",
		"sap/ui/equipment/EquipmentCRUD/test/integration/NotFoundJourney",
		"sap/ui/equipment/EquipmentCRUD/test/integration/BusyJourney",
		"sap/ui/equipment/EquipmentCRUD/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});