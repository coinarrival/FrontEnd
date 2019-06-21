<template>
  <div>
    <el-row>
      <p class="balance">余额: ￥ {{balance}}</p>
    </el-row>
    <el-row>
      <el-button type="primary">充值</el-button>
      <el-button type="success">提现</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'UserWallet',
  props: {},
  data() {
    return {
      balance: 100,
    };
  },
  methods: { }
}
</script>

<style scoped>

.balance {
  color: #67C23A;
  font-size: 25pt;
}

</style>
