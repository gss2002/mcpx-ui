import { defineStore } from 'pinia'
import api from '../services/api'

export const useServersStore = defineStore('servers', {
  state: () => ({
    servers: [],
    currentServer: null,
    loading: false,
    error: null,
    nextCursor: null,
    hasNextPage: false,
    currentPageData: null
  }),
  
  getters: {
    getServerById: (state) => (id) => {
      return state.servers.find(server => server.id === id) || null
    }
  },
  
  actions: {
    async fetchServers(limit = 20, cursor = null) {
      this.loading = true
      this.error = null
      
      try {
        // Your API uses cursor-based pagination
        const params = { limit }
        if (cursor) {
          params.cursor = cursor
        }
        
        const response = await api.getServers(params)
        
        this.servers = response.data.servers || []
        this.nextCursor = response.data.metadata?.next_cursor
        this.hasNextPage = !!this.nextCursor
        this.currentPageData = response.data.metadata
        
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
    
    async searchServers(query, limit = 20, cursor = null) {
      this.loading = true
      this.error = null
      
      try {
        // Check if search also uses cursor-based pagination
        const params = { search: query, limit }
        if (cursor) {
          params.cursor = cursor
        }
        
        const response = await api.getServers(params) // Use getServers instead of searchServers
        
        this.servers = response.data.servers || []
        this.nextCursor = response.data.metadata?.next_cursor
        this.hasNextPage = !!this.nextCursor
        this.currentPageData = response.data.metadata
        
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
