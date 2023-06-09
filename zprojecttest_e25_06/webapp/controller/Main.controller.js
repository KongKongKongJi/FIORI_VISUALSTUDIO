sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("zprojectteste2506.controller.Main", {
            onInit: function () {
                let datas = {
                    title: {
                       // title: 'Json Title',
                        subTitle: 'Json Title'
                    },

                    list: [
                        {num1:33, oper: '+', num2:10, result:43}
                    ],
                    todo : [
                        {content : 'test'}
                    ]
                };
                this.getView().setModel(new JSONModel(datas), "MainModel")
                // var oModel = new JSONModel();
                // oModel.loadData( sap.ui.require.toUrl("zprojectteste0204/model/data.json") ); //webapp은 따로 안써줘도된다.
                // this.getView().setModel(oModel, 'MainModel');
                //   모델객체생성,   모델이름 설정

                

            
            },
            onAdd: function () {

                var oDialog = this.byId("Dialog");
                if (oDialog) {
                    oDialog.open();
                    return;
                }else{
                this.loadFragment({
                    name: "zprojectteste2506.view.fragment.Dialog"
                }).then(function(oDialog) {
                    oDialog.open();
                }, this); // this는 현재컨트롤러를 바라보게
                }
            },
            onClose: function(oEvent) {
                var oDialog = oEvent.getSource().getParent(); //위의 var oDialog = this.byId("Dialog");와 같은 내용
                // var sValue = oDialog.getContent()[0].getItems()[1].getValue();
    
                // console.log(sValue);
                var sValue = this.getView().getModel("root").getProperty("/value");
                // var aList = sValue.getData().list;
                // console.log(sValue);
                var oModel = this.getView().getModel("MainModel");
                var aTodos = oModel.getProperty("/todo");
    
                aTodos.unshift({ content : sValue });
    
                oModel.setProperty("/todo", aTodos);
                oDialog.close();
            },
             onBeforeOpen: function(){
                    this.byId("addInput").setValue();
            },
             onDelete: function() {
                    var oTable = this.getView().byId("todoTable");
                    var oModel = this.getView().getModel("MainModel");
                    var aSelectedIndices = oTable.getSelectedIndices();
                    var aDatas = oModel.getProperty("/todo");
    
               
                    MessageBox.confirm('정말 삭제하시겠습니까?', {
                        icon: MessageBox.Icon.INFORMATION, //icon은 타이틀에 있는 icon (느낌표표시)
                        title: "Delete", //맨 위 상단 문자
                        actions: ['YES', 'NO'], //Yes랑 No눌렀을때 나오는 함수 정의
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) { 
                            if(oAction === 'YES') {
                               
                                for (var i= aSelectedIndices.length- 1; i >= 0; i--) { //index 거꾸로 반복문 돌기 주의
                        
                                    aDatas.splice(aSelectedIndices[i], 1);
                                    
                                }
                                oModel.setProperty("/todo", aDatas);
                            }
                        }
                });
    
                 },
             onRowDelete: function(oEvent) {
                    
                    var iSelectedIndex = oEvent.getParameters().row.getIndex();
                    var oModel = this.getView().getModel("MainModel");
                    var aDatas = oModel.getProperty("/todo");
                    // 단 건 삭제 로직 작성
    
                    aDatas.splice(iSelectedIndex, 1);
                          oModel.setProperty("/todo", aDatas);
            }
    
        });
    });
