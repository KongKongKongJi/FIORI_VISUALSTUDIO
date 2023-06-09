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

        return Controller.extend("zprojectteste2504.controller.Main", {
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
                    ],

                todo : [
                    {content : 'test'}
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
            },
            onDisplay: function() {
                var oModel = this.getView().getModel("MainModel");
                // var oData = oModel.getData(); // 전체 데이터를 다 가져옴
                // console.log('변경 후:', oData.list[4].age);

                var oData = oModel.getProperty("/title/subTitle");
                console.log('변경 후:', oData);
            },
            onAdd:function() {
                let add = this.byId("addDialog");
                if (add) {
                    add.open();
                    return;
                }
                this.loadFragment({
                        name : "zprojectteste2504.view.fragment.addDialog"
                }).then(function (add) {
                    add.open();
                }, this);
            },
            onClose: function (oEvent) {
                let add2 =  oEvent.getSource().getParent();
                // let value = add2.getContent()[0].getItems()[1].getValue();
                let value = this.getView().getModel("root").getProperty("/value");
                let aTodo = this.getView().getModel("MainModel").getData().todo;

                if(value){aTodo.unshift({
                    content:value

                })
                this.getView().getModel("MainModel").setProperty("/todo", aTodo);}



                console.log(value);
                add2.close();
            },
            onBeforeOpen: function () {
                this.byId("addInput").setValue();
            },
            onDelete: function(){
                var oTable = this.byId("todoTable");
                var oModel = this.getView().getModel("MainModel");
                var aSelectedIndices = oTable.getSelectedIndices();
                var aDatas = oModel.getProperty("/todo");


                // aDatas.splice(aSelectedIndices[0],1);


                MessageBox.confirm( '정말 삭제하겠습니까?', {
                    title: "Delete",
                    actions: ['YES','NO'],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if(oAction === 'YES') {
                            for(var i=aSelectedIndices.length-1; i>=0; i--){
                                aDatas.splice(aSelectedIndices[i],1);
                            }
                            oModel.setProperty("/todo", aDatas);
                        }
                     }
                }
              ); 
               
                // for(var i=aSelectedIndices.length-1; i>=0; i--){
                //     aDatas.splice(aSelectedIndices[i],1);
                //     oModel.setProperty("/todo", aDatas);
                // }

                 
                    
                // });

                
            },
            onRowDelete: function(oEvent){
                var idSelectIndex = oEvent.getParameters().row.getIndex();
                var oModel = this.getView().getModel("MainModel");
                var aDatas = oModel.getProperty("/todo");

                aDatas.splice(idSelectIndex,1);

                oModel.setProperty("/todo",aDatas);
            }
        });
    });
