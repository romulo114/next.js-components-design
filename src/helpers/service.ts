export class HttpClient {

  constructor(private baseUrl: string, private apiKey: string) { }

  private getHeaders(form: boolean = false) {
    return {
      'x-api-key': this.apiKey,
      'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json'
    }
  }

  async get(url: string, params: string) {
    return fetch(this.baseUrl + url + '?' + params, {
      headers: this.getHeaders(),
      method: 'GET'
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json()
      } else {
        throw Error(`${response.status}: ${response.statusText}`)
      }
    })
  }

  async post(url: string, body: any) {
    const data = new URLSearchParams()
    for (const key in body) {
      data.append(key, body[key])
    }
    return fetch(this.baseUrl + url, {
      headers: this.getHeaders(true),
      method: 'POST',
      body: data
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json()
      } else {
        throw Error(`${response.status}: ${response.statusText}`)
      }
    })
  }
}
