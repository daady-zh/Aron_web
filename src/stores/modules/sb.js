import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useSbStore = defineStore(
  'sb',
  () => {
    const sbType = ref([])
    const airplaneType = ref([])

    // 设置sbType
    const setSbType = (newSbType) => {
      sbType.value = newSbType
    }

    // 设置airplaneType
    const setAirplaneType = (newValue) => {
      airplaneType.value = newValue
    }

    return {
      sbType,
      setSbType,
      setAirplaneType,
      airplaneType
    }
  },
  {
    persist: true
  }
)
