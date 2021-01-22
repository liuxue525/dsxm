<template>
   <div>
     <h1>商品维护</h1>



         <el-input v-model="query.name" placeholder="品牌名称" ></el-input>
         <el-button type="primary" icon="el-icon-search" @click="queryShangPinData">查询</el-button>



     <el-table
       :data="ShangPinTableData"
       border
       class="table"
       header-cell-class-name="table-header"
     >
       <el-table-column type="selection" width="55" align="center"></el-table-column>
       <el-table-column prop="id" label="编号" width="55" align="center"></el-table-column>

       <el-table-column prop="name" label="商品名称"></el-table-column>
       <el-table-column prop="productdecs" label="商品描述"></el-table-column>
       <el-table-column prop="bandId" label="商品品牌" :formatter="formatBand"></el-table-column>
       <el-table-column prop="stocks" label="商品库存"></el-table-column>
       <el-table-column prop="price" label="商品价格"></el-table-column>
       <el-table-column prop="sortNum" label="商品排序"></el-table-column>
       <el-table-column label="商品图片" align="center">
         <template slot-scope="scope">
           <img width="50px" :src="scope.row.imgPath"/>
         </template>
       </el-table-column>



       <el-table-column label="操作" width="180" align="center">
         <template slot-scope="scope">
           <el-button
             type="text"
             icon="el-icon-edit"
             @click="updateSPU( scope.row)"
           >修改商品规格
           </el-button>
           <el-button
             type="text"
             icon="el-icon-edit"
             @click="updateSKU( scope.row.typeId,scope.row.id)"
           >修改商品参数
           </el-button>
         </template>
       </el-table-column>
     </el-table>
     <!--分页-->
     <el-pagination
       background
       layout="total, sizes, prev, pager, next, jumper"
       :current-page="query.page"
       :page-size="query.size"
       :page-sizes="pageSizes"
       :total="pageTotal"
       @current-change="handlePageChange"
       @size-change="handleSizeChange">
     </el-pagination>

     <!--回显商品的基本信息-->
     <el-dialog title="修改商品规格"  width="40%" :visible.sync="dialogUpdateSPU">

       <el-form ref="form"  :model="form" label-width="180px" >
         <el-input type="hidden" v-model="form.id" ></el-input>
         <el-form-item label="商品名称" prop="name" >
           <el-input v-model="form.name" ></el-input>
         </el-form-item>

         <el-form-item label="商品标题" prop="title">
           <el-input v-model="form.title"></el-input>
         </el-form-item>

         <el-form-item label="品牌" prop="bandId">
           <el-select v-model="form.bandId">
             <el-option
               v-for="item in BandDatas"
               :key="item.id"
               :label="item.name"
               :value="item.id"
             ></el-option>
           </el-select>
         </el-form-item>

         <el-form-item label="简介" prop="productdecs">
           <el-input type="textarea" v-model="form.productdecs"></el-input>
         </el-form-item>


         <el-form-item label="价格" prop="price">

           <el-input-number v-model="form.price" :min="0" :precision="2" :step="0.1"></el-input-number>
         </el-form-item>

         <el-form-item label="库存" >

           <template>
             <el-input-number v-model="form.stocks" :min="0" :step="10"></el-input-number>
           </template>
         </el-form-item>

         <el-form-item label="排序" >

           <template>
             <el-input-number v-model="form.sortNum" :min="0" :step="1"></el-input-number>
           </template>
         </el-form-item>

         <!-- 图片插件  -->

         <el-form-item label="主图" prop="imgPath">
           <img width="50px" :src="form.imgPath"/>
           <el-upload
             class="avatar-uploader"
             action="http://localhost:8080/api/pinpai/upload"
             :show-file-list="false"
             :on-success="handleAvatarSuccess"
             :before-upload="beforeAvatarUpload">
             <img v-if="imageUrl" :src="imageUrl" class="avatar">
             <i v-else class="el-icon-plus avatar-uploader-icon"></i>
           </el-upload>
         </el-form-item>

         <el-button style="margin-left: 250px" type="warning" @click="dialogUpdateSPU=false">取消</el-button>
         <el-button  type="danger" @click="updateSPUData">确定修改</el-button>
       </el-form>

     </el-dialog>

     <!--回显商品的SKU SPU-->
     <el-dialog title="修改商品规格"  width="40%" :visible.sync="dialogUpdateSkU">
       <el-form :model="ShuxingForm" label-width="180px">

         <el-form-item label="属性类型" >

           <el-select v-model="ShuxingForm.typeId" @change="getShuxing">
             <el-option v-for="item in ShuxingData" :key="item.id" :label="item.name" :value="item.id"></el-option>
           </el-select>

         </el-form-item>

         <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
         <el-form-item v-if="SKUData.length>0" label="商品规格" prop="name">

           <el-form-item v-for="a in SKUData" :key="a.id" :label="a.nameChina" >

             <el-input v-if="a.type==3"></el-input>

             <el-select v-if="a.type==0">
               <el-option v-for="b in a.value" :key="b.id" :label="b.nameCH" :value="b.id"></el-option>
             </el-select>

             <!--v-model="a.checkStatus"    给数据绑定一个状态 选中的话checkStatus = true
               根据选中状态进行笛卡尔迪
             -->
             <el-checkbox-group v-model="a.checkStatus" v-if="a.type==2" @change="SKUChange">
               <el-checkbox v-for="b in a.value" :key="b.id" :label="b.nameCH"></el-checkbox>
             </el-checkbox-group>


           </el-form-item>

         </el-form-item>

         <el-table v-if="tableShow" :data="tableSkuData" style="width: 100%">

           <el-table-column  v-for="c in cols" :key="c.id" :label="c.nameChina" :prop="c.name">

           </el-table-column>

           <el-table-column
             label="库存"
             width="180">

             <template slot-scope="scope">
               <el-input v-model="scope.row.kuCun"/>
             </template>

           </el-table-column>
           <el-table-column
             label="价格"
             width="180">
             <template slot-scope="scope">
               <el-input v-model="scope.row.price"/>    <!--绑定当前行的数据-->
             </template>
           </el-table-column>
         </el-table>




         <el-form-item v-if="SPUData.length>0" label="商品参数" prop="name">
           <el-form-item v-for="a in SPUData" :key="a.id" :label="a.nameChina" >

             <el-input v-if="a.type==3" v-model="a.checkStatus"></el-input>

             <el-select v-if="a.type==0" v-model="a.checkStatus">
               <el-option v-for="b in a.value" :key="b.id" :label="b.nameCH" :value="b.id"></el-option>
             </el-select>

             <el-checkbox-group v-if="a.type==2"  v-model="a.checkStatus">
               <el-checkbox v-for="b in a.value" :key="b.id" :label="b.nameCH" :value="b.id"></el-checkbox>
             </el-checkbox-group>


             <el-radio-group v-if="a.type==1" v-model="a.checkStatus">
               <el-radio v-for="b in a.value" :key="b.id" :label="b.nameCH" ></el-radio>
             </el-radio-group>

           </el-form-item>
         </el-form-item>

       </el-form>
     </el-dialog>

   </div>

