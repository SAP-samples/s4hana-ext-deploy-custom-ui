jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/App",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/Browser",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/Master",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/Detail",
	"sap/ui/equipment/EquipmentCRUD/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.ui.equipment.EquipmentCRUD.view."
	});

	sap.ui.require([
		"sap/ui/equipment/EquipmentCRUD/test/integration/NavigationJourneyPhone",
		"sap/ui/equipment/EquipmentCRUD/test/integration/NotFoundJourneyPhone",
		"sap/ui/equipment/EquipmentCRUD/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});