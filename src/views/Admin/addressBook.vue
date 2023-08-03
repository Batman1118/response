<template>
  <div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="6">
        <a-button v-if="unittype && unittype !== null" type="primary" @click="editData('add',{})">新增</a-button>
        <a-button v-if="unittype && unittype !== null" type="primary" @click="visible = true" style="margin: 0 12px">导入通讯录表</a-button>
        <a-button v-if="unittype && unittype !== null" type="primary" @click="openGroup()">分组管理</a-button>
      </a-col>
      <a-col :span="18">
        <a-row type="flex" justify="end" :gutter="14">
          <a-col :span="6">
            <a-input v-model="search.searchParams.company" placeholder="单位名称" style="width: 100%"/>
          </a-col>
          <a-col :span="6">
            <a-select v-model="search.searchParams.addressBookGroupId" placeholder="选择分组" style="width: 100%" @change="handleChange">
              <a-select-option v-for="item in groupData" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-button type="primary" @click="searchData()">查询</a-button>
            <a-button style="margin-left: 12px" @click="resetSearch">重置</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="table-cont">
      <a-table :columns="columns" :data-source="tableData" :pagination="pagination" :rowKey="record=>record.id" bordered>
        <template #group="groupId">
          {{ getGroupName(groupId) }}
        </template>
        <template #action="action,row">
          <a-button type="link" @click="editData('edit',row)">编辑</a-button>
          <a-button type="link" class="delBtn" @click="delData(row)">删除</a-button>
        </template>
      </a-table>
    </div>
    <address-user-mod ref="addressRef" :groupList="groupData" @refresh="getAddressBook"></address-user-mod>
    <group-list-mod ref="groupRef" @refresh="getGroupList"></group-list-mod>
    <a-modal v-model="visible" title="导入通讯录" ok-text="导入通讯录" :confirmLoading="uploadLoading" cancel-text="取消" @ok="uploadFile" centered :afterClose="clearMod">
      <a-form-model ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false">
        <a-form-model-item label="通讯录表格模板" extra="导入通讯录须依据此模板">
          <a-button type="primary" @click="downloadFile">下载模板</a-button>
        </a-form-model-item>
        <a-form-model-item label="通讯录表格文件">
          <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload" accept=".xlsx,.xls">
            <a-button> <a-icon type="upload"/> 点击上传 </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import {delGroupUser, getAddressBook, getGroupList, importFile} from '@/api/user'
import {getUserInfo} from "@/util/storage"
import addressUserMod from "@/views/Admin/components/addressUserMod"
import groupListMod from "@/views/Admin/components/groupListMod";
import exampleFile from '@/assets/example.xlsx'
export default {
  name: 'addressBook',
  components: { addressUserMod,groupListMod },
  data () {
    return {
      groupData: [],
      unittype: null,
      districtId: null,
      search:{
        pageIndex: 1,
        pageSize: 20,
        searchParams:{
          company: '',
          addressBookGroupId: null
        }
      },
      columns:[
        {
          title: '分组',
          dataIndex: 'addressBookGroupId',
          key: 'addressBookGroupId',
          scopedSlots: { customRender: 'group' }
        },
        {
          title: '单位',
          dataIndex: 'company',
          key: 'company'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '操作',
          key: 'action',
          width: '15%',
          scopedSlots: { customRender: 'action' }
        },
      ],
      tableData: [],
      pagination: {
        current: 1,
        defaultCurrent: 1,
        defaultPageSize: 20,
        total: 0,
        onChange: ( page, pageSize ) => this.onPageChange(page,pageSize),
        showTotal: total => `共 ${total} 条`
      },
      visible: false,
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      exampleFile,
      fileList: [],
      delList: [],
      uploadLoading: false
    }
  },
  created() {
    const t = this
    t.unittype = getUserInfo().unittype
    t.districtId = getUserInfo().districtId
    t.getAddressBook()
    t.getGroupList()
  },
  methods:{
    async getAddressBook(){
      const t = this
      const res = await getAddressBook(t.search)
      if(res.data.code == 100){
        t.tableData = res.data.data
        t.pagination.total = res.data.total
      }else{
        t.$message.warning(res.data.msg);
      }
    },

    async getGroupList(){
      let res = await getGroupList()
      if(res.data.code == 100){
        this.groupData = res.data.data
      } else {
        this.$message.warning(res.data.msg);
      }
    },

    handleChange(value) {
      console.log(`selected ${value}`);
    },

    searchData(){
      this.search.pageIndex = 1
      this.getAddressBook()
    },

    resetSearch(){
      const t = this
      t.search = {
        pageIndex: 1,
        pageSize: 20,
        searchParams:{
          company: '',
          addressBookGroupId: null
        }
      }
      t.getAddressBook()
    },

    editData(type,data){
      const t = this
      t.$refs.addressRef.openDialog(type,data)
    },
    openGroup(){
      this.$refs.groupRef.openDialog()
    },

    async delData(row){
      const t = this
      this.$confirm({
        title: '提示',
        content: h => <div>是否删除该条用户信息？</div>,
        cancelText: '取消',
        okText: '确认',
        centered: true,
        onOk() {
          delGroupUser({id: row.id}).then(res=>{
            if(res.data.code == 100){
              t.$message.success('删除用户信息成功');
              t.getAddressBook()
            }else{
              t.$message.warning(res.data.msg);
            }
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },

    onPageChange(page, pageSize) {
      const t= this
      t.pagination.current = page
      t.search.pageIndex = page
      t.getAddressBook()
    },
    getGroupName(id){
      return this.groupData.find(i => i.id === id)?.name;
    },

    downloadFile(){
      const link = document.createElement('a')
      link.href = exampleFile
      link.target = '_blank'
      link.download = '通讯录导入模板.xlsx'
      link.click()
    },

    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      this.fileList = this.fileList.slice(-1)
      return false;
    },

    async uploadFile(){
      if(this.fileList.length == 0){
        this.$message.warning('请先上传通讯录表格');
        return
      }else{
        this.uploadLoading = true
        const { fileList } = this;
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('file', file)
        })
        const res = await importFile(formData)
        if(res.data.code == 100){
          this.$message.success(res.data.msg,2);
          this.fileList = []
          this.uploadLoading = false
          this.visible = false
          this.getAddressBook()
        }else{
          this.$message.warning(res.data.msg);
          this.uploadLoading = false
        }
      }
    },

    clearMod(){
      this.fileList = []
    }
  }
}
</script>

<style lang="less" scoped>
.delBtn{
  color: @danger
}
</style>
