import axiosIns from "@/plugins/axios"
import GenericService from "./GenericService"




class UserService extends GenericService
{
  constructor() {
    super()
  }

  async verify(userId)
  {
    return axiosIns.put(this.baseUrl + `/verify/${userId}`)
      .then(res => {
        return this.success(res.data)
      })
      .catch(err => {
        console.error(err)  
          
        return this.fail(err.response?.data)
      })
  }
}

export default UserService
