import FileService from "@/services/FileService"
import { defineStore } from "pinia"
import action from "./action"


const fileService = new FileService()

const useFileStore = defineStore('FileStore', {

  actions: {
      
    async uploadFile(file) { 
      let formData = new FormData()
      formData.append('file', file)
          
      return action(await fileService.upload(formData))
    },
      
  },


})

export default useFileStore
