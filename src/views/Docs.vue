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
[ec2-user@ip-10-195-218-187 mcpx-ui]$ cat src/views/Docs.vue
<template>
  <div class="docs-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="docs-sidebar">
          <h3>Documentation Navigation</h3>
          <el-menu
            :default-active="activeSection"
            class="docs-menu"
            @select="scrollToSection"
          >
            <el-menu-item index="overview">Overview</el-menu-item>
            <el-menu-item index="api">API Reference</el-menu-item>
            <el-menu-item index="server-json">Server JSON Format</el-menu-item>
            <el-menu-item index="publishing">Publishing Servers</el-menu-item>
            <el-menu-item index="faq">FAQ</el-menu-item>
          </el-menu>
          
          <div class="external-links">
            <h4>External Links</h4>
            <ul>
              <li>
                <a href="https://github.com/gss2002/mcpx-ui" target="_blank">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://github.com/gss2002/mcpx-ui/issues" target="_blank">
                  Issue Tracker
                </a>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      
      <el-col :span="18">
        <div class="docs-content">
          <section id="overview" class="docs-section">
            <h2>Overview</h2>
            <p>MCP Registry is a community-driven registry for Model Context Protocol (MCP) servers. It provides a centralized repository for discovering and managing various MCP implementations and their associated metadata, configuration, and capabilities.</p>
            
            <h3>Key Features</h3>
            <ul>
              <li>RESTful API for managing MCP registry entries (list, get, create, update, delete)</li>
              <li>Health check endpoints for service monitoring</li>
              <li>Support for various environment configurations</li>
              <li>Graceful shutdown handling</li>
              <li>MongoDB and in-memory database support</li>
              <li>Comprehensive API documentation</li>
              <li>Pagination support for listing registry entries</li>
            </ul>
          </section>
          
          <section id="api" class="docs-section">
            <h2>API Reference</h2>
            <p>MCP Registry provides a RESTful API for interacting with the registry. The following are the main API endpoints:</p>
            
            <h3>Get Server List</h3>
            <el-card class="api-card">
              <div class="api-method">GET</div>
              <div class="api-path">/v0/servers</div>
              <p>Returns a list of all registered MCP servers.</p>
              
              <h4>Parameters</h4>
              <el-table :data="listServersParams" style="width: 100%">
                <el-table-column prop="name" label="Name" width="120" />
                <el-table-column prop="type" label="Type" width="120" />
                <el-table-column prop="description" label="Description" />
              </el-table>
              
              <h4>Response Example</h4>
              <pre><code>{
  "servers": [
    {
      "id": "a5e8a7f0-d4e4-4a1d-b12f-2896a23fd4f1",
      "name": "@modelcontextprotocol/servers/src/filesystem",
      "description": "Node.js server implementing Model Context Protocol (MCP) for filesystem operations.",
      "repository": {
        "url": "https://github.com/modelcontextprotocol/servers",
        "source": "github",
        "id": "b94b5f7e-c7c6-d760-2c78-a5e9b8a5b8c9"
      },
      "version_detail": {
        "version": "1.0.2",
        "release_date": "2023-06-15T10:30:00Z",
        "is_latest": true
      }
    }
  ],
  "total_count": 1
}</code></pre>
            </el-card>
            
            <h3>Get Server Details</h3>
            <el-card class="api-card">
              <div class="api-method">GET</div>
              <div class="api-path">/v0/servers/{id}</div>
              <p>Returns detailed information for a specific MCP server.</p>
              
              <h4>Parameters</h4>
              <el-table :data="getServerParams" style="width: 100%">
                <el-table-column prop="name" label="Name" width="120" />
                <el-table-column prop="type" label="Type" width="120" />
                <el-table-column prop="description" label="Description" />
              </el-table>
            </el-card>
          </section>
          
          <section id="server-json" class="docs-section">
            <h2>Server JSON Format</h2>
            <p>MCP servers are represented using a standardized JSON format in the registry. The following are the main data structures:</p>
            
            <h3>Server</h3>
            <p>Represents basic server information.</p>
            <pre><code>{
  "id": "a5e8a7f0-d4e4-4a1d-b12f-2896a23fd4f1",
  "name": "@modelcontextprotocol/servers/src/filesystem",
  "description": "Node.js server implementing Model Context Protocol (MCP) for filesystem operations.",
  "repository": {
    "url": "https://github.com/modelcontextprotocol/servers",
    "source": "github",
    "id": "b94b5f7e-c7c6-d760-2c78-a5e9b8a5b8c9"
  },
  "version_detail": {
    "version": "1.0.2",
    "release_date": "2023-06-15T10:30:00Z",
    "is_latest": true
  }
}</code></pre>
            
            <h3>ServerDetail</h3>
            <p>Contains detailed server information, including packages and remote connection endpoints.</p>
          </section>
          
          <section id="publishing" class="docs-section">
            <h2>Publishing Servers</h2>
            <p>To publish an MCP server to the registry, you need to prepare a compliant server JSON file and submit it using the API.</p>
            
            <h3>Publishing Steps</h3>
            <ol>
              <li>Prepare the server JSON file</li>
              <li>Validate that the JSON format complies with the specification</li>
              <li>Submit the server information using the API</li>
              <li>Verify that the server has been successfully published</li>
            </ol>
          </section>
          
          <section id="faq" class="docs-section">
            <h2>Frequently Asked Questions</h2>
            
            <el-collapse>
              <el-collapse-item title="What is MCP?" name="1">
                <p>Model Context Protocol (MCP) is a standardized protocol for communication between models and contexts. It allows models to access external tools, data, and services, thereby enhancing their capabilities.</p>
              </el-collapse-item>
              
              <el-collapse-item title="How can I contribute to the MCP Registry project?" name="2">
                <p>You can contribute in the following ways:</p>
                <ul>
                  <li>Submit issues and feature requests</li>
                  <li>Submit pull requests with code improvements</li>
                  <li>Improve documentation</li>
                  <li>Share and promote the project</li>
                </ul>
                <p>For detailed information, please refer to the <a href="https://github.com/gss2002/mcpx-ui/README.md" target="_blank">Contributing Guide</a>.</p>
              </el-collapse-item>
              
              <el-collapse-item title="How do I report issues?" name="3">
                <p>If you find issues or have suggestions for improvements, please submit them on the <a href="https://github.com/mcpx-ui/issues" target="_blank">GitHub Issues</a> page.</p>
              </el-collapse-item>
            </el-collapse>
          </section>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('overview')
