import axiosIns from "@/plugins/axios"
import GenericService from "./GenericService"



class FileService extends GenericService
{
  constructor() { 
    super()
  }
    
  async upload(payload)
  {
    return axiosIns.post(this.baseUrl + '/upload', payload)
      .then(res => {
        return this.success(res.data)
      })
      .catch(err => {
        console.error(err)  
        
        return this.fail(err.response?.data)
      })
  }
}

export default FileService
