<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" label-width="100px" :rules="dataRules">
      <el-form-item label="医院名称：" prop="hospName">
        <el-input v-model="formData.hospName"></el-input>
      </el-form-item>
      <el-form-item label="医院地址：" prop="hospAddr">
        <el-input v-model="formData.hospAddr"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="formData.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitEdit" :loading="loading">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  //导入network
  import {getHospById, updateHosp} from '@/api/hospitalManage'

  export default {
    name: "index",
    data() {
      return {
        hospId: null,
        formData: {
          hospName: '',
          hospAddr: '',
          remark: ''
        },
        loading: false,
        dataRules: {
          hospName: [
            {required: true, message: '请输入医院名称', trigger: 'blur'}
          ],
          hospAddr: [
            {required: true, message: '请输入医院地址', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //获取id
      getHospId() {
        this.hospId = this.$route.params.id
      },
      //获取信息
      async getHospInfo() {
        let d = await getHospById({id: this.hospId})
        let {hospName, remark, hospAddr} = d.data
        this.formData.hospName = hospName
        this.formData.remark = remark
        this.formData.hospAddr = hospAddr
      },
      submitEdit() {
        this.$refs.form.validate(async r => {
          if (r) {
            let {hospName, hospAddr, remark} = this.formData
            this.loading = true
            let d = await updateHosp({hospName, hospAddr, remark,hospId:this.hospId})
            if (d.code === 200) {
              this.$message({
                type: 'success',
                message: '编辑成功！'
              })
              this.loading = false
              this.$router.go(-1)
            } else {
              this.loading = false
              return this.$message({
                type: 'error',
                message: '编辑失败！'
              })
            }
          } else {
            return this.$message({
              type: 'warning',
              message: '请检查表单信息是否正确！'
            })
          }
        })
      }
    },
    created() {
      this.getHospId()
      this.getHospInfo()
    }
  }
</script>

<style scoped lang="less">

</style>
