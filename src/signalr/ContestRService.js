import SignalRService from "./SignalRService"



class ContestRService extends SignalRService {
  constructor() {
    super(`${import.meta.env.VITE_APP_APP_URL}/api/contesthub`)
  }
}

export default ContestRService
