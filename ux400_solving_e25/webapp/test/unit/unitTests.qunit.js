/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sapbtp/ux400_solving_e25/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
