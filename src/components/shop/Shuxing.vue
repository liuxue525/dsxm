<template>
    <div>
      <h1>属性列表</h1>
     <el-button
        type="primary"
        icon="el-icon-circle-plus"
        class="handle-del mr10"
        @click="addShuxing"
      >属性新增
      </el-button>
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']">
      </el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>

      <div>
        <el-table
          :data="tableData"
          border
          class="table"
          header-cell-class-name="table-header"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="id" label="编号" width="55" align="center"></el-table-column>
          <el-table-column prop="name" label="属性名称"></el-table-column>
          <el-table-column prop="typeNames" label="分类" ></el-table-column>
          <el-table-column prop="type" label="属性的类型" :formatter="formatType" ></el-table-column>
          <el-table-column prop="isSKU" label="是否为sku属性" align="center" :formatter="formatSKU"></el-table-column>

          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button

                type="text"
                icon="el-icon-edit"
                @click="updateShuxing( scope.row)"
              >编辑
              </el-button>
              <el-button
                v-if="scope.row.type!=3"
                type="text"
                icon="el-icon-edit"
                @click="updateShuxingValue( scope.row)"
              >维护属性值
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
      </div>



      <!-- 新增弹出框 -->
      <el-dialog title="新增信息"  width="40%" :visible.sync="ShuxingFormAdd">
        <el-form ref="ShuxingForm" :model="ShuxingForm" label-width="120px">
          <el-form-item label="属性名称" prop="name">
            <el-input v-model="ShuxingForm.name"></el-input>
          </el-form-item>

          <el-form-item label="属性中文名称" prop="nameChina">
            <el-input v-model="ShuxingForm.nameChina"></el-input>
          </el-form-item>


          <el-form-item label="所属类型" prop="typeId">
                <el-select v-model="ShuxingForm.typeId">
                    <el-option  v-for="item in typeName" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
          </el-form-item>

          <el-form-item label="属性类型" prop="type">
                <el-radio-group v-model="ShuxingForm.type">
                  <el-radio label="0">下拉框</el-radio>
                  <el-radio label="1">单选框</el-radio>
                  <el-radio label="2">复选框</el-radio>
                  <el-radio label="3">输入框</el-radio>
                </el-radio-group>
          </el-form-item>

          <el-form-item label="是否SKU" prop="isSKU">
            <el-radio-group v-model="ShuxingForm.isSKU">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否展示" prop="isDel">
            <el-radio-group v-model="ShuxingForm.isDel">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ShuxingFormAdd=false">取 消</el-button>
                <el-button type="primary" @click="addForm">新 增</el-button>
            </span>
      </el-dialog>


      <!-- 修改弹出框 -->
      <el-dialog title="修改信息"  width="40%" :visible.sync="ShuxingFormUpdate">
        <el-form ref="ShuxingUpdateForm" :model="ShuxingUpdateForm" label-width="120px">
          <el-input v-model="ShuxingUpdateForm.id" type="hidden"></el-input>
          <el-form-item label="属性名称" prop="name">

            <el-input v-model="ShuxingUpdateForm.name"></el-input>
          </el-form-item>

          <el-form-item label="属性中文名称" prop="nameChina">
            <el-input v-model="ShuxingUpdateForm.nameChina"></el-input>
          </el-form-item>


          <el-form-item label="所属类型" prop="typeId">
            <el-select v-model="ShuxingUpdateForm.typeId">
              <el-option  v-for="item in typeName" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="属性类型" prop="type">
            <el-radio-group v-model="ShuxingUpdateForm.type">
              <el-radio :label="0">下拉框</el-radio>
              <el-radio :label="1">单选框</el-radio>
              <el-radio :label="2">复选框</el-radio>
              <el-radio :label="3">输入框</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否SKU" prop="isSKU">
            <el-radio-group v-model="ShuxingUpdateForm.isSKU">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否展示" prop="isDel">
            <el-radio-group v-model="ShuxingUpdateForm.isDel">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ShuxingFormUpdate=false">取 消</el-button>
                <el-button type="primary" @click="updateFormSx">修 改</el-button>
            </span>
      </el-dialog>

      <!-- 属性值表-->
      <el-dialog :title="valueTitle"  :visible.sync="ShowValueTable">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          class="handle-del mr10"
          @click="addShuxingValue"
        >属性值新增
        </el-button>
        <el-table :data="ShuxingValueTable">
          <el-table-column property="id" label="序号" width="150"></el-table-column>
          <el-table-column property="name" label="属性值" width="200"></el-table-column>
          <el-table-column property="nameCH" label="属性中文值"></el-table-column>

          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="toUpdateShuxingValueForm(scope.row)"
              >编辑
              </el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-dialog>


      <!--新增属性值-->
      <el-dialog title="新增信息"  width="40%" :visible.sync="ShuxingValueFormAdd">
        <el-form ref="ShuxingValueForm" :rules="valuerules" :model="ShuxingValueForm" label-width="120px">
          <el-input type="hidden" v-model="ShuxingValueForm.id"></el-input>
          <el-form-item label="属性值名称" prop="name">
            <el-input v-model="ShuxingValueForm.name"></el-input>
          </el-form-item>

          <el-form-item label="属性值中文名称" prop="nameCH">
            <el-input v-model="ShuxingValueForm.nameCH"></el-input>
          </el-form-item>


          <!--<el-form-item label="属性" prop="attId">
            <el-select v-model="ShuxingValueForm.attId">
              <el-option v-for="item in shuxingIds" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>-->


        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ShuxingValueFormAdd=false">取 消</el-button>
                <el-button type="primary" @click="addValueForm">新 增</el-button>
            </span>
      </el-dialog>


      <!--修改属性值-->
      <el-dialog title="新增信息"  width="40%" :visible.sync="ShuxingValueFormUpdateShow">
        <el-form ref="ShuxingValueFormUpdate" :model="ShuxingValueFormUpdate" label-width="120px">
          <el-form-item label="属性值名称" prop="name">
            <el-input v-model="ShuxingValueFormUpdate.name"></el-input>
          </el-form-item>

          <el-form-item label="属性值中文名称" prop="nameCH">
            <el-input v-model="ShuxingValueFormUpdate.nameCH"></el-input>
          </el-form-item>


          <el-form-item label="属性" prop="attId">
            <el-select v-model="ShuxingValueFormUpdate.attId">
              <el-option v-for="item in shuxingIds" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>


        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ShuxingValueFormUpdateShow=false">取 消</el-button>
                <el-button type="primary" @click="updateValueForm">修 改</el-button>
            </span>
      </el-dialog>

    </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs'
    export default {
        name: "Shuxing",
        data(){



          return{
            typeName:[],
            typeNames:"",
            searchForm:{

              startDate:"",
              endDate:""
            },
            pageTotal: 0,
            tableData:[],
            pageSizes: [5, 10, 15, 20],
            query: {  //分页数据
              size: 5,
              page: 1
            },
            value1:[],
            ShuxingForm:{
              name:"",
              nameChina:"",
              typeId:"",
              type:"",
              isSKU:"",
              isDel:""
            },
            ShuxingUpdateForm:{
              id:"",
              name:"",
              nameChina:"",
              typeId:"",
              type:"",
              isSKU:"",
              isDel:""
            },
            ShuxingFormAdd:false,
            ShuxingFormUpdate:false,
            array:[],
            str:"",
           /* 属性值表数据*/
            ShowValueTable:false,
            ShuxingValueTable:[],

            //新增
            ShuxingValueFormAdd:false,
            ShuxingValueFormUpdateShow:false,
            ShuxingValueForm:{
              name:"",
              nameCH:"",
              attId:""
            },
            shuxingIds:[],

            ShuxingValueFormUpdate:{
              id:"",
              name:"",
              nameCH:"",
              attId:""
            },
            valueTitle:"",
            valuerules:{
              nameCH: [
                { required: true, message: '请输入属性值的名称', trigger: 'blur' },
                { max: 10, message: '长度不能超过 10 个字符', trigger: 'blur' }

              ],
              name: [
                { required: true, message: '请输入属性值', trigger: 'change' }
              ]},

          }
        },
        methods:{
          //修改
          updateShuxing:function (row) {
            //alert("修改")
            this.typeName = [];
            this.selectTypeName();
            this.ShuxingFormUpdate = true;
            axios.post("http://localhost:8080/api/shuxing/selectShuxingById?id="+row.id).then(res=>{
              this.ShuxingUpdateForm = res.data.data;

            }).then(err=>{

            })
          },
          updateFormSx:function(){
                axios.post("http://localhost:8080/api/shuxing/update",qs.stringify(this.ShuxingUpdateForm)).then(res=>{
                  alert("修改成功")
                  this.ShuxingFormUpdate = false;
                  this.queryData();
                }).then(err=>{

                })
          },
          //新增
          addShuxing:function(){
            this.ShuxingFormAdd = true;
            this.typeName = [];
            this.selectTypeName();
          },
          addForm:function(){
            axios.post("http://localhost:8080/api/shuxing/add",qs.stringify(this.ShuxingForm)).then(res=>{
              alert("新增成功")
              this.ShuxingFormAdd = false;
              this.queryData();
            }).then(err=>{

            })
          },
          handlePageChange:function(page){
            this.query.page = page;
            this.queryData();
          },
          handleSizeChange:function(size){
            this.query.size = size;
            this.queryData();
          },


          //数据查询
          queryData:function () {
            if(this.value1.length!=null){
              this.searchForm.startDate = this.value1[0];
              this.searchForm.endDate = this.value1[1];

            }
            var searchStr=qs.stringify(this.searchForm);
            console.log(searchStr);
            axios.get("http://localhost:8080/api/shuxing/getData?page="+this.query.page+"&size="+this.query.size).then(res=>{


              this.shuxingIds = res.data.data.list;
              this.tableData = res.data.data.list;
              this.pageTotal = res.data.data.count;
            }).then(err=>{

            })
          },
          formatSKU:function (row,column,value,index) {
            return value==0?"是":"不是";
          },
          formatType:function (row,column,value,index) {
            if(value==0){
              return "下拉框"
            }
            if(value==1){
              return " 单选框"
            }
            if(value==2){
              return "复选框"
            }
            if(value==3){
              return "输入框"
            }
          },
          //typeName要展示的数据
          //array 查询出来所有的数据

          selectTypeName:function () {
            axios.get("http://localhost:8080/api/shuxing/selectTypeName").then(res=>{
                this.array = res.data.data;

                this.getChildrenType();
              //循环所有的子节点信息
              for (let i = 0; i <this.typeName.length ; i++) {
                    this.typeNames="";
                    this.chandleName(this.typeName[i]);

                this.typeName[i].name = this.typeNames.split("/").reverse().join("/").substr(0,this.typeNames.split("/").reverse().join("/").length-1)
                console.log(this.typeName)
              }

            }).catch(err=>{

            })
          },
          chandleName:function(node){

            if(node.pid!=0){
              this.typeNames += "/"+node.name;
              for (let i = 0; i <this.array.length ; i++) {
                if(node.pid == this.array[i].id){
                  this.chandleName(this.array[i]);
                  break;
                }
              }
            }else {
              this.typeNames+="/"+node.name;
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
              this.typeName.push(node)
            }
          },
          //查询属性值表的数据
          queryShuxingData:function(id){
              axios.get("http://localhost:8080/api/sxvalue/getData?attId="+id).then(res=>{

                  console.log(res);
                  this.ShuxingValueTable = res.data.data;
              }).then(err=>{

              })
          },




          /*属性值表维护*/
          updateShuxingValue:function (row) {

            this.ShowValueTable = true;
            this.valueTitle=row.name+"的选项信息";
            this.ShuxingValueForm.attId=row.id;
            this.queryShuxingData(row.id);
          },
          //属性值表新增
          addShuxingValue:function () {
              this.ShuxingValueFormAdd = true;

          },
      addValueForm:function () {
            this.$refs["ShuxingValueForm"].validate(res=>{
              if(res==true){
                axios.post("http://localhost:8080/api/sxvalue/add",qs.stringify(this.ShuxingValueForm)).then(res=>{
                  //弹框
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.ShuxingValueFormAdd = false;
                  this.queryShuxingData(this.ShuxingValueForm.attId);
                }).then(err=>{

                })
              }else {
                return false;
              }
            })

      },
          //修改
          toUpdateShuxingValueForm:function (row) {
            this.ShuxingValueFormUpdateShow = true;
            axios.get("http://localhost:8080/api/sxvalue/selectValueById?id="+row.id).then(res=>{
              console.log(res)
              this.ShuxingValueFormUpdate = res.data.data;
            }).then(err=>{
            })

          },
          updateValueForm:function(){
              axios.post("http://localhost:8080/api/sxvalue/update",qs.stringify(this.ShuxingValueFormUpdate)).then(res=>{
                  alert("修改成功")
                this.ShuxingValueFormUpdateShow = false;
                this.queryShuxingData(this.ShuxingValueFormUpdate.attId);

              }).catch(err=>{

              })
          }
            },
        created:function () {
          this.queryData();
        }
    }
</script>

<style scoped>
  .handle-input {
    width: 300px;
    display: inline-block;
  }
</style>
