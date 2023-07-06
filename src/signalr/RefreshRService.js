import SignalRService from "./SignalRService"


class RefreshRService extends SignalRService
{
  constructor() { 
    super(`${import.meta.env.VITE_APP_APP_URL}/api/refreshhub`)
  }
}

export default RefreshRService
