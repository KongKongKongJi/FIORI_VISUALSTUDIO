sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("testproject1.controller.Main", {
            onInit: function () {
                this.getOwnerComponent().getModel().read("/INVSet", {
                    success: function(oReturn) {
                        debugger;
                    }
                });
            }
        });
    });
