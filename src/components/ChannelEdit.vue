<script setup>
import { ref, watch } from 'vue'
import { addSbService, editSbService } from '@/api/apartment'
import { UploadFilled } from '@element-plus/icons-vue'
import { useSbStore, useUserStore } from '@/stores'

const sbStore = useSbStore()
const userStore = useUserStore()
// 定义是否显示弹窗
const dialogVisible = ref(false)
const formModel = ref({
  id: '',
  sb_type: '',
  sb_number: '',
  sb_airplane: '',
  sb_title: '',
  sb_receive_date: '',
  sb_final_date: '',
  sb_remain_days: '',
  sb_eval_people: '',
  sb_eval_date: '',
  sb_content: '',
  sb_eo: ''
})

watch(
  () => formModel.value.sb_receive_date,
  (newValue) => {
    // 如果有id说明时编辑，直接跳过
    if (formModel.value.id) return

    // 添加才会自动设置时间
    if (newValue) {
      let date = new Date(newValue)
      let daysToAdd = 0
      switch (formModel.value.sb_type) {
        case 'CAD':
        case 'ASB':
        case 'FAA AD':
          daysToAdd = 15
          break
        case 'EASB':
        case 'EASA AD':
          daysToAdd = 3
          break
        default:
          daysToAdd = 30
          break
      }

      for (let i = 0; i < daysToAdd; i++) {
        date.setDate(date.getDate() + 1)
        // 每遇到周六日自动加一天
        if (date.getDay() === 6 || date.getDay() === 0) {
          daysToAdd++
        }
      }

      formModel.value.sb_remain_days = daysToAdd
      formModel.value.sb_final_date = date.getTime()
    }
  },
  { deep: true, immediate: true }
)

// 提交
const emit = defineEmits(['success'])
const headers = ref({
  Authorization: userStore.token
})
const onSubmit = async () => {
  await formRef.value.validate()
  // 将日期字段转换为13位时间戳
  formModel.value.sb_receive_date = new Date(formModel.value.sb_receive_date).getTime()
  formModel.value.sb_final_date = new Date(formModel.value.sb_final_date).getTime()

  // 提交时查看formModel.value.id的值，有说明是编辑，否则就是添加
  let message = '' // 后台返回的message
  if (formModel.value.id) {
    const res = await editSbService(formModel.value.id, formModel.value)
    message = res.data.message
  } else {
    const res = await addSbService(formModel.value)
    message = res.data.message
  }

  ElMessage({
    type: 'success',
    message: message
  })
  dialogVisible.value = false
  emit('success')
  upload.value.submit()
}

// 通过open方法确认是编辑还是删除
const open = (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }
}
// 暴露open方法
defineExpose({
  open
})

// 模糊 - 通告类型
const sbTypeList = ref([])
// 模糊 - 机型列表
const airplaneList = ref([])
// 直接读取缓存到本地的通告/机型类别列表
airplaneList.value = sbStore.airplaneType
sbTypeList.value = sbStore.sbType

// 查询通告类型
const querySearchSbType = (queryString, cb) => {
  const results = queryString
    ? sbTypeList.value.filter((item) => {
        return item.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1
      })
    : sbTypeList.value
  cb(results)
}

// 查询机型
const querySearchAirplaneType = (queryString, cb) => {
  const results = queryString
    ? airplaneList.value.filter((item) => {
        return item.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1
      })
    : airplaneList.value
  cb(results)
}

// 模糊选择后触发
const handleSelect = (item) => {
  console.log(item.name)
}

const upload = ref()
// 上传第二个文件自动替换第一个
const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  upload.value.handleStart(file)
}

const handleSuccess = () => {
  console.log('成功')
}
const handleError = () => {
  console.log('错误')
}

