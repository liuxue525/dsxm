<template>
    <div>
      <h1>新增商品</h1>

      <el-steps :active="active" finish-status="success">
        <el-step title="填写商品信息"></el-step>
        <el-step title="填写商品属性"></el-step>
        <!--<el-step title="步骤 3"></el-step>-->
      </el-steps>





      


      <!--步骤一-->
      <el-form ref="form" :rules="valuerules" :model="form" label-width="180px" v-if="active==0">

        <el-form-item label="商品名称" prop="name" >
          <el-input v-model="form.name" ></el-input>
        </el-form-item>

        <el-form-item label="商品标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="品牌" prop="bandId">
          <el-select v-model="form.bandId">
            <el-option
            v-for="item in pinpais"
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

        <!--<el-button type="success" @click="addShangPin">提交</el-button>-->

        <el-button  type="success"  style="margin-top: 12px;margin-left: 450px" @click="next">下一步</el-button>
      </el-form>


      <!--步骤二-->

     <!-- <el-button @click="getChildrenType"></el-button>-->
      <el-form :model="ShuxingForm" label-width="180px" v-if="active==1">
        <el-button type="warning" style="margin-top: 12px;margin-left: 450px " @click="active--">上一步</el-button>



        <el-form-item label="属性类型" >
        <el-select v-model="ShuxingForm.attId" @change="getShuxing">
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
        <el-button  type="success" disabled  style="margin-top: 12px;margin-left: 450px" @click="next">下一步</el-button>
        <el-button type="warning" @click="testSubmit">提交</el-button>





      </el-form>


    </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
    export default {
        name: "AddShangPin",
        data(){
          var checkPrice= (rule, value, callback) => {
            if (!value) {
              return callback(new Error('属性名不能为空'));
            }
            if(/^[0-9]*$/i.test(value)){
              callback();
            }else{
              callback(new Error('只能输入数字'));
            }
          }
          return{
            /*第一页的数据*/
            form:{
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
            pinpais:[],
            valuerules:{
              name: [
                { required: true, message: '请输入属性值的名称', trigger: 'blur' }
              ],
              title: [
                { required: true, message: '请输入标题', trigger: 'blur' }
              ],
              bandId: [
                { required: true, message: '请输入属性值的名称', trigger: 'blur' }
              ]
            },
            active: 0,

            /*第二页的数据*/
            ss:[],
            aa:[],
            array:[],   //属性的下拉框
            ShuxingData:[],  //展示的下拉框
            ShuxingStr:"",
            ShuxingForm:{

              attId:"",


            },
            SKUData:[],  //影响价格
            SPUData:[],    //不影响价格
            tableShow:false,
            tableSkuData:[],
            cols:[],

          }
        },
      methods: {
        testSubmit:function(){
            //console.log(this.form)   //第一页的数据
            //SPU数据
            console.log(this.SPUData);

            let SPUDataForm = [];
          for (let i = 0; i <this.SPUData.length ; i++) {
            let SPUData = {}
            SPUData[this.SPUData[i].name] = this.SPUData[i].checkStatus;
                SPUDataForm.push(SPUData);
                debugger;
          }
            //sku数据
            console.log(this.tableSkuData);
          debugger;

           this.form.typeId = this.ShuxingForm.attId ;
           this.form.SPUDatas = JSON.stringify(SPUDataForm);
           debugger;
           this.form.SKUDatas = JSON.stringify(this.tableSkuData);
           axios.post("http://localhost:8080/api/shangpin/addShangPin",qs.stringify(this.form)).then(res=>{
             this.$message.success("新增成功")

           }).catch(err=>{

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
        getShuxing:function(typeId){
          this.SKUData=[];
          this.SPUData=[];
          //alert(typeId)
          axios.get("http://localhost:8080/api/shuxing/selectShuxingBytypeId?typeId="+typeId).then(res=>{

            console.log(res)
            debugger;
            let shuxingDatas = res.data.data;

            if (shuxingDatas.length>0) {

            for (let i = 0; i <shuxingDatas.length ; i++) {

                if(shuxingDatas[i].isSKU==0){  //判断是否SKU属性

                  if (shuxingDatas[i].type!=3){
                    axios.get("http://localhost:8080/api/sxvalue/getData?attId="+shuxingDatas[i].id).then(res=>{
                      debugger;
                      console.log(res);
                      //属性对应的属性值的数据
                      shuxingDatas[i].value = res.data.data;
                      //绑定一个选中状态 用来出表格效果
                      shuxingDatas[i].checkStatus = [];


                      this.SKUData.push(shuxingDatas[i])
                      debugger;
                    })
                  }else {
                    this.SKUData.push(shuxingDatas[i])
                  }




                }
                else{

                  if (shuxingDatas[i].type!=3){

                    shuxingDatas[i].checkStatus = []

                    axios.get("http://localhost:8080/api/sxvalue/getData?attId="+shuxingDatas[i].id).then(res=>{
                      shuxingDatas[i].value = res.data.data;

                      this.SPUData.push(shuxingDatas[i])
                    })

                  }else {
                    this.SPUData.push(shuxingDatas[i])
                  }


              }
            }
            }else{
              this.SKUData=[];
              this.SPUData=[];
            }

          })
          console.log(this.SPUData)
        },
        next() {
          this.$refs["form"].validate((valid) => {
            if (valid == true) {
              if (this.active++ > 2) this.active = 0;
            }
          })

        },
        shangyibu() {
          --this.active
          if (this.active < 2) this.active = 0;
        },
        addShangPin: function () {
          this.$refs["form"].validate((valid) => {
            if (valid == true) {

              axios.post("http://localhost:8080/api/shangpin/addShangPin", qs.stringify(this.form)).then(res => {
                this.$message({
                  message: "添加成功",
                  type: "success"
                })
                this.form = {}
              }).catch(err => {

              })

            } else {
              return false;
            }
          });

        },
        selectPinpai: function () {
          axios.get("http://localhost:8080/api/pinpai/selectPinpaiName").then(res => {
            console.log(res);
            this.pinpais = res.data.data;
          }).catch(err => {

          })
        },
        selectTypeName: function () {
          axios.get("http://localhost:8080/api/shuxing/selectTypeName").then(res => {

            this.array = res.data.data;

            this.getChildrenType();

            //循环子节点信息
            for (let i = 0; i <this.ShuxingData.length ; i++) {
                this.ShuxingStr = "";
              this.chandleName(this.ShuxingData[i]);

              this.ShuxingData[i].name = this.ShuxingStr.split("/").reverse().join("/").substr(0,this.ShuxingStr.split("/").reverse().join("/").length-1)
              console.log(this.ShuxingData)
            }
          }).catch(err => {

          })
        },
        chandleName:function(node){

              if(node.pid!=0){
                this.ShuxingStr += "/"+node.name;
                for (let i = 0; i <this.array.length ; i++) {
                    if(node.pid == this.array[i].id){
                      this.chandleName(this.array[i]);
                      break;
                    }
                }
              }else {
                this.ShuxingStr+="/"+node.name;
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
        },
        handleAvatarSuccess(res, file) {
          debugger;
          //打断点 看怎么取返回值
          this.form.imgPath=res.data;
          //显示赋值
          this.imageUrl=res.data;
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
        }
      },
      created:function () {
          //查询品牌
          this.selectPinpai();
          //查询属性
          this.selectTypeName();

      }
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
