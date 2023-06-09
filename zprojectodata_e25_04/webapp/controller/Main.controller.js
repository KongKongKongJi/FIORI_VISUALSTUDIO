sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter) {
        "use strict";

        return Controller.extend("zprojectodatae2504.controller.Main", {
            onInit: function () {
                
            },
            onselectionChange: function(oControlEvent){
                var oRouter = this.getOwnerComponent().getRouter();
                var sPath = oControlEvent.getParameters().listItem.getBindingContextPath();
                let sKey = this.getView().getModel().getProperty(sPath+'/OrderID');

                oRouter.navTo("RouteDetail", {
                    "key" : sKey
                });
            },
            onValueHelpRequest: function() {
                /*

                    CustomerDialog.fragment.xml 오픈

                    해당 Dialog 안에 sap.ui.table.Table 세팅 후,
                    /Customers 바인딩한다. 표시한 필드는 CustomerID, CompanyName
                    팝업에 close 버튼을 구성하여 클릭 시 팝업이 닫히도록 한다.
                    
                */
                // sap.m.MessageToast.show("input value help 실행!");
                var oDialog = this.byId("Dialog");
                if (oDialog) {
                    oDialog.open();
                    return;
                }else{
                this.loadFragment({
                    name: "zprojectodatae2504.view.fragment.CustomerDialog"
                }).then(function(oDialog) {
                    oDialog.open();
                }, this); // this는 현재컨트롤러를 바라보게
                }
            },
            onClose: function() {
                this.byId("Dialog").close();
            },
            onrowSelectionChange: function(oEvent) {
                var oContext = oEvent.getParameter("rowContext").sPath;
                var sKey = this.getView().getModel().getProperty(oContext+'/CustomerID');
                this.byId("Input").setValue(sKey);
                // debugger;
                
                this._search(sKey);

                this.byId("Dialog").close();
            },
            _search: function(sKey) {
                let oFilter = new Filter({
                    filters: [
                        new Filter({ path: 'CustomerID', operator: 'EQ', value1: sKey })
                    ],
                    and: true
                });

                this.byId("idProductsTable").getBinding("items").filter([oFilter]);
            }
        });
    });
