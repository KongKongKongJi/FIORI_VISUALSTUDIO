sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("zprojectodatae2505.controller.Main", {
            onInit: function () {
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
            onCreate: function() {
                let oData = this.oMainModel.getData();

                oData.Productno = Number(oData.Productno);

                this.oModel.create("/Products", oData, {
                    success: function() {
                        sap.m.MessageToast.show("Create Success!");
                    },
                    error: function() {
                        sap.m.MessageToast.show("Error Success!");
                    }
                });
            },
            onUpdate: function() {
                let jsonData = this.oMainModel.getProperty("/");
                let sFullPath = this.oModel.createKey("/Products", {
                    Productno : jsonData.Productno
                }); // sFullPath ==> "/Products(Productno=111, ab=123)"

                // "/Products(Productno="+변수+", ab="+변수+")""
                jsonData.Productno = Number(jsonData.Productno);

                this.oModel.update(sFullPath, jsonData, {
                    success: function() {
                        sap.m.MessageToast.show("변경되었습니다.");
                    }
                });
            },
            onDelete: function() {
                // "/Products(2)"
                let index = this.oMainModel.getProperty("/Productno");
                let sFullPath = this.oModel.createKey("/Products", {
                    Productno : Number(index)
                }); // "/Products(2)" 과 동일함
                this.oModel.remove(sFullPath, {
                    success: function() {
                        sap.m.MessageToast.show("삭제되었습니다.");
                    }
                });
            },
            onReadEntity: function() {
                let index = this.oTable.getSelectedIndex();
                let sPath = this.oTable.getContextByIndex(index).getPath();

                // let sFullPath = this.oModel.createKey("/Products", {
                    // Productno : 2
                // }); // "/Products(2)" 과 동일함

                this.oModel.read(sPath, {
                    // filters: [필터모델객체],
                    success: function(oReturn) {
                        console.log("READ : ", oReturn);
                        /* oReturn => {
                            Productno : 1,
                            Productname : '',
                            Fname : '',
                            Lname : '',
                            Memo : ''
                        }*/
                        this.oMainModel.setProperty("/", oReturn);
                        // this.oMainModel.setData(oReturn);
                    }.bind(this)
                });
            },
            onRefresh: function() {
                this.oModel.refresh(true);
            }
        });
    });
