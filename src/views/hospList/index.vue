<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchData" class="demo-form-inline">
      <el-form-item label="医院名称">
        <el-input v-model="searchData.hospName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="医院地址">
        <el-input v-model="searchData.addr" placeholder="请输入地址"></el-input>
      </el-form-item>
      <el-form-item label="医院名称">
        <el-input v-model="searchData.remark" placeholder="请输入审批人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitClear">清空</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="isLoadingTable"
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <el-table-column
        prop="hospName"
        label="医院名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="hospAddr"
        label="医院地址"
        width="300">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="医院备注">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row.hospId)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.hospId)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="!isShowSearchPag"
      :total="total"
      :page.sync="paginaton.page"
      :limit.sync="paginaton.limit"
      @pagination="changePage"
      :pageSizes="[5,10,15,20]"
    />
    <!--    搜索分页-->
    <pagination
      v-show="isShowSearchPag"
      :total="totalSearch"
      :page.sync="paginatonSearch.page"
      :limit.sync="paginatonSearch.limit"
      @pagination="changePageSearch"
      :pageSizes="[5,10,15,20]"
    />
  </div>
</template>

<script>
  //导入组件
  import Pagination from '@/components/Pagination'
  //导入network
  import {getHospList, removeHosp, selectHosp} from '@/api/hospitalManage'

  export default {
    name: "index",
    data() {
      return {
        isShowSearchPag: false,
        tableData: [],
        //查询的
        searchData: {
          hospName: '',
          addr: '',
          remark: ''
        },
        isLoadingTable: false,
        paginaton: {
          page: 1,
          limit: 5
        },
        total: 0,

        totalSearch: 0,
        paginatonSearch: {
          page: 1,
          limit: 5
        }
      }
    },
    components: {
      Pagination
    },
    methods: {
      changePage(obj) {
        this.paginaton.page = obj.page
        this.paginaton.limit = obj.limit
        this.getHospList()
      },

      //搜索的分页
      changePageSearch(obj) {
        this.paginatonSearch.page = obj.page
        this.paginatonSearch.limit = obj.limit
        this.onSubmitSearch()
      },

      //获取列表分页
      async getHospList() {
        let {page, limit} = this.paginaton
        try {
          this.isLoadingTable = true
          let d = await getHospList({pageNum: page, pageSize: limit})
          this.tableData = d.data[0]
          this.total = d.data[1]
          this.isLoadingTable = false
        } catch (e) {
          this.isLoadingTable = false
          this.$message({
            type: 'error',
            message: '服务器响应失败！'
          })
        }
      },

      //编辑
      handleEdit(id) {
        this.$router.push(`/hosps/edit/${id}`)
      },
      //删除
      handleDelete(id) {
        this.$confirm('确认删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            let d = await removeHosp({hospId: id})
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.getHospList()
          } catch (e) {
            this.$message({
              type: 'error',
              message: '删除失败！'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //查询
      async onSubmitSearch() {
        let {hospName, addr, remark} = this.searchData
        let {page, limit} = this.paginatonSearch
        if (!hospName && !addr && !remark) {
          return this.$message({
            type: 'warning',
            message: '请输入搜索条件！'
          })
        }
        this.isLoadingTable = true
        try {
          let d = await selectHosp({
            hospName,
            addr,
            remark,
            pageNum: page,
            pageSize: limit
          })
          this.isLoadingTable = false
          let [datas, count] = d.data
          if (count === 0) {
            return this.$message({
              type: 'success',
              message: '搜索到0条数据'
            })
          } else {
            //设置表格数据
            this.tableData = datas
            this.totalSearch = count
            this.isShowSearchPag = true
          }
        } catch (e) {
          this.isLoadingTable = false
          return this.$message({
            type: 'error',
            message: '服务器响应失败！'
          })
        }
      },

      //清空
      onSubmitClear(){
        this.isShowSearchPag = false
        this.paginaton.limit = 5
        this.paginaton.page = 1
        this.paginatonSearch.limit=5
        this.paginatonSearch.page = 1
        //清空数据
        for(let key in this.searchData){
          this.searchData[key] = ''
        }
        this.getHospList()
      }
    },
    created() {
      this.getHospList()
    }
  }
</script>

<style scoped lang="less">

</style>
