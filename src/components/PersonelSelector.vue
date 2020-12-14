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
    computed: {
      handledata: {
        get() {
          return this.value
        },
        set(newval) {
          console.log("aaa", newval);
          this.value = newval.map((val) => {
            return val.split('-')[0]
          })
        }
      }
    },
    mounted() {
      console.log('xx1', this.states);
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
          setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
              return (item.label + item.imnick).toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
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