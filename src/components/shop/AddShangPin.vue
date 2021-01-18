<template>
    <div>
      <h1>新增商品</h1>

      <el-steps :active="active" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>

      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>

      



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



        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price"></el-input>
        </el-form-item>

        <el-form-item label="库存" >
          <el-input v-model="form.stocks"></el-input>
        </el-form-item>

        <el-form-item label="排序" >
          <el-input v-model="form.sortNum"></el-input>
        </el-form-item>

        <el-button type="success" @click="addShangPin">提交</el-button>
      </el-form>


    </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
    export default {
        name: "AddShangPin",
        data(){
          return{
            form:{},
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
                { required: true, message: '请输入价格', trigger: 'blur' }
              ]
            },
            active: 0
          }
        },
      methods: {
        next() {
          if (this.active++ > 2) this.active = 0;
        },
        addShangPin:function () {
          axios.post("http://localhost:8080/api/shangpin/addShangPin",qs.stringify(this.form)).then(res=>{
            this.$message({
              message:"添加成功",
              type:"success"
            })
            this.form = {}
          }).catch(err=>{

          })
        },
        selectPinpai:function () {
          axios.get("http://localhost:8080/api/pinpai/selectPinpaiName").then(res=>{
            console.log(res);
            this.pinpais = res.data.data;
          }).catch(err=>{

          })
        }

      },
      created:function () {
          this.selectPinpai();
      }
    }
</script>

<style scoped>

</style>
