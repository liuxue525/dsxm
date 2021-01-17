<template>
  <div>
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-cascades"></i> 品牌列表
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="container">
        <div class="handle-box">
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            class="handle-del mr10"
            @click="addBrand"
          >品牌新增
          </el-button>
          <el-input v-model="query.name" placeholder="品牌名称" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          class="table"
          header-cell-class-name="table-header"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="id" label="编号" width="55" align="center"></el-table-column>
          <el-table-column prop="name" label="品牌名称"></el-table-column>
          <el-table-column prop="bandE" label="首字母"></el-table-column>
          <el-table-column prop="ord" label="排序"></el-table-column>
          <el-table-column label="品牌logo" align="center">
            <template slot-scope="scope">
              <img width="50px" :src="scope.row.imgPath"/>
            </template>
          </el-table-column>



          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEdit( scope.row)"
              >编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>


        <div class="pagination">
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

      <!-- 编辑弹出框 -->
      <el-dialog title="新增信息"  width="40%" :visible.sync="dialogBrandAdd">
        <el-form ref="brandForm" :model="brandForm" label-width="120px">
          <el-form-item label="品牌名称" prop="name">
            <el-input v-model="brandForm.name"></el-input>
          </el-form-item>
          <el-form-item label="品牌首字母" prop="bandE">
            <el-input v-model="brandForm.bandE"></el-input>
          </el-form-item>

          <el-form-item label="品牌LOGO" prop="imgPath">


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

          <el-form-item label="品牌故事" prop="bandDesc">
            <el-input
              type="textarea"
              :rows="2"
              maxlength="200"
              show-word-limit
              placeholder="请输入品牌故事"
              v-model="brandForm.bandDesc">
            </el-input>
          </el-form-item>
          <el-form-item label="排序" prop="ord">
            <el-input v-model="brandForm.ord"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogBrandAdd=false">取 消</el-button>
                <el-button type="primary" @click="addPinpai">确 定</el-button>
            </span>
      </el-dialog>





      <el-dialog title="修改信息"  width="40%" :visible.sync="dialogBrandUpdate">
        <el-form ref="brandForm" :model="brandForm" label-width="120px">
          <el-form-item label="ID" prop="id">
            <el-input v-model="formUpdate.id"></el-input>
          </el-form-item>

          <el-form-item label="品牌名称" prop="name">
            <el-input v-model="formUpdate.name"></el-input>
          </el-form-item>
          <el-form-item label="品牌首字母" prop="bandE">
            <el-input v-model="formUpdate.bandE"></el-input>
          </el-form-item>

          <!--<el-form-item label="品牌LOGO" prop="imgPath">
            <template slot-scope="scope">
              <img width="50px" :src="formUpdate.imgPath"/>
            </template>

            <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/api/pinpai/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </el-form-item>-->


          <el-form-item label="品牌LOGO" prop="imgPath">
            <img width="50px" :src="formUpdate.imgPath"/>

            <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/api/pinpai/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess1"
              :before-upload="beforeAvatarUpload1">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </el-form-item>



          <el-form-item label="品牌故事" prop="bandDesc">
            <el-input
              type="textarea"
              :rows="2"
              maxlength="200"
              show-word-limit
              placeholder="请输入品牌故事"
              v-model="formUpdate.bandDesc">
            </el-input>
          </el-form-item>
          <el-form-item label="排序" prop="ord">
            <el-input v-model="formUpdate.ord"></el-input>
          </el-form-item>

          <el-form-item label="是否展示" prop="isDel">
            <el-radio-group v-model="formUpdate.isDel">
              <el-radio  :label="0" >展示</el-radio>
              <el-radio  :label="1" >不展示</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogBrandUpdate=false">取 消</el-button>
                <el-button type="primary" @click="updatePinpai">修 改</el-button>
            </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs'
  export default {
    name: "BrandMain",

    data() {
      return {
        query: {
          name:"",
          size: 5,
          page: 1
        },
        imageUrl:"",
        tableData: [],
        pageSizes: [5, 10, 15, 20],
        dialogBrandAdd: false,
        dialogBrandUpdate:false,

        pageTotal: 0,
        titleName:"品牌新增",
        brandForm: {
          name: "",
          bandE: "",
          ord: "",
          imgPath: "",
          bandDesc: ""

        },
        formUpdate:{
          id:"",
          name: "",
          bandE: "",
          ord: "",
          imgPath: "",
          bandDesc: "",
          isDel:""
        }
      }
    },
    methods: {
      //新增方法
      addBrand:function(){
          this.dialogBrandAdd = true;
          this.brandForm={
            name: "",
            bandE: "",
            ord: "",
            imgPath: "",
            bandDesc: ""
                   }
        this.imageUrl="";

      },
      //条件查询
      handleSearch:function(){
        this.getData();
      },
      //修改
      handleEdit:function(row){
        this.dialogBrandUpdate = true;
        this.imageUrl="";
        axios.get("http://localhost:8080/api/pinpai/selectPinpaiById?id="+row.id).then(res=>{
          this.formUpdate = res.data.data;
          this.formUpdate.id = row.id;
          this.formUpdate.name = row.name;
          this.formUpdate.bandE = row.bandE;
            this.formUpdate.ord = row.ord;
            this.formUpdate.imgPath = row.imgPath;
            this.formUpdate.bandDesc = row.bandDesc;
          this.formUpdate.isDel = row.isDel;
        }).then(err=>{

        })

      },
      updatePinpai:function(){
          axios.post("http://localhost:8080/api/pinpai/update",qs.stringify(this.formUpdate)).then(res=>{
            alert("修改成功")
            this.dialogBrandUpdate = false;
            this.getData();
          }).catch(err=>{

          })
      },
      //
      handlePageChange:function(page){
        this.query.page = page;
        this.getData();
      },
      addPinpai:function(){
        axios.post("http://localhost:8080/api/pinpai/add",qs.stringify(this.brandForm)).then(res=>{
          alert("新增成功");
          this.dialogBrandAdd = false;
          this.getData();
        }).then(err=>{

        })
      },
      //
      handleSizeChange:function(size){
        this.query.size = size;
        this.getData();

      },
      imgCallBack:function(response, file, fileList){ //图片上传的回调函数
        // 赋值
        this.brandForm.imgPath=response;
        debugger;
      },

      getData:function () {
        axios.get("http://localhost:8080/api/pinpai/selectPinpai?page="+this.query.page+"&size="+this.query.size+"&name="+this.query.name).then(res=>{
              this.tableData = res.data.data.list;
              this.pageTotal = res.data.data.count;
        }).then(err=>{

        })
      },
      handleAvatarSuccess(res, file) {
        debugger;
        //打断点 看怎么取返回值
        this.brandForm.imgPath=res.data;
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
      },
      handleAvatarSuccess1(res, file) {
        debugger;
        //打断点 看怎么取返回值
        this.formUpdate.imgPath=res.data;
        //显示赋值
        this.imageUrl=res.data;
      },
      beforeAvatarUpload1(file) {
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

    },
    created:function () {
      this.getData();
    }
  }
</script>

<style>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .red {
    color: #ff0000;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }
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
