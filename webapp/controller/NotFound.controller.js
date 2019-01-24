sap.ui.define([
		"prodrisk/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("prodrisk.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);