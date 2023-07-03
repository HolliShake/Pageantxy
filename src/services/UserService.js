import axiosIns from "@/plugins/axios"
import useSnackBar from "@/stores/snackbar.store"
import GenericService from "./GenericService"




class UserService extends GenericService
{
  constructor() {
    super()
  }

  async verify(userId)
  {
    const snackbar = useSnackBar()

    return axiosIns.put(this.baseUrl + `/verify/${userId}`)
      .then(res => {
        snackbar.showMessage('success', `${this.context.toLowerCase()} was updated successfuly!`)

        return this.success(res.data)
      })
      .catch(err => {
        snackbar.showMessage('error', `Something went wrong while updating ${this.context.toLowerCase()}!`)
        console.error(err)  
          
        return this.fail(err.response?.data)
      })
  }
}

export default UserService
