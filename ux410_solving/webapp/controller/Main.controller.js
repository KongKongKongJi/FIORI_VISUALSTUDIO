sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/controls/VizFrame"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Filter,JSONModel,VizFrame) {
        "use strict";

        return Controller.extend("sap.btp.ux410solving.controller.Main", {
            onInit: function () {

                // let data = { datas : [
                     //    {Type : 'bar'},
                    //     {Type : 'column'},
                    //     {Type : 'line'},
                    //     {Type : 'donut'}
                // ]};

                this.getView().setModel(new JSONModel({datas:[
                    {type : 'bar'},
                    {type : 'column'},
                    {type : 'line'},
                    {type : 'donut'}
                ]}), 'typeList');
                // this._setChartInView();
                // this._setChartInController();
            },
            onSearch: function(oEvent) {

                // const oFilterItems = oEvent.getParameter("selectionSet"),
                      // oComboBox = oFilterItems[0],
                     // sSelectedKey = oComboBox.getSelectedKey()

                let oFlattenedDataset = this.byId("dataSet");
                let sSelectedKey = this.byId("searchOrderID").getSelectedKey();  // order id
                let sSelectedType = this.byId("searchType").getSelectedKey(); //type
                let oFilter;

                if (!sSelectedType) { // type 값이 없으면 에러처리 후 return
                    this.byId("searchType").setValueState('Error');
                    return;  // 아래 함수 무시함
                };

                // type 값이 있으면 'None'으로 변경하고 이어서 진dataSet행
                this.byId("searchType").setValueState('None');
                if (sSelectedKey) oFilter = new Filter("OrderID", "EQ", sSelectedKey);
                // new Filter("Date", "BT", 오늘, 내일);

                    oFlattenedDataset.getBinding("data").filter(oFilter); // [필터객체1, 필터객체2]
                    this.byId("idVizFrame").setVizType(sSelectedType);
                

            // let oOrderID = this.byId("idComboBox").getSelectedKey();
                
            //     let oFilter = new Filter({
            //         filters: [
            //             new Filter({ path: 'OrderID', operator: 'EQ', value1: oOrderID }),
            //         ],
            //         and: true
            //     });

            //     this.byId("idViewChart").getDataset().getBinding("data").filter([oFilter]);

                // var sVizTp = this.byId("searchType").getSelectedKey();              
                // this.byId("searchType").setValueState('None');

                // var iVizFrame = this.byId("idVizFrame");
                // iVizFrame.getDataset().getBinding("data").filter(oFilter); 

                // /* Type 별 차트 출력 */
                // this.byId("idVizFrame").setVizType(sVizTp);
            },
            onChartSelectData: function (oEvent) {
                
                const oComponent = this.getOwnerComponent(),
                    oRouter = oComponent.getRouter(),
                    // debugger 해서 oEvent.getParameter 확인. 선택한 데이터 정보 얻기
                    oData = oEvent.getParameter("data")[0].data,
                    oVizFrame = this.byId("idVizFrame");

                // 차트 선택된거 초기화
                oVizFrame.vizSelection(oData, { clearSelection: true });

                oRouter.navTo("RouteDetail", { // Detail로 이동
                    OrderID: oData.OrderID,
                    ProductID: oData.ProductID,
                });
            }
        });
    });
