<template>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    style="width: 500px;">
    <el-option
      v-for="item in options"
      :key="item.imcode"
      :label="`${item.imnick}${item.id}`"
      :imcode="item.imcode"
      :deptname="item.deptname"
      :imnick="item.imnick"
      :pos_name="item.pos_name"
      :value=item.imcode>
    </el-option>
  </el-select>
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
      console.log('xx1', this.states);
      this.list = this.states.map(item => {
        return { 
          deptname: `${item.deptname}`, 
          label: `label:${item.imcode}`, 
          imcode: `${item.imcode}`, 
          imnick: `imnick:${item.imnick}`, 
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
              return item.imnick.toLowerCase()
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