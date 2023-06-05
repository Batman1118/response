import Vue from "vue";
import {
  Button,
  Layout,
  Menu,
  Icon,
  Form,
  Input,
  Tabs,
  Checkbox,
  Row,
  Col,
  Avatar,
  Divider,
  Card,
  List,
  Tooltip,
  Dropdown,
  Select,
  Switch,
  Radio,
  DatePicker,
  Table,
  Tag,
  Modal,
  TreeSelect,
  Alert,
  Cascader,
  Pagination,
  FormModel,
  message
} from "ant-design-vue";
Vue.use(Alert).use(Pagination).use(Tag).use(Switch).use(FormModel).use(Modal).use(Cascader).use(TreeSelect).use(Button).use(Layout).use(Menu).use(Icon).use(Form).use(Input).use(Tabs).use(Checkbox).use(Row).use(Col).use(Avatar).use(Divider).use(Card).use(List).use(Tooltip).use(Dropdown).use(Select).use(Radio).use(DatePicker).use(Table);
Vue.prototype.$message = message;