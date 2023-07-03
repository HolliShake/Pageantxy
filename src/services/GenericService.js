import axiosIns from "@/plugins/axios"
import useSnackBar from "@/stores/snackbar.store"


const ResultType = Object.freeze({
  SUCCESS: 0,
  FAIL: 1,
})

class Result {

  constructor(type, data) {
    this.SUCCESS = (type == ResultType.SUCCESS)
    this.FAIL = (type == ResultType.FAIL)
    this.data = data  
  }
    
  toString() {
    return `${this.constructor.name}(type: ${this.type}, data: ${this.data}))`
  }
}

class GenericService {

  constructor() {
    this.context = this.constructor.name.replace('Service', '')
    this.baseUrl = `/api/${this.context}`
  }
    
  async getAll() {
    return axiosIns.get(this.baseUrl + '/all')
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err)
          
        return this.fail(err.response?.data)
      })
  }
    
  async getById(id) {
    return axiosIns.get(this.baseUrl + `/${id}`)
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err)  
          
        return this.fail(err.response?.data)
      })
  }
    
  async create(payload) {
    const snackbar = useSnackBar()

    return axiosIns.post(this.baseUrl + '/create', payload)
      .then(res => { 
        snackbar.showMessage('success', `${this.context.toLowerCase()} was created successfuly!`)

        return this.success(res.data)
      })
      .catch(err => {
        snackbar.showMessage('error', `Something went wrong while creating ${this.context.toLowerCase()}!`)
        console.error(err)  
          
        return this.fail(err.response?.data)
      })
  }
    
  async update(id, payload) {
    const snackbar = useSnackBar()

    return axiosIns.put(this.baseUrl + `/update/${id}`, payload)
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

  async delete(id) {
    const snackbar = useSnackBar()

    return axiosIns.delete(this.baseUrl + `/delete/${id}`)
      .then(res => { 
        snackbar.showMessage('success', `${this.context.toLowerCase()} was deleted successfuly!`)

        return this.success(res.data)
      })
      .catch(err => {
        snackbar.showMessage('error', `Something went wrong while deleting ${this.context.toLowerCase()}!`)
        console.error(err)  
          
        return this.fail(err.response?.data)
      })
  }

  success(data) {
    return new Result(ResultType.SUCCESS, data)
  }
    
  fail(data) {
    return new Result(ResultType.FAIL, data)
  }
}

export default GenericService