</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
    export default {
        name: "ShangPin",
        data(){
          return{
            ShangPinTableData:[],
            query:{     //分页 查询
                name:"",
                page:1,
                size:4
            },
            pageTotal:0,
            pageSizes:[3,6,9],
            BandDatas:[],
            /*修改商品规格*/
            dialogUpdateSPU:false,
            form:{
              id:"",
              name:"",
              title:"",
              bandId:"",
              productdecs:"",
              price:0,
              stocks:0,
              sortNum:0,
              imgPath:""
            },
            imageUrl:"",
            /*修改商品参数*/
            array:[],   //属性的下拉框
            ShuxingData:[],  //展示的下拉框
            ShuxingStr:"",
            dialogUpdateSkU:false,
            ShuxingForm:{
              typeId:""
            },
            SKUData:[],  //影响价格
            SPUData:[],    //不影响价格
            tableShow:false,
            tableSkuData:[],
            cols:[],
          }
        },
        methods: {
          //回显sku spu
          updateSKU: function (typeId,id) {
            this.dialogUpdateSkU = true;

            this.ShuxingForm.typeId= typeId;
            this.getShuxing(typeId,id)
            this.SKUChange()
          },

          //回显基本参数
          updateSPU: function (row) {
            //alert(row.id)
            this.dialogUpdateSPU = true;
            axios.get("http://localhost:8080/api/shangpin/selectShangPinById?id=" + row.id).then(res => {
              this.form = res.data.data;
            })
          },
          //修改基本参数
          updateSPUData: function () {
            axios.post("http://localhost:8080/api/shangpin/update", qs.stringify(this.form)).then(res => {

              this.$message.success("修改成功")
              this.dialogUpdateSPU = false;
              this.queryShangPinData();
            })
          },
          //查询商品的属性
          queryShangPinData: function () {
            axios.post("http://localhost:8080/api/shangpin/selectShangPin", qs.stringify(this.query)).then(res => {
              this.ShangPinTableData = res.data.data.list;
              this.pageTotal = res.data.data.count;
            }).catch(err => {

            })
          },
          SKUChange:function(){

            this.tableSkuData = [];
            this.cols=[];
            console.log(this.SKUData);
            let dikaParams = [];   //笛卡尔迪的参数

            let DkedStatus = true;   //笛卡尔迪的触发状态 默认是触发的
            for (let i = 0; i <this.SKUData.length ; i++) {


              debugger;
              //把值放在表头中
              this.cols.push({"id":this.SKUData[i].id,"nameChina":this.SKUData[i].nameChina,"name":this.SKUData[i].name});
              //将选中的复选框添加到笛卡尔迪的参数中
              dikaParams.push(this.SKUData[i].checkStatus)

              if (this.SKUData[i].checkStatus.length==0){


                DkedStatus = false;
                break;
              }
            }
            if (DkedStatus==true){

              let array = this.calcDescartes(dikaParams)
              for (let i = 0; i <array.length ; i++) {
                //["黄色","XL"]
                let valuesAttr=array[i];
                let  jsonData={};
                if(typeof valuesAttr =="object"){
                  for (let j = 0; j <array[i].length ; j++) {
                    //遍历笛卡尔积 的每一项   [红色,16g]  cols:[{"id":1,"name":color ,"nameChina":颜色}]
                    let key = this.cols[j].name;
                    jsonData[key] = array[i][j];
                    debugger
                  }
                }else{

                  let key = this.cols[0].name;
                  jsonData[key] = valuesAttr;
                }

                this.tableSkuData.push(jsonData);
                debugger;
              }

            }
            this.tableShow = DkedStatus;

          },//笛卡儿积
          calcDescartes:function(array) {
            if (array.length < 2) return array[0] || [];
            return [].reduce.call(array, function (col, set) {
              var res = [];
              col.forEach(function (c) {
                set.forEach(function (s) {
                  var t = [].concat(Array.isArray(c) ? c : [c]);
                  t.push(s);
                  res.push(t);
                })
              });
              return res;
            });
          },
          getShuxing:function(typeId,id){
            //alert(id)
            axios.get("http://localhost:8080/api/shangpin/queryDataByProId?proId="+id).then(res=>{

                let ShuXingZhiDatas = res.data.data;

              this.SKUData=[];
              this.SPUData=[];
              //alert(typeId)
              axios.get("http://localhost:8080/api/shuxing/selectShuxingBytypeId?typeId="+typeId).then(res=>{


                let shuxingDatas = res.data.data;

                if (shuxingDatas.length>0) {

                  for (let i = 0; i <shuxingDatas.length ; i++) {

                    if(shuxingDatas[i].isSKU==0){  //判断是否SKU属性

                      if (shuxingDatas[i].type!=3){
                        debugger;

                          if(shuxingDatas[i].type==2){
                            if(this.getValue(shuxingDatas[i].name,ShuXingZhiDatas)==""){
                              shuxingDatas[i].checkStatus == [];
                            }else {
                              shuxingDatas[i].checkStatus = this.getValue(shuxingDatas[i].name,ShuXingZhiDatas)
                            }
                          }else{
                            shuxingDatas[i].checkStatus=this.getValeu(shuxingDatas[i].name,ShuXingZhiDatas);
                          }



                        axios.get("http://localhost:8080/api/sxvalue/getData?attId="+shuxingDatas[i].id).then(res=>{
                          debugger;
                          console.log(res);
                          //属性对应的属性值的数据
                          shuxingDatas[i].value = res.data.data;
                          //绑定一个选中状态 用来出表格效果
                          //shuxingDatas[i].checkStatus = [];


                          this.SKUData.push(shuxingDatas[i])
                          debugger;
                        })
                      }else {
                        //shuxingDatas[i].checkStatus=this.getValeu(shuxingDatas[i].name,ShuXingZhiDatas);
                        shuxingDatas[i].checkStatus=[]
                        this.SKUData.push(shuxingDatas[i])
                      }




                    }
                    else{

                      if (shuxingDatas[i].type!=3){

                        if(shuxingDatas[i].type==2){
                          if(this.getValue(shuxingDatas[i].name,ShuXingZhiDatas)==""){
                            shuxingDatas[i].checkStatus == [];
                          }else {
                            shuxingDatas[i].checkStatus = this.getValue(shuxingDatas[i].name,ShuXingZhiDatas)
                          }
                        }else{
                          shuxingDatas[i].checkStatus = this.getValue(shuxingDatas[i].name,ShuXingZhiDatas)
                        }

                        //shuxingDatas[i].checkStatus = []

                        axios.get("http://localhost:8080/api/sxvalue/getData?attId="+shuxingDatas[i].id).then(res=>{
                          shuxingDatas[i].value = res.data.data;

                          this.SPUData.push(shuxingDatas[i])
                        })

                      }else {
                        shuxingDatas[i].checkStatus = this.getValue(shuxingDatas[i].name,ShuXingZhiDatas)
                        this.SPUData.push(shuxingDatas[i])
                      }


                    }
                  }
                }else{
                  this.SKUData=[];
                  this.SPUData=[];
                }

              })
            })

            console.log(this.SPUData)
          },
          //处理数据
          getValue:function(key,data){

            let  arrValue=[];
            for (let i = 0; i <data.length ; i++) {
              let  objData=JSON.parse(data[i].attrData);
                  if(objData[key]!=null){
                    debugger;
                      if(data[i].price!=null){
                        //去重复数据
                          if(arrValue.indexOf(objData[key])==-1){
                            arrValue.push(objData[key]);
                          }
                      }else{
                        return objData[key];
                      }
                  }
            }
              return arrValue;
          },
          handlePageChange: function (page) {
            this.query.page = page;
            this.queryShangPinData();
          },
          handleSizeChange: function (size) {
            this.query.size = size;
            this.queryShangPinData();
          },
          formatBand: function (row, column, value, index) {

            for (let i = 0; i < this.BandDatas.length; i++) {
              if (value == this.BandDatas[i].id) {
                return this.BandDatas[i].name;
              }
            }
          },
          selectBandData: function () {
            axios.get("http://localhost:8080/api/pinpai/selectPinpaiName").then(res => {
              this.BandDatas = res.data.data;

            })
          },
          handleAvatarSuccess(res, file) {
            debugger;
            //打断点 看怎么取返回值
            this.form.imgPath = res.data;
            //显示赋值
            this.imageUrl = res.data;
          },
          beforeAvatarUpload(file) {
            //限制类型    name  来限制
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 4;

            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
          },
          selectTypeName: function () {
            axios.get("http://localhost:8080/api/shuxing/selectTypeName").then(res => {

              this.array = res.data.data;

              this.getChildrenType();

              //循环子节点信息
              for (let i = 0; i < this.ShuxingData.length; i++) {
                this.ShuxingStr = "";
                this.chandleName(this.ShuxingData[i]);

                this.ShuxingData[i].name = this.ShuxingStr.split("/").reverse().join("/").substr(0, this.ShuxingStr.split("/").reverse().join("/").length - 1)
                console.log(this.ShuxingData)
              }
            }).catch(err => {

            })
          },
          chandleName: function (node) {

            if (node.pid != 0) {
              this.ShuxingStr += "/" + node.name;
              for (let i = 0; i < this.array.length; i++) {
                if (node.pid == this.array[i].id) {
                  this.chandleName(this.array[i]);
                  break;
                }
              }
            } else {
              this.ShuxingStr += "/" + node.name;
            }
          },
          getChildrenType: function () {

            for (let i = 0; i < this.array.length; i++) {
              let node = this.array[i];
              this.isChildrenNode(node);
            }
          },
          //判断是不是子节点
          isChildrenNode: function (node) {
            let rs = true;
            for (let i = 0; i < this.array.length; i++) {
              if (node.id == this.array[i].pid) {
                rs = false;
                break;
              }
            }
            if (rs == true) {
              this.ShuxingData.push(node)
            }
          }
        },
        created:function () {
              this.queryShangPinData();
              this.selectBandData();
              this.selectTypeName();
        },
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
