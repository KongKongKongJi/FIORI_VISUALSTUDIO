sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
    // "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("zprojectodatae2502.controller.Main", {
            onInit: function () {
                let datas = {
                    title : {
                        subTitle : 'Json Title'  
                },
                list : [
                    {num1 : 33, oper : '+', num2 : 10, result : 43}
                    // {name : 'hong', age : 21},
                    // {name : 'kim', age : 22},
                    // {name : 'park', age : 23},
                    // {name : 'song', age : 24}
                    ]
                };

                this.getView().setModel(new JSONModel(datas), "MainModel");
            },

            

            onButtonPress: function(oEvent){
                var oModel = this.getView().getModel("MainModel"),
                    aList = oModel.getData().list; //[{}, {}, {}, ...... ]

                let oSelect = this.byId("idSelect").getSelectedItem(),
                    inum1 = Number(this.byId("idInput1").getValue()),
                    inum2 = Number(this.byId("idInput2").getValue()),
                    result = 0 ;
                let sMsg = '';

                switch (oSelect.mProperties.key) {
                    case "plus":
                        result = Number(inum1) + Number(inum2);
                        break;
                    case "minus":
                        result = Number(inum1) - Number(inum2);
                        
                        break;
                    case "multiply":
                        result = Number(inum1) * Number(inum2);
                        
                        break;
                    case "divide":
                        result = Number(inum1) / Number(inum2);
                        
                        break;
                    default:
                        break;
                }

                sMsg = `${inum1} ${oSelect.getText()} ${inum2} = ${result}`;

                // aList.push({
                //     num1: inum1,
                //     oper: oSelect.getText(),
                //     num2: inum2,
                //     result: result
                // });

                oModel.setProperty("/list", aList);
                
                MessageBox.show( sMsg, {
                        icon: MessageBox.Icon.INFORMATION,
                        title: "My message box title",
                        actions: [MessageBox.Action.YES,'NO'],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) {
                            if(oAction === 'YES') {
                                aList.push({
                                    num1: inum1,
                                    oper: oSelect.getText(),
                                    num2 : inum2,
                                    result:result
                                });
                                oModel.setProperty("/list", aList);
                            }
                         }
                    }
                );

                // MessageBox.success(sMsg, {
                //     title: "Success",                                    // default
                //     onClose: null,                                       // default
                //     styleClass: "",                                      // default
                //     actions: sap.m.MessageBox.Action.OK,                 // default
                //     emphasizedAction: sap.m.MessageBox.Action.OK,        // default
                //     initialFocus: null,                                  // default
                //     textDirection: sap.ui.core.TextDirection.Inherit     // default
                // });
             }
            //  onAdd:function() {
            //     let add = this.byId("addDialog");
            //     if (add) {
            //         add.open();
            //         return;
            //     }
            //     this.loadFragment({
            //             name : "zprojectteste130402.view.fragment.addDialog"
            //     }).then(function (add) {
            //         add.open();
            //     }, this);
            // },
            // onClose:function(oEvent){
            //     var oDialog = this.byID("addDialog");
            //     var oModel = this.getView().getModel("MainModel");
            //     var aTodos = oModel.getProperty("/todo");

            //     var sValue = this.getView().getModel("root").getProperty("/value");
            //     if(sValue){
            //         aTodos.unshift({content : sValue});
            //         oModel.setProperty("/todo", aTodos);
            //     }
            //     oDialog.onClose();
            // },
            // onBeforeOpen: function(){
            //     this.byId("addInput").setValue();
            // }
            
        });
    });
