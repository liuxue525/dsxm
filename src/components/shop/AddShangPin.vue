<template>
    <div>
      <h1>新增商品</h1>

      <el-steps :active="active" finish-status="success">
        <el-step title="填写商品信息"></el-step>
        <el-step title="填写商品属性"></el-step>
        <el-step title="步骤 3"></el-step>
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


            <el-radio-group v-if="a.type==1">
              <el-radio v-for="b in a.value" :key="b.id" :label="b.nameCH" ></el-radio>
            </el-radio-group>

          </el-form-item>

        </el-form-item>

        <table v-if="tableShow">
          <tr>
            <td>价格</td>
            <td>库存</td>
          </tr>
        </table>




        <el-form-item v-if="SPUData.length>0" label="商品参数" prop="name">
          <el-form-item v-for="a in SPUData" :key="a.id" :label="a.nameChina" >

            <el-input v-if="a.type==3"></el-input>

            <el-select v-if="a.type==0" v-model="aa[a.id]">
              <el-option v-for="b in a.value" :key="b.id" :label="b.nameCH" :value="b.id"></el-option>
            </el-select>

            <el-checkbox-group v-model="ss" v-if="a.type==2">
              <el-checkbox v-for="b in a.value" :key="b.id" :label="b.nameCH" :value="b.id"></el-checkbox>
            </el-checkbox-group>


            <el-radio-group v-if="a.type==1">
              <el-radio v-for="b in a.value" :key="b.id" :label="b.nameCH" ></el-radio>
            </el-radio-group>

          </el-form-item>
        </el-form-item>

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
              ],
              price: [
                { required: true, message: '请输入价格', trigger: 'blur' },
                /*{ validator:checkPrice,trigger: 'blur' }*/
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
              attId:""
            },
            SKUData:[],  //影响价格
            SPUData:[],    //不影响价格
            tableShow:false
          }
        },
      methods: {
        SKUChange:function(){
          console.log(this.SKUData);
          let DkedStatus = true;   //笛卡尔迪的触发状态 默认是触发的
          for (let i = 0; i <this.SKUData.length ; i++) {
              if (this.SKUData[i].checkStatus.length==0){

                //console.log(this.SKUData[i].nameChina)

                  DkedStatus = false;
                  break;
              }
          }
          if (DkedStatus==true){

            let array = this.discarts(this.SKUData)
            console.log(array);
          }
          this.tableShow = DkedStatus;

        },
        discarts:function() {
          //笛卡尔积
          var twodDscartes = function (a, b) {
            var ret = [];
            for (var i = 0; i < a.length; i++) {
              for (var j = 0; j < b.length; j++) {
                ret.push(ft(a[i], b[j]));
              }
            }
            return ret;
          }
          var ft = function (a, b) {
            if (!(a instanceof Array))
              a = [a];
            var ret = a.slice(0);
            ret.push(b);
            return ret;
          }
          //多个一起做笛卡尔积
          return (function (data) {
            var len = data.length;
            if (len == 0)
              return [];
            else if (len == 1)
              return data[0];
            else {
              var r = data[0];
              for (var i = 1; i < len; i++) {
                r = twodDscartes(r, data[i]);
              }
              return r;
            }
          })(arguments.length > 1 ? arguments : arguments[0]);
        },
        getShuxing:function(typeId){
          this.SKUData=[];
          this.SPUData=[];
          //alert(typeId)
          axios.get("http://localhost:8080/api/shuxing/selectShuxingBytypeId?typeId="+typeId).then(res=>{

            console.log(res)
            let shuxingDatas = res.data.data;

            if (shuxingDatas.length>0) {

            for (let i = 0; i <shuxingDatas.length ; i++) {

                if(shuxingDatas[i].isSKU==0){  //判断是否SKU属性

                  if (shuxingDatas[i].type!=3){
                    axios.get("http://localhost:8080/api/sxvalue/getData?attId="+shuxingDatas[i].id).then(res=>{
                      debugger;
                      console.log(res);
                      shuxingDatas[i].value = res.data.data;
                      shuxingDatas[i].checkStatus = [];


                      this.SKUData.push(shuxingDatas[i])
                    })
                  }else {
                    this.SKUData.push(shuxingDatas[i])
                  }




                }
                else{

                  if (shuxingDatas[i].type!=3){
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
