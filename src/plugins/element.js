import { Checkbox, Input, Radio, Select, Option } from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Select)
    Vue.use(Input)
    Vue.use(Checkbox)
    Vue.use(Radio)
    Vue.use(Option)
  }
}
export default element
