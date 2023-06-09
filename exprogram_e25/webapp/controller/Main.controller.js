sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Filter) {
        "use strict";

        return Controller.extend("exprograme25.controller.Main", {
            onInit: function () {
                this.getView().setModel(new JSONModel({datas:[
                    {currency : 'USD'},
                    {currency : 'EUR'},
                    {currency : 'KRW'}
                ]}), 'currencyList');


                this.getView().setModel(new JSONModel(), "main");

                this._defaultSet();
                
            },
            _defaultSet: function() {
                // odata model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel();
                // json model 변수 세팅
                this.oMainModel = this.getView().getModel("main");
                // table 객체
                this.oTable = this.byId("idTable");
            },
            onSearch: function(oEvent) {
                let sSelectedKey = this.byId("searchCurrency").getSelectedKey();
                let sInputValue = this.byId("idInput").getValue();

                // let oFilter = new Filter({
                //     filters: [
                //         new Filter({ path: 'Carrname', operator: 'EQ', value1: sInputValue }),
                //         new Filter({ path: 'Currency', operator: 'EQ', value1: sSelectedKey }),
                //     ],
                //     and: true
                // });

                // this.byId("idTable").getBinding("items").filter([oFilter]);
                let oFilter;
                let oFilter2;
                let aFilter = [];

                if (sInputValue) {oFilter = new Filter({ path: 'Carrname', operator: 'Contains', value1: sInputValue });
                } else {oFilter = new Filter({ path: 'Carrname', operator: 'NE', value1: sInputValue })};
                    
                
                if (sSelectedKey)  {oFilter2 = new Filter({ path: 'Currcode', operator: 'EQ', value1: sSelectedKey });
                } else {oFilter2 = new Filter({ path: 'Currcode', operator: 'NE', value1: sSelectedKey });}
                

                    aFilter.push(oFilter);
                    aFilter.push(oFilter2);


                this.byId("idTable").getBinding("items").filter(aFilter);

                

                // if (sSelectedKey) oFilter = new Filter("Currency", "EQ", sSelectedKey); 
                // this.byId("idTable");
            },
            onDetail: function(oEvent) {

                var oTable = this.getView().byId("idTable");
                var oModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oModel, "main"); 

                var oItem = oEvent.getSource();
                var sPath = oItem.getBindingContext().getPath();
                var modelData = oTable.getModel();
                var data = modelData.getProperty(sPath);

          

            
                this.oModel.read(sPath, {

                    urlParameters: { $expand: "to_Item" },
                    success: function(oReturn) {
                        console.log("Result : ", oReturn);
                        oModel.setData(oReturn);
                        // this.oModel.setProperty("/", oReturn);
                        // this.getView().setModel(oModel, 'list');

                    }.bind(this)
                });
                
                /*
                var oSelectedData = oEvent
                    .getSource()
                    .getBindingContext()
                    .getObject({exapnd: "to_Item"});
                var aDetail = oSelectedData.to_Item;
                */

                // let oTable2 = this.byId('idTable2');
                // let oModel = this.getView().getModel('list');
                // let arr = oModel.getProperty("/Carrid"); 

                // oModel.setProperty("/datas");

                var oDialog = this.byId("Dialog");
                // this.oDialog.bindElement(oReturn);
                // oDialog.setModel(this.getView.getModel("list"));

                if (oDialog) {
                    oDialog.open();
                    return;
                }else{
                this.loadFragment({
                    name: "exprograme25.view.fragment.DetailDialog",
                    // controller : this
                }).then(function(oDialog) {
                    oDialog.open();
                }, this);
                }  

                // oEvent.getSource();
                
 
                          
            },
            onClose: function() {
                this.byId("Dialog").close();
            }  
        });
    });
