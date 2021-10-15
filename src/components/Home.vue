<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-6 col-lg-4" v-for="task in tasks.data" :key="task.id">
                <router-link class="card h-100 border-0 text-decoration-none text-secondary shadow-sm" :to="{ name: 'TaskShow', params: { id: task.id }}">
                    <div class="card-body">
                        <h2 class="card-title h4">{{ task.name }}</h2>
                        <p class="card-text my-1">{{ task.description }}</p>
                        <div class="my-2 border-start border-warning border-w-4 ps-2">
                            <p class="card-text text-sm mb-1">Phases: {{ task.id }}</p>
                            <p class="card-text text-sm text-success my-0" v-if="task.completed"> Task Completed</p>
                            <p class="card-text text-sm text-danger my-0" v-if="!task.completed"> Task in Progress</p>
                        </div>
                        <p class="card-text text-sm my-1">Created: {{ task.created_at }}</p>
                        <p class="card-text text-sm my-1">Last updated: {{ task.updated_at }}</p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import axios from 'axios'
export default {
    name: "Home",
    setup() {
        
        const tasks = reactive({
            loading: true,
            data: []
        })

        const getTasks = async ()=> {
            try {
                const { data } = await axios.get('/tasks')
                tasks.data = data
                tasks.loading = false
            } catch (error) {
                const errorMessage = error.response? error.response.data.message :error.message
                console.log(errorMessage)
            }
        }

        onMounted(()=> getTasks())

        return { tasks }
    }
}
</script>