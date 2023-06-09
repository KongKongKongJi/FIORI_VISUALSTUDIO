/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zcbc_project_inv_count/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