const sections = ['overview', 'api', 'server-json', 'publishing', 'faq']

const listServersParams = [
  {
    name: 'limit',
    type: 'Integer',
    description: 'Number of results per page (maximum 5000)'
  },
  {
    name: 'offset',
    type: 'Integer',
    description: 'Number of results to skip for pagination'
  }
]

const getServerParams = [
  {
    name: 'id',
    type: 'String',
    description: 'Unique ID of the server'
  },
  {
    name: 'version',
    type: 'String',
    description: 'Desired MCP server version (optional)'
  }
]

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleScroll = () => {
  for (const section of sections) {
    const element = document.getElementById(section)
    if (!element) continue
    
    const rect = element.getBoundingClientRect()
    if (rect.top <= 100 && rect.bottom >= 100) {
      activeSection.value = section
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.docs-container {
  display: flex;
  min-height: calc(100vh - 200px);
}

.docs-sidebar {
  position: sticky;
  top: 100px;
  height: calc(100vh - 150px);
  padding-right: 1rem;
  
  h3 {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
  }
}

.docs-menu {
  border-right: none;
}

.external-links {
  margin-top: 2rem;
  
  h4 {
    margin-bottom: 0.5rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      margin-bottom: 0.5rem;
      
      a {
        color: var(--primary-color);
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.docs-content {
  padding-left: 1rem;
}

.docs-section {
  margin-bottom: 3rem;
  
  h2 {
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  h3 {
    margin: 1.5rem 0 1rem;
  }
  
  p, ul, ol {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  ul, ol {
    padding-left: 1.5rem;
  }
}

.api-card {
  margin-bottom: 1.5rem;
  
  .api-method {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: #67c23a;
    color: white;
    border-radius: 4px;
    font-weight: bold;
    margin-right: 0.5rem;
  }
  
  .api-path {
    display: inline-block;
    font-family: monospace;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  
  h4 {
    margin: 1rem 0 0.5rem;
  }
  
  pre {
    background-color: #f5f7fa;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    
    code {
      font-family: monospace;
    }
  }
}
</style>
