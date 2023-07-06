
import { HubConnectionBuilder } from '@microsoft/signalr'

function resolve() 
{
  return localStorage.getItem("accessToken") ?? ''
}

class SignalRService {

  constructor(url) {
    this.client = new HubConnectionBuilder()
      .withUrl(url, { accessTokenFactory: () => resolve() } )

    // .configureLogging("debug")
      .build()

    this.client.onclose(() => console.log("SignalR connection closed!"))
  }

  listen(event, callback) {
    this.client.on(event, callback)
  }

  async send(event, data) {
    if (this.client.state != "Connected") return

    if (!data)
      
      return await this.client.invoke(event)
    
    return await this.client.invoke(event, data)
  }

  async start() {
    console.log("SignalR connection starting...")
    
    return this.client?.start()
      .then(state => {
        console.log("SignalR connected!")

        return state
      })
      .catch(err => {
        console.error("SignalR error!")

        return err
      })
  }

  async stop() {
    return this.client?.stop()
  }

}


export default SignalRService
