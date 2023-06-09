sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("sap.btp.ux400solvinge25.controller.Main", {
            // formatter: {
            // transformDiscontinued: function(value) {
            //     return value ? "Yes" : "No";
            // }
            // },
            onInit: function () {
                // var oData = {
                //     value : []
                // }

                // this.getView().setModel(new JSONModel(oData), "List");
                
                // this.setModel(new JSONModel(list));

                this.getView().setModel(new JSONModel({ datas : [] }), 'list');
            },
            onRandomPress: function() {
                let oControl = this.byId('idInput');
                let oModel = this.getView().getModel('list');
                let arr = oModel.getProperty("/datas"); // [{num : 4}, {}, {} ...]

                oControl.setValue(Math.floor(Math.random() * 100) + 1);

                arr.push({ num : oControl.getValue() });

                oModel.setProperty("/datas",arr);

                // var aValue = Number(Math.floor(Math.random() * 100 + 1));

                // Number(this.byId("Input").setValue(aValue));

                // // this.oModel = this.getView().getModel("List");
                
                // // this.oModel.push({
                // //     text : aValue
                // // });


                // var oModel = this.getView().getModel("List");
                // var aList = oModel.getProperty("/value");
                // aList.push({
                //     text : aValue
                // });
                // oModel.setProperty("/value", aList);

                // this.list.create("list",aValue,"Create Success!");
                // this.getView().setModel(new JSONModel(), "list");
            },
            onOpenDialog: function() {
                var oDialog = this.byId("idDialog");
                // let dialog = this.byId("Dialog");

                if (oDialog) {
                    oDialog.open();
                    return;
                }
                this.loadFragment({
                        name : "sap.btp.ux400solvinge25.view.fragment.Products"
                }).then(function (oDialog) {
                    oDialog.open();
                }, this);
            },
            onClose: function() {
                this.byId("idDialog").close();
            },
            transformDiscontinued: function(value) {
                // value => true 또는 false  계속 들어온다
                return value === true ? 'Yes' : 'No' ;
            },
            onValueChange: function() {
                let oControl = this.byId("idInput");
                let iNum = Number(oControl.getValue());
                let isOK = iNum >= 1 && iNum <= 100;  //true 또는 false

                oControl.setValueState(isOK ? 'None' : 'Error');
                oControl.setValueStateText(isOK ? '' : '1~100 사이의 숫자를 입력하세요.');
                this.byId("idButton").sestEnabled(isOK ? true : false);

                // var oInput = oEvent.getSource();
                // var iValue = parseInt(oInput.getValue());
                // if(iValue < 1 || iValue > 100 ) {
                //     oInput.setValueState('Error');
                //     oInput.setValueText('1 이상 100 이하의 숫자를 입력하세요.');
                // } else {
                //     oInput.setValueState('None');
                //     oInput.setValueText('');
                // }
            }
           
        });
    });
