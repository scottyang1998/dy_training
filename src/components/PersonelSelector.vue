<template>
  <div>
    <div class="word">只读权限<i class="el-icon-question"></i></div>
    <el-select v-model="value" multiple filterable remote reserve-keyword placeholder="请输入关键词"
      :remote-method="remoteMethod" :loading="loading" style="width: 500px;">
      <el-option v-for="item in options" :key="item.imcode" :label="`${item.imnick}<${item.imcode}>`"
        :imcode="item.imcode" :deptname="item.deptname" :imnick="item.imnick" :pos_name="item.pos_name"
        :value=item.imcode>
        <span>{{`${item.imnick}<${item.imcode}>-${item.pos_name}-${item.deptname}`}}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import arr from '../data/data.js'
  export default {
    data() {
      return {
        options: [],
        value: [],
        list: [],
        loading: false,
        states: arr
      }
    },

    mounted() {
      //console.log('xx1', this.states);
      this.list = this.states.map(item => {
        return {
          deptname: `${item.deptname}`,
          label: `label:${item.imcode}`,
          imcode: `${item.imcode}`,
          imnick: `${item.imnick}`,
          pos_name: `${item.pos_name}`,
          key: `key:${item.imnick}`,
          value: `value:${item.imcode}`
        };
      });
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;

          //正则实现模糊搜索
          let m = query.match(/(\d*)/)[0];   //匹配query中的第一串数字
          // console.log(typeof m);
          // console.log("数字", m);
          let n = query.match(/[\u4e00-\u9fa5]{1,}/);   //匹配query中的第一串汉字
          // console.log("汉字", n);
          if (m == null) m = ""
          if (n == null) n = ""
          let query1 = m + n  //重组query 如 123周
          let query2 = n + m  //重组query 如 周123
          // console.log("query1", query1);
          // console.log("query2", query2);
          let strReg1 = ['', ...query1, ''].join('.*'); //转化成正则格式的字符串
          let strReg2 = ['', ...query2, ''].join('.*'); //转化成正则格式的字符串
          let reg1 = new RegExp(strReg1)
          let reg2 = new RegExp(strReg2)

          setTimeout(() => {
            this.loading = false;
            // console.log("pre", this.list);
            this.options = this.list.filter(item => {
              // return (item.label + item.imnick).toLowerCase()
              //   .indexOf(query.toLowerCase()) > -1;
              return reg1.test(item.label + item.imnick) || reg2.test(item.label + item.imnick)  //返回符合的item
            });
          }, 200);
          // console.log("pro", this.list);
        } else {
          this.options = [];
        }
      }
    }
  }
</script>

<style scoped>
  .word {
    width: 468px;
    height: 30px;
    margin: 0 auto;
    padding: 0 400px 0 0;
  }
</style>