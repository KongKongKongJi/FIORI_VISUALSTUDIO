sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    'sap/ui/export/Spreadsheet',
    'sap/ui/export/library'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, Sorter, MessageBox, MessageToast, Fragment, Spreadsheet, library) {
        "use strict";
        var history = {
            prevApplySelect: null,
            prevDiffDeliverySelect: null
        };
        // var EdmType = exportLibrary.EdmType;
        var EdmType = sap.ui.export.EdmType;

        return Controller.extend("zcbcprojectinvcount.controller.Main", {
            onInit: function () {

                this._wizard = this.byId("InvCount");
                this.oRouter = this.getOwnerComponent().getRouter();

                this.model = new JSONModel();
                this.model.attachRequestCompleted(null, function () {
                    this.model.setProperty("/selectedApply", "Apply");
                    this.model.updateBindings();
                }.bind(this));

                this.getView().setModel(new JSONModel(), 'apply');
                // this.getView().setModel(new JSONModel(), 'silsa');
                this.getOwnerComponent().getModel().read("/INVCNTSet", {
                    success: function (oReturn) {
                        this.getView().getModel("apply").setProperty('/list', oReturn.results);

                        //         this.getView().getModel("silsa").setProperty('/list', oReturn.results); 
                        //         this.getView().byId('idSilsaCnt').setValue();
                        //         // invid로 sort 하고 view에서 같은 key로 바인딩..

                    }.bind(this)
                });

                this.model.setData(this.getOwnerComponent().getModel().read("/INVCNTSet"))
                this.model.loadData(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
                this.getView().setModel(this.model);

                let datas = {
                    list: [
                        { emp: 'SD00', empName: '총괄사업실', position: '대표', name: '김다영' },
                        { emp: 'SD00', empName: '총괄사업실 ', position: '센터장', name: '고상준' },
                        { emp: 'SD01', empName: '국내 영업팀', position: '팀장', name: '홍지희' }


                    ]
                };
                this.getView().setModel(new JSONModel(datas), "EMPModel");


                this.getView().setModel(new JSONModel({ list: [] }), 'Approval');

                var oSegmentedButton = this.byId("ApplyMethodSelection");
                    oSegmentedButton.setSelectedKey(null);


                // var applyModel = this.getView().getModel("apply");
                // var listData = applyModel.getProperty("/list");



                // this.getView().setModel(new JSONModel(), 'Approval');
                // this.getOwnerComponent().getModel().read("/INVCNTSet", {
                //     success: function(oReturn) {
                //         // var applyModel = this.getView().getModel("apply");
                //         // var applyCntQty = applyModel.getProperty("/list/[]/CntQty");
                //         // var applyCntQty = applyModel.getProperty("/CntQty");

                //         // console.log(applyModel);

                //         var aData = oReturn.results.map(function(item) {
                //         var adjustedQty = item.CntQty - item.InvQty;
                //             return {
                //               WhId: item.WhId,
                //               InvId: item.InvId,
                //               Batch: item.Batch,
                //               SkuName: item.SkuName,
                //               CntQty: item.CntQty,
                //               InvQty: item.InvQty,
                //               AdjustedQty: adjustedQty,
                //               Reason: ""
                //             };
                //           });

                //           this.getView().getModel("Approval").setProperty('/list', aData);
                //         }.bind(this)
                // });
            },
            onSearch: function (oEvent) {
                var oTableSearchState = [],
                    // var oTable = this.getView().byId("productsTable"),
                    sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    oTableSearchState = [new Filter("InvId", FilterOperator.Contains, sQuery)];
                }

                this.getView().byId("productsTable").getBinding("items").filter(oTableSearchState, "Application");
                // debugger;
            },
            onActive: function (oEvent) {
                var list = this.getView().getModel("Approval").getData().list;
                var sId = oEvent.getParameter('id') + '-nextButton';
                this.nextButton = sap.ui.getCore().byId(sId);
                this.nextButton.setEnabled(!!list.length);
            },
            goToApplyStep: function () {
                var selectedKey = this.model.getProperty("/selectedApply");

                switch (selectedKey) {
                    case "Inv":
                        var oModel = this.getView().getModel("Approval");
                        var aData = oModel.getProperty("/list");
                        if (!aData || aData.length > 0) {
                            MessageBox.error("조정해야 할 재고가 있습니다.", {
                                title: "오류",
                                actions: [MessageBox.Action.OK],
                                onClose: function () {
                                    // 선택 상태 초기화
                                    this._wizard.discardProgress(this._wizard.getSteps()[1]);
                                    this._navBackToList();
                                    this.model.setProperty("/selectedApply", null);
                                }.bind(this)
                            });
                        } else {

                            this.byId("InvApproval").setNextStep(this.getView().byId("InvStep"));
                        }
                        break;
                    case "Apply":
                        var oModel = this.getView().getModel("Approval");
                        var aData = oModel.getProperty("/list");

                        if (!aData || aData.length === 0) {
                            MessageBox.error("조정해야 할 재고가 없습니다.", {
                                title: "오류",
                                actions: [MessageBox.Action.OK],
                                onClose: function () {
                                    // 선택 상태 초기화
                                    this._wizard.discardProgress(this._wizard.getSteps()[1]);
                                    this._navBackToList();
                                    this.model.setProperty("/selectedApply", null);
                                }.bind(this)
                            });
                        } else {
                            this.byId("InvApproval").setNextStep(this.getView().byId("ApplyStep"));
                        }
                        break;
                }
            },
            setApplyMethod: function (oEvent) {
                var list = this.getView().getModel("Approval").getData().list,
                    sKey = oEvent.getParameters().item.getKey();
                this.nextButton.setEnabled(!(list.length === 0 && sKey === 'Apply')); // 데이터가 없고, Apply 일 때만 비활성화

                var oModel = this.getView().getModel("Approval");
                var aData = oModel.getProperty("/list");
                var oSegmentedButton = this.byId("ApplyMethodSelection");
                
                if (aData && aData.length > 0) {
                    oSegmentedButton.setSelectedKey("Apply");
                } else {
                    oSegmentedButton.setSelectedKey("Inv");
                }
                

                var oInvAppr = this.byId("InvApproval");
                this.setDiscardableProperty({
                    message: "변경하시겠습니까?",
                    discardStep: oInvAppr,
                    modelPath: "/selectedApply",
                    historyPath: "prevApplySelect"
                });
            },
            setDiscardableProperty: function (params) {
                if (this._wizard.getProgressStep() !== params.discardStep) {
                    MessageBox.warning(params.message, {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.YES) {
                                this._wizard.discardProgress(params.discardStep);
                                history[params.historyPath] = this.model.getProperty(params.modelPath);
                            } else {
                                this.model.setProperty(params.modelPath, history[params.historyPath]);
                            }
                        }.bind(this)
                    });
                } else {
                    history[params.historyPath] = this.model.getProperty(params.modelPath);
                }
            },
            handleChange: function (oEvent) {

                /*
                Approval 모델은 => { list : [] }

                StepINput 에서 수정했을 때 그 Row으 재고수량, 실사수량 값을 가져와서 계산 후

                list.push({키 : 계산값});
                
                */

                var sInputBaseId = oEvent.getParameters().id + '-input';
                sap.ui.getCore().byId(sInputBaseId).setShowValueStateMessage(false);

                var newValue = oEvent.getParameter("value");
                let oModel = this.getView().getModel("Approval"),
                    aApprovalList = oModel.getData().list;
                // let arr = [];
                // var oTable = this.getView().byId("productsTable");
                // var aItems = oTable.getItems();
                var sPath = oEvent.getSource().getParent().getBindingContextPath();
                var oApplyModel = this.getView().getModel("apply");
                var oData = oApplyModel.getProperty(sPath);

                if (oData) {
                    var updatedData = {
                        InvId: oData.InvId,
                        SkuName: oData.SkuName,
                        Batch: oData.Batch,
                        InvQty: oData.InvQty,
                        CntQty: newValue,
                        AdjustedQty: newValue - oData.InvQty,
                        Unit: oData.Unit,
                        Reason: ""
                    };

                    if (updatedData.AdjustedQty !== 0) {
                        var foundIndex = aApprovalList.findIndex(function(item) {
                            return item.InvId === updatedData.InvId;
                          });
                      
                          if (foundIndex > -1) {
                            aApprovalList[foundIndex] = updatedData;
                          } else {
                            aApprovalList.push(updatedData);
                          }

                        // aApprovalList.push(updatedData);
                        oModel.setProperty("/list", aApprovalList);
                        oModel.setProperty("/listLen", aApprovalList.length);
                        
                    } else {
                        var aList = oModel.getProperty("/list");
                        var foundIndex = aList.findIndex(function (item) {
                            return item === updatedData.InvId;
                        });

                        if (foundIndex >= -1) {
                            aList.splice(foundIndex, 1);
                            oModel.setProperty("/list", aList);
                        }
                    }
                    /////////////////////// 수정예정 /////////////////////////////////////////////
                    // oModel.setProperty(sPath, null); // 이거말고 index 가져와서 splice(인덱스, 1);
                    // oModel.setProperty(sPath, updatedData);
                };
            },
            createColumnConfig: function () {
                var aCols = [];

                aCols.push({
                    label: '창고번호',
                    type: EdmType.String,
                    property: "WhId",
                    scale: 0
                });

                aCols.push({
                    label: 'SKU',
                    property: 'InvId',
                    type: EdmType.String
                });

                aCols.push({
                    label: '배치',
                    property: 'Batch',
                    type: EdmType.String
                });

                aCols.push({
                    label: 'SKU명',
                    property: 'SkuName',
                    type: EdmType.String
                });

                aCols.push({
                    label: '재고수량',
                    property: 'CntQty',
                    type: EdmType.Number
                });

                aCols.push({
                    label: '단위',
                    property: "Unit",
                    type: EdmType.String
                });

                return aCols;
            },
            onExport: function () {
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = this.byId('exportTable');
                }

                oTable = this._oTable;
                // oRowBinding = oTable.getBinding('items');
                oRowBinding = this.getView().getModel('apply').getData().list;
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding, // dataSource를 oRowBinding으로 설정
                    fileName: '직영점 실사 최종 재고.xlsx',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },

            handleWizardCancel: function () {
                this._handleMessageBoxOpen("첫단계로 돌아가시겠습니까?", "warning");
            },
            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {

                            var oApprovalModel = this.getView().getModel("Approval");
                              oApprovalModel.setData({});

                              this.getView().setModel(new JSONModel({ list: [] }), 'Approval');

                           var oApplyModel = this.getView().getModel("apply");
                               oApplyModel.setData({});

                               this.getView().setModel(new JSONModel(), 'apply');
                               this.getOwnerComponent().getModel().read("/INVCNTSet", {
                                  success: function (oReturn) {
                                this.getView().getModel("apply").setProperty('/list', oReturn.results);
                                 }.bind(this)
                            });

                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                            this._navBackToList();
                            
                        }
                    }.bind(this)
                });
            },
            _navBackToList: function () {
                this._navBackToStep(this.byId("ContentsStep"));
            },
            // setDiscardableProperty: function (params) {
            //     if (this._wizard.getProgressStep() !== params.discardStep) {
            //         MessageBox.warning(params.message, {
            //             actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            //             onClose: function (oAction) {
            //                 if (oAction === MessageBox.Action.YES) {
            //                     this._wizard.discardProgress(params.discardStep);
            //                     history[params.historyPath] = this.model.getProperty(params.modelPath);
            //                 } else {
            //                     this.model.setProperty(params.modelPath, history[params.historyPath]);
            //                 }
            //             }.bind(this)
            //         });
            //     } else {
            //         history[params.historyPath] = this.model.getProperty(params.modelPath);
            //     }
            // },
            handleMessage: function (oEvent) {
                var that = this;
                var oModel = this.getView().getModel("Approval");
                var aList = oModel.getProperty("/list");
                var noReason = aList.some(function (item) {
                    if (!item.Reason) return true;
                    else return false;
                });

                var sValue = this.getView().getModel("Approval").getBindings("/Reason");


                if (noReason) {
                    this._handleReasonBoxOpen("사유가 입력되어 있지 않습니다.", "error");
                    
                } else {
                    sap.m.MessageBox.confirm("정말로 상신하시겠습니까?", {
                        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                        onClose: function (oAction) {

                        if (oAction === sap.m.MessageBox.Action.OK) {
                            var oModel = this.getView().getModel("Approval");
                            var aApprovalList = oModel.getProperty("/list");
                            var oDataModel = this.getOwnerComponent().getModel(); // 데이터 모델
                      
                            var oPromise = Promise.resolve(); // 첫 번째 체인지셋을 위한 초기 Promise
                      
                            aApprovalList.forEach(function(item) {
                              oPromise = oPromise.then(function() {
                                item.WhId = "0000002500";
                                var sPath = oDataModel.createKey('/INVCNTSet', {
                                  WhId: "0000002500",
                                  InvId: item.InvId,
                                  Batch: item.Batch
                                });
                      
                                return new Promise(function(resolve, reject) {
                                  oDataModel.update(sPath, item, {
                                    success: function() {
                                      resolve(); // 성공 시 Promise를 resolve 처리
                                    },
                                    error: function() {
                                      reject(); // 실패 시 Promise를 reject 처리
                                    }
                                  });
                                });
                              });
                            });
                      
                            oPromise
                              .then(function() {
                                sap.m.MessageToast.show("모든 작업이 성공적으로 완료되었습니다.");
                              })
                              .catch(function() {
                                sap.m.MessageToast.show("일부 작업이 실패하였습니다.");
                              });
                          }
                        }.bind(this)
                    });
                }


                // return true;

            },
            _handleReasonBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._wizard.discardProgress(this._wizard.getSteps()[3]);
                            this.getView().getModel("Approval").setProperty("/editMode", true);
                            this._navBackToList();
                        } else {
                            this._wizard.discardProgress(this._wizard.getSteps()[3]);
                            this._navBackToList();
                            this.getView().getModel("Approval").setProperty("/editMode", true);
                        }
                    }.bind(this)
                });
            },
            checkInvStep: function () {
                // var sReason = this.getView().getModel("Approval").getProperty("/Reason");
                this.getView().getModel("apply").setProperty("/editMode", false);
                
                // this.getView().handleMessage("apply").setProperty("/editMode", false);
            },
            checkApplyStep: function () {
                var sReason = this.getView().getModel("Approval").getProperty("/Reason");
                
                this.getView().getModel("apply").setProperty("/editMode", false);
                if (sReason && sReason.length >= 5) {
                    this._wizard.invalidateStep(this.byId("ApplyStep"));
                } else {
                    this._wizard.validateStep(this.byId("ApplyStep"));
                }
            },
            checkInputStep: function () {
                this.getView().getModel("Approval").setProperty("/editMode", false);

            },

            completedHandler: function() {
                window.history.go(-1);
            }
        });
    });
