import { defineStore } from 'pinia'
import api from '../services/api'

export const useServersStore = defineStore('servers', {
  state: () => ({
    servers: [],
    currentServer: null,
    loading: false,
    error: null,
    totalCount: 0,
    nextPage: null
  }),
  
  getters: {
    getServerById: (state) => (id) => {
      return state.servers.find(server => server.id === id) || null
    }
  },
  
  actions: {
    async fetchServers(limit = 50, offset = 0) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.getServers({ limit, offset })
        this.servers = response.data.servers
        this.totalCount = response.data.total_count
        this.nextPage = response.data.next
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch server list'
        console.error('Error fetching servers:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchServerDetail(id, version = null) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.getServerDetail(id, version)
        this.currentServer = response.data
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch server details'
        console.error(`Error fetching server ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async searchServers(query, limit = 50, offset = 0) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.searchServers(query, limit, offset)
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to search servers'
        console.error('Error searching servers:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    clearCurrentServer() {
      this.currentServer = null
    }
  }
})
