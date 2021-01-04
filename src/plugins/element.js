import { Checkbox, Input, Radio, Select, Option, Icon, Menu, MenuItem, MenuItemGroup, Submenu, Container, Header, Main, Aside, Row, Button, Col, Tooltip, Tabs, TabPane, InputNumber, link, MessageBox, Message , DropdownItem ,DropdownMenu,Dropdown} from 'element-ui'
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
    Vue.use(Container)
    Vue.use(Header)
    Vue.use(Main)
    Vue.use(Aside)
    Vue.use(Row)
    Vue.use(Button)
    Vue.use(Col)
    Vue.use(Tooltip)
    Vue.use(Tabs)
    Vue.use(TabPane)
    Vue.use(InputNumber)
    Vue.use(link)
    Vue.use(DropdownItem)
    Vue.use(DropdownMenu)
    Vue.use(Dropdown)
    Vue.prototype.$confirm = MessageBox.confirm

  }
}
export default element
