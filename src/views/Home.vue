<template>
  <div class="home-container">
    <section class="hero-section">
      <div class="hero-content">
        <h1>MCP Registry</h1>
        <p>Supporting standardized integration, building intelligent application ecosystems with dynamic registration and smart integration - MCP Registry</p>
      </div>
    </section>
    
    <section class="servers-section">
      <div class="section-header">
        <h2>Popular MCP Servers</h2>
        <span>{{ servers.length }} servers</span>
      </div>
      
      <el-row :gutter="20" v-loading="loading">
        <el-col 
          v-for="server in servers" 
          :key="server.id" 
          :xs="24" 
          :sm="12" 
          :md="8" 
          :lg="6" 
          :xl="6"
        >
          <server-card :server="server" />
        </el-col>
      </el-row>
      
      <!-- Cursor-based pagination controls -->
      <div class="pagination-container" v-if="servers.length > 0">
        <el-button 
          @click="goToPreviousPage" 
          :disabled="!canGoPrevious || loading"
          :icon="ArrowLeft"
          size="large"
        >
          Previous
        </el-button>
        
        <div class="page-info">
          <span>Page {{ currentPageNumber }}</span>
          <span v-if="servers.length > 0" class="server-count">
            ({{ servers.length }} servers)
          </span>
        </div>
        
        <el-button 
          @click="goToNextPage" 
          :disabled="!hasNextPage || loading"
          :icon="ArrowRight"
          size="large"
        >
          Next
        </el-button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useServersStore } from '../stores/servers'
import ServerCard from '../components/ServerCard.vue'

const store = useServersStore()
const loading = computed(() => store.loading)
const servers = computed(() => store.servers)
const hasNextPage = computed(() => store.hasNextPage)

const currentPageNumber = ref(1)
const pageSize = ref(20)
const cursors = ref([null]) // Track cursors: [null, cursor1, cursor2, ...]

const canGoPrevious = computed(() => currentPageNumber.value > 1)

const fetchServers = async (cursor = null) => {
  await store.fetchServers(pageSize.value, cursor)
}

const goToNextPage = async () => {
  if (!hasNextPage.value || loading.value) return
  
  // Add next cursor to our tracking array
  cursors.value.push(store.nextCursor)
  currentPageNumber.value++
  
  await fetchServers(store.nextCursor)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToPreviousPage = async () => {
  if (!canGoPrevious.value || loading.value) return
  
  // Remove current page cursor and go back
  cursors.value.pop()
  currentPageNumber.value--
  
  const previousCursor = cursors.value[cursors.value.length - 1]
  await fetchServers(previousCursor)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  try {
    currentPageNumber.value = 1
    cursors.value = [null] // Reset cursor tracking
    await fetchServers(null) // First page, no cursor
  } catch (error) {
    console.error('Failed to load servers:', error)
  }
})
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
}

.hero-section {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto;
  }
}

.servers-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    h2 {
      font-size: 1.8rem;
      font-weight: 600;
    }
    
    span {
      color: #666;
      font-size: 1rem;
    }
  }
}

.pagination-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  
  .page-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #666;
    
    .server-count {
      font-size: 0.9rem;
      color: #999;
    }
  }
}

@media (max-width: 768px) {
  .pagination-container {
    gap: 1rem;
    
    .page-info {
      font-size: 0.9rem;
    }
    
    .el-button {
      padding: 8px 16px;
    }
  }
}
</style>
