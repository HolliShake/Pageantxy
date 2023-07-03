import { defineStore } from "pinia"




const useSnackBar = defineStore('SnackBar', {
  state: () => ({
    isVisible: false,
    message: 'This is snackbar!',
    color: 'success',
  }),
    
  getters: {
    getIcon() { 
      switch (this.color) {
      case 'primary':
      case 'success':
        return 'tabler-circle-check-filled'
      case 'error':
        return 'tabler-circle-x-filled'
      case 'warning':
        return 'tabler-alert-triangle-filled'
      default:
        return 'tabler-settings'
      }
    },
  },
    
  actions: {
      
    async showMessage(color, message) {
      this.isVisible = true
      this.message = message
      this.color = color
    },
      
  },
})

export default useSnackBar
