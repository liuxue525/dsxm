<template>
      <div>
        <h1>商品分类管理</h1>
        <el-tree
          :data="data"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :expand-on-click-node="false"
          @check="boxchecked"
          @node-click="handleNodeClick"
          :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>

          <el-button
            type="text"
            size="mini"
            @click="updateNode(data)">
            修改
          </el-button>
        </span>
      </span>
        </el-tree>


        <el-button type="success" @click="toAddNode">新增节点</el-button>



        <el-dialog
          title="新增节点"
          :visible.sync="addNodeShowFlag"
        >
          <el-form ref="form"  :model="form" style="width: 50%" label-width="80px">

            <!--<el-form-item label="父节点信息" prop="pid">
              <el-input v-model="form.pid"></el-input>
            </el-form-item>-->
            <el-form-item label="父节点" prop="pid">
              <el-select placeholder="请选择要添加节点的父节点" v-model="form.pid"  >
                    <el-option v-for="item  in nodes"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"
                    ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="节点信息" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-button type="info" @click="addNode">新增</el-button>

          </el-form>
        </el-dialog>


        <el-dialog
          title="修改节点"
          :visible.sync="updateNodeShowFlag"
        >
          <el-form ref="updateForm"  :model="updateForm" style="width: 50%" label-width="80px">

            <!--<el-form-item label="父节点信息" prop="pid">
              <el-input v-model="form.pid"></el-input>
            </el-form-item>-->
            <el-form-item label="节点ID" prop="id">
              <el-input type="hidden" v-model="updateForm.id"></el-input>
              <el-input v-model="updateForm.id" readonly></el-input>
            </el-form-item>

            <el-form-item label="节点信息" prop="name">
              <el-input v-model="updateForm.name"></el-input>
            </el-form-item>

            <el-form-item label="是否展示" prop="idDel">
              <el-radio-group v-model="updateForm.idDel">
                <el-radio  :label="0" >展示</el-radio>
                <el-radio  :label="1" >不展示</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-button type="info" @click="updateType">修改</el-button>

          </el-form>
        </el-dialog>

      </div>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        name: "Type",
      data(){
        return{
          nodes:[],
          addNodeShowFlag:false,
          updateNodeShowFlag:false,
          form:{

          },

          data:[],
          jsonStr:"",
          ajaxData:[],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          updateForm:{
            id:"",
            pid:"",
            name:"",
            idDel:""
          }
        }
      },
      created:function () {

          this.queryType();


      },
      methods:{
          chandleData:function(){
            for (let i = 0; i <this.ajaxData.length ; i++) {
              if(this.ajaxData[i].pid==0){
                this.digui(this.ajaxData[i])
                break;
              }
            }
            this.data.push(JSON.parse(this.jsonStr));
          },
        digui:function(node){
          var rs=this.isParent(node);
          if(rs==true){
            this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'","children":[';
            let count = 0;
            for (let i = 0; i <this.ajaxData.length ; i++) {
              if(node.id==this.ajaxData[i].pid){
                this.digui(this.ajaxData[i]);
                this.jsonStr+=",";
                count++;
              }
            }
            if(count!=0){
              this.jsonStr=this.jsonStr.substr(0,this.jsonStr.length-1);
            }
            this.jsonStr+=']}';
          }else {
            this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'"}';
          }
        },
        isParent:function(node){
          for (let i = 0; i <this.ajaxData.length ; i++) {
            if(node.id==this.ajaxData[i].pid){
                return true;
            }
          }
          return false;
        },
        toAddNode:function () {
            this.addNodeShowFlag = true;
        },
        addNode:function(){
            console.log(this.form);
            if(this.form.pid==null){
              alert("请选择一个节点")
            }else {
              axios.post("http://localhost:8080/api/type/add",qs.stringify(this.form)).then(res=>{
                alert("新增成功");
                this.addNodeShowFlag = false;
                location.reload();
              }).catch(err=>{
              })
            }

        },
        handleNodeClick(data) {
          console.log(data);
        },
        boxchecked:function (data,status) {
          console.log(status);
        },
        queryType:function () {
          axios.get("http://localhost:8080/api/type/getData").then(res=>{
            this.ajaxData = res.data.data;
            this.nodes = res.data.data;
            console.log(this.ajaxData);
            this.chandleData();
          }).catch(err=>{
            console.log(err);
          })
        },
        updateNode:function (data) {
          console.log(data)
          alert(data.id);

          this.updateNodeShowFlag = true;
          this.updateForm.id = data.id;

          this.updateForm.name = data.label;
          let rs = this.isParent(data);
          if (rs==true){
            //是父节点不能删除
            this.updateForm.idDel = 1;

          }else {
            this.updateForm.idDel = 0;
          }
        },
        updateType:function () {
            console.log(this.updateForm);
            debugger;
          axios.post("http://localhost:8080/api/type/update",qs.stringify(this.updateForm)).then(res=>{
            alert("修改成功");
            this.updateNodeShowFlag = false;
            location.reload();
          }).then(err=>{

          })

        }
      }
    }
</script>

<style scoped>

</style>
