import Vue from 'vue'
//element-ui中组件的按需导入
import { Button,Form,FormItem ,Input,Message} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
