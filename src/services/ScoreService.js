import axiosIns from "@/plugins/axios"
import GenericService from "./GenericService"



class ScoreService extends GenericService
{
  constructor() {
    super()
  }

  async getAllByJudgeId(judgeId) {
    return axiosIns.get(this.baseUrl + '/all/byJudgeId/' + judgeId)
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err)
          
        return this.fail(err.response?.data)
      })
  }

}


export default ScoreService

