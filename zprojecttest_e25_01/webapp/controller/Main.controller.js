sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectteste2501.controller.Main", {
            onInit: function () {
                
            },
            onButtonPress: function(oEvent){
                // debugger;
                //alert('버튼 이벤트 함수 실행!');

               let sValue = this.byID("idInput1").getValue();
               alert(sValue);
            }
        });
    });
