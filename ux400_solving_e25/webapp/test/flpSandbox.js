sap.ui.define([
	"sap/base/util/ObjectPath",
	"sap/ushell/services/Container"
], function (ObjectPath) {
	"use strict";

	// define ushell config
	ObjectPath.set(["sap-ushell-config"], {
		defaultRenderer: "fiori2",
		bootstrapPlugins: {
			"RuntimeAuthoringPlugin": {
				component: "sap.ushell.plugins.rta",
				config: {
					validateAppVersion: false
				}
			},
			"PersonalizePlugin": {
				component: "sap.ushell.plugins.rta-personalize",
				config: {
					validateAppVersion: false
				}
			}
		},
		renderers: {
			fiori2: {
				componentData: {
					config: {
						enableSearch: false,
						rootIntent: "Shell-home"
					}
				}
			}
		},
		services: {
			"LaunchPage": {
				"adapter": {
					"config": {
						"groups": [{
							"tiles": [{
								"tileType": "sap.ushell.ui.tile.StaticTile",
								"properties": {
									"title": "UX400 문제",
									"targetURL": "#sapbtpux400solvinge25-display"
								}
							}]
						}]
					}
				}
			},
			"ClientSideTargetResolution": {
				"adapter": {
					"config": {
						"inbounds": {
							"sapbtpux400solvinge25-display": {
								"semanticObject": "sapbtpux400solvinge25",
								"action": "display",
								"description": "UX400 문제",
								"title": "UX400 문제",
								"signature": {
									"parameters": {}
								},
								"resolutionResult": {
									"applicationType": "SAPUI5",
									"additionalInformation": "SAPUI5.Component=sap.btp.ux400solvinge25",
									"url": sap.ui.require.toUrl("sap/btp/ux400solvinge25")
								}
							}
						}
					}
				}
			},
			NavTargetResolution: {
				config: {
					"enableClientSideTargetResolution": true
				}
			}
		}
	});

	var oFlpSandbox = {
		init: function () {
			/**
			 * Initializes the FLP sandbox
			 * @returns {Promise} a promise that is resolved when the sandbox bootstrap has finshed
			 */

			// sandbox is a singleton, so we can start it only once
			if (!this._oBootstrapFinished) {
				this._oBootstrapFinished = sap.ushell.bootstrap("local");
				this._oBootstrapFinished.then(function () {
					sap.ushell.Container.createRenderer().placeAt("content");
				});
			}

			return this._oBootstrapFinished;
		}
	};

	return oFlpSandbox;
});