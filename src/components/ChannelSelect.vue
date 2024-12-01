<script setup>
import { getSbTypeService, getAirplaneTypeService } from '@/api/apartment'
import { ref } from 'vue'
import { useSbStore } from '@/stores/index'

// 存储通告类型对象数组列表
const sbStore = useSbStore()
const props = defineProps({
  modelValue: {
    type: [Number, String],
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'], newValue)

const channelList = ref([])
const getSbType = async () => {
  let res
  if (props.type === 'sb_type') {
    res = await getSbTypeService()
    sbStore.setSbType(res.data) // 存储到本地防止频繁请求后台
  } else if (props.type === 'sb_airplane') {
    res = await getAirplaneTypeService()
    sbStore.setAirplaneType(res.data) // 存储到本地防止频繁请求后台
  }
  channelList.value = res.data
}
getSbType()
</script>

<template>
  <el-select style="width: 140px" :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)">
    <el-option v-for="(channel, index) in channelList" :key="index" :label="channel" :value="channel"></el-option>
  </el-select>
</template>
