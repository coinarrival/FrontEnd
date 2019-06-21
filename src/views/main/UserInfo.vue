<template>
  <el-form :model="info" style="width: 600px; margin: 20px auto;">
    <el-form-item label="姓名" :label-width="formLabelWidth">
      <el-input v-model="info.name" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="学号" :label-width="formLabelWidth">
      <el-input v-model="info.id" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="专业" :label-width="formLabelWidth">
      <el-input v-model="info.major" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="性别" :label-width="formLabelWidth">
      <el-input v-model="info.gender" autocomplete="off"></el-input>
    </el-form-item>

    <el-divider></el-divider>

    <el-form-item label="电话" :label-width="formLabelWidth">
      <el-input v-model="info.phone" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="邮箱" :label-width="formLabelWidth">
      <el-input v-model="info.email" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'UserInfo',
  props: {},
  data() {
    return {
      formLabelWidth: '120px',
      info: {
        name: '佚名',
        id: '16340000',
        major: 'Software Engineer',
        gender: 'male',
        phone: '13231987429',
        email: 'falsemail@gmail.com'
      } 
    }
  },
  methods: { }
}
</script>

<style>

</style>
