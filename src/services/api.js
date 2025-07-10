import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

export default {
  // 获取服务器列表
  getServers(params = {}) {
    return apiClient.get('/servers', { params })
  },
  
  // 获取服务器详情
  getServerDetail(id, version = null) {
    const params = version ? { version } : {}
    return apiClient.get(`/servers/${id}`, { params })
  },
  
  // 搜索服务器
  searchServers(query, limit = 50, offset = 0) {
    return apiClient.get('/servers', {
      params: {
        q: query,
        limit,
        offset
      }
    })
  }
}