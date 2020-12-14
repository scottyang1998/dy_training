import { Checkbox, Input, Radio, Select, Option, Icon, Menu, MenuItem, MenuItemGroup, Submenu} from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Select)
    Vue.use(Input)
    Vue.use(Checkbox)
    Vue.use(Radio)
    Vue.use(Option)
    Vue.use(Icon)
    Vue.use(MenuItem)
    Vue.use(MenuItemGroup)
    Vue.use(Menu)
    Vue.use(Submenu)
  }
}
export default element
