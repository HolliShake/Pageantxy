import axiosIns from "@/plugins/axios"
import GenericService from "./GenericService"
import useSnackBar from "@/stores/snackbar.store"



class FileService extends GenericService
{
  constructor() { 
    super()
  }
    
  async upload(payload)
  {
    const snackbar = useSnackBar
    
    return axiosIns.post(this.baseUrl + '/upload', payload)
      .then(res => {
        this.snackbar.showMessage('success', `${this.context.toLowerCase()} uploaded!`)

        return this.success(res.data)
      })
      .catch(err => {
        console.error(err)  
        
        return this.fail(err.response?.data)
      })
  }
}

export default FileService
