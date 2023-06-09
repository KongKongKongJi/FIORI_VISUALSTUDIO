/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zcbc_project_emp_rating/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
