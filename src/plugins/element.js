import { Checkbox, Input, Radio, Select, Option, Icon } from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Select)
    Vue.use(Input)
    Vue.use(Checkbox)
    Vue.use(Radio)
    Vue.use(Option)
    Vue.use(Icon)
  }
}
export default element
