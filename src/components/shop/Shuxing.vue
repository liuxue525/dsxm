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
        v-model="query.value1"
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
          <el-table-column prop="nameChina" label="属性名称"></el-table-column>
          <el-table-column prop="typeId" label="分类"></el-table-column>
          <el-table-column prop="type" label="属性的类型"></el-table-column>
          <el-table-column prop="isSKU" label="是否为sku属性" align="center"></el-table-column>
          <el-table-column prop="isDel" label="是否展示"></el-table-column>
          <el-table-column prop="createDate" label="创建时间"></el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="updateShuxing( scope.row)"
              >编辑
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
    </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs'
    export default {
        name: "Shuxing",
        data(){
          return{
            pageTotal: 0,
            tableData:[],
            pageSizes: [5, 10, 15, 20],
            query: {  //分页数据
              value1:"",
              size: 5,
              page: 1
            }
          }
        },
        methods:{
          //修改
          updateShuxing:function (row) {
            alert("修改")
          },
          //新增
          addShuxing:function(){

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
            axios.get("http://localhost:8080/api/shuxing/getData?page="+this.query.page+"&size="+this.query.size).then(res=>{
              this.tableData = res.data.data.list;
              this.pageTotal = res.data.data.count;
            }).then(err=>{

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
