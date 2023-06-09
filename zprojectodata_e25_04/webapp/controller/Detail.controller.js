sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("zprojectodatae2504.controller.Detail", {
            onInit: function () {
                /*
                    list : {}
                    list : {1,2,문자,{},...}
                    list : 숫자
                */
                this.getView().setModel(new JSONModel(), "detail")

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);

            },
            _onPatternMatched: function(oEvent) {
                //oEvent.getParamters().argumetns
                var oVeiw = this.getView();
                var oArgu = oEvent.getParameter("arguments");
                var oDetailModel = oVeiw.getModel('detail');
                var oModel = oVeiw.getModel(); // Northwind OData Model
                var oFilter = new sap.ui.model.Filter('OrderID', 'EQ', oArgu.key);
                console.log(oArgu); // {key : 10248}

                oVeiw.setBusy(true);

                //GET : /iwfnd/gw_client
                // .../northwind.svc/Orders?$filter=OrderID eq 10248

                oModel.read("/Orders", {
                    urlParameters: {
                        '$expand' : 'Customer, Employee'
                    },
                    filters: [oFilter],
                    success: function(aaa) {
                        oVeiw.setBusy(false);
                        /// this, scope <- javascript 문법
                        console.log(aaa.results[0]);  // 한 건의 데이터

                        /*
                            { OrderID : 10248, CustomID : '', Customers : {}, ... }
                        */

                        oDetailModel.setProperty("/data", aaa.results[0])
                    }.bind(this),
                    error: function() {
                        oVeiw.setBusy(false);
                        sap.m.MessageToast.show('에러 발생');
                    }
                });

                // console.log("pattern matched function");
            }
        });
    });