// 提交预校验
const formRef = ref()
// 校验规则
const rules = {
  sb_type: [
    { required: true, message: '请输入通告类型', trigger: 'blur' },
    { min: 2, message: '通告类型最小2个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z\s\p{Script=Han}]+$/u, message: '[字母/汉字/空格]', trigger: 'blur' }
  ],
  sb_number: [
    { required: true, message: '请输入通告号', trigger: 'blur' },
    { min: 2, message: '通告号长度不匹配', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9\s-]+$/, message: '[数字/字母/空格/短横线]', trigger: 'blur' }
  ],
  sb_airplane: [
    { required: true, message: '请输入适用机型', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (
          !['其它', 'CAD通用', 'S-92A', 'S-76C', 'BELL407', 'H125', 'A109S', 'BELL505', 'BELL429', 'BELL412', 'H135', 'H145', '卡32'].includes(value)
        ) {
          callback(new Error('[选择下拉菜单]'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  sb_title: [{ required: true, message: '请输入通告标题', trigger: 'blur' }],
  sb_receive_date: [{ required: true, message: '请输入接收日期', trigger: 'blur' }],
  sb_final_date: [{ required: true, message: '请输入评估时限', trigger: 'blur' }],
  sb_remain_days: [{ required: true, message: '请输入评估预警', trigger: 'blur' }],
  sb_eval_people: [
    { required: true, message: '请输入评估人', trigger: 'blur' },
    { pattern: new RegExp('^[\\p{Script=Han}\\p{P}]+$', 'u'), message: '[中文/标点]不允许空格', trigger: 'blur' }
  ]
}
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑' : '添加'" width="30%">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" class="el_form_box">
      <el-form-item label="通告类型" prop="sb_type">
        <el-autocomplete
          style="width: 100%"
          v-model="formModel.sb_type"
          value-key="name"
          :fetch-suggestions="querySearchSbType"
          :trigger-on-focus="false"
          clearable
          placeholder="输入通告类型"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item label="通告号" prop="sb_number">
        <el-input v-model="formModel.sb_number" placeholder="输入通告号" minlength="1" maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="适用机型" prop="sb_airplane">
        <el-autocomplete
          style="width: 100%"
          v-model="formModel.sb_airplane"
          value-key="name"
          :fetch-suggestions="querySearchAirplaneType"
          :trigger-on-focus="false"
          clearable
          placeholder="输入机型"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item label="通告标题" prop="sb_title">
        <el-input v-model="formModel.sb_title" placeholder="输入通告标题" minlength="1"></el-input>
      </el-form-item>
      <el-form-item label="接收日期" prop="sb_receive_date">
        <el-date-picker style="width: 100%" v-model="formModel.sb_receive_date" type="date" format="YYYY/MM/DD" placeholder="选择日期" clearable />
      </el-form-item>
      <el-form-item label="评估时限" prop="sb_final_date">
        <el-date-picker style="width: 100%" v-model="formModel.sb_final_date" type="date" format="YYYY/MM/DD" placeholder="选择日期" clearable />
      </el-form-item>
      <el-form-item label="预警" prop="sb_remain_days">
        <el-input v-model="formModel.sb_remain_days" placeholder="自动生成" minlength="1" maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="评估人" prop="sb_eval_people">
        <el-input v-model="formModel.sb_eval_people" placeholder="输入评估人" minlength="1" maxlength="15"></el-input>
      </el-form-item>
      <!-- 
        drag允许拖拽
        limit只允许上传一个文件
        on-exceed超出一个文件处理逻辑
        data上传附带的参数
       -->
      <el-upload
        class="upload-demo"
        ref="upload"
        :limit="1"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :data="{ sb_number: formModel.sb_number }"
        drag
        action="/api/upload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :headers="headers"
        :with-credentials="true"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖动附件到此处 <em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip" style="color: red">只允许上传pdf文件</div>
        </template>
      </el-upload>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="onSubmit" type="primary"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.el_form_box {
  padding-right: 30px;

  .upload-demo {
    margin: 0 auto;
    padding-left: 30px;
  }
}
</style>
