<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-5 p-2 p-md-0">
                <div class="card border-0">
                    <div class="card-body">
                        <h2 class="card-title h4 fw-bold">{{ task.name }}</h2>
                        <p class="card-text my-2">{{ task.description }}</p>
                        <div class="border-start border-w-3 my-3" :class="{'border-success': task.completed, 'border-warning': !task.completed}">
                            <p class="card-text my-1 px-2">Phases: {{ task.id }}</p>
                            <p class="card-text my-1 px-2 text-success" v-if="task.completed">Task is Completed</p>
                            <p class="card-text my-1 px-2 text-warning" v-if="!task.completed">Task in Progress</p>
                        </div>
                        <p class="text-sm my-2">Start Date: {{ task.start_date }}</p>
                        <p class="text-sm my-2">End Date: {{ task.end_date }}</p>
                        <p class="text-sm my-2">Last updated: {{ task.updated_at }}</p>
                        
                        <div class="my-3">
                            <p class="text-sm my-0">By: {{ user.name }}</p>
                            <p class="text-sm my-0">Created: {{ task.created_at }}</p>
                        </div>
                        <p class="my-0">
                            <button class="btn btn-sm btn-outline-secondary text-sm" @click="task.config=!task.config">
                                Settigns
                            </button>
                        </p>
                        <div class="btn-group mt-3" v-if="task.config">
                            <button class="btn btn-sm border-0 btn-danger" data-bs-toggle="modal" data-bs-target="#destroyTaskModal">
                                <span class="fa fa-trash"></span> Remove
                            </button>
                            <button class="btn btn-sm border-0 btn-info px-3" @click="showEdit" data-bs-toggle="modal" data-bs-target="#editTaskModal">
                                <span class="fa fa-trash"></span> edit
                            </button>
                            <button class="btn btn-sm border-0" :class="{'btn-success': !task.completed, 'btn-warning': task.completed}" @click="completed">
                                <span v-if="task.completed"><span class="fa fa-paper-plane"></span> Roll Back </span>
                                <span v-if="!task.completed"><span class="fa fa-paper-plane"></span> complete </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Taks Phases Utils to show phases in list format -->
            <phases-component />
        </div>
    </div>

    <!-- task edit and update static backdrop modal-->
    <div class="modal fade" id="editTaskModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editTaskModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editTaskModalLabel">Task Update</h5>
                    <button type="button" id="dismissEditTaskModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="updateTask" action="#" method="post">
                        <div class="mb-4">
                            <label for="name" class="form-label">Task Name</label>
                            <textarea class="form-control ip-1 bg-light" v-model="edit.name"></textarea>
                        </div>
                        <div class="mb-4">
                            <label for="description" class="form-label">Task Description - optional</label>
                            <textarea class="form-control ip-1 bg-light" rows="3" v-model="edit.description"></textarea>
                        </div>
                        <div class="mb-4">
                            <label for="description" class="form-label">End Date</label>
                            <input type="date" class="form-control" v-model="edit.end_date">
                        </div>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn btn-success">update task</button>
                        </div>
                        <p class="text-center text-danger mb-0 mt-3" v-if="edit.error">{{ edit.error }}</p>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Task Deletion confirmation modal-->
    <div class="modal fade" id="destroyTaskModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="destroyTaskModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="destroyTaskModalLabel">Confirm Delete</h5>
                    <button type="button" id="dismissDestroyTaskModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                   <h5 class="h5 text-center">Are you sure you want yo delete this Task</h5>
                   <p class="text-center"> this task contains phases which has your todos categorized in order. your data will be deleted permanently</p>
                   <div class="row justify-content-center">
                       <div class="btn-group col">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">cancel</button>
                        <button class="btn btn-danger" @click="destroy_task">confirm delete</button>
                    </div>
                   </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import { computed, reactive } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import { notify } from '@kyvg/vue3-notification'
import PhasesComponent from '../phases/phases.vue'
export default {
    components: { PhasesComponent },
    setup() {
        const route = useRoute()
        const store = useStore()

        const task = reactive({
            loading: true,
            config: false,
            id: route.params.id,
            name: '',
            description: '',
            completed: false,
            start_date: '',
            end_date: '',
            created_at: '',
            updated_at: ''
        })
        
        const get_tasks = async()=> {
            try {
                const id = route.params.id
                const { data } = await axios.get('/tasks/'+ id)
                task.name = data.name
                task.description = data.description
                task.completed = data.completed
                task.start_date = data.start_date
                task.end_date = data.end_date
                task.created_at = data.created_at
                task.updated_at = data.updated_at
                task.loading = false
            } catch (error) {
                task.loading = false
                const errorMessage = error.response? error.response.data.message :error.message
                notify({
                    title: 'Task Error',
                    text: errorMessage,
                    type: 'warn'
                })
            }
        }

        /** delete task with all of its data || delete all children from database */
        const router = useRouter()
        const destroy_task = async ()=>{
            try {
                const id = route.params.id
                const { data } = await axios.delete('/tasks/'+ id)
                notify({
                    title: 'Task Deleted',
                    text: data.message,
                    type: 'warn'
                })
                document.querySelector("#dismissDestroyTaskModal").click()
                router.push({ name: 'Home' })
            } catch (error) {
                const errorMessage = error.response? error.response.data.message :error.message
                notify({
                    title: 'Task Error',
                    text: errorMessage,
                    type: 'warn'
                })
            }
        }

        /** Change The Tasks Status to be Pending || completed */
        const completed = async ()=>{
            try {
                const id = route.params.id
                const completed = !task.completed
                const { data } = await axios.put('/tasks/completed/'+ id, { completed: completed  })
                task.completed = data.completed
                notify({
                    title: 'Taks Completed',
                    text: data.message,
                    type: 'success'
                })
            } catch (error) {
                const errorMessage = error.response? error.response.data.message :error.message
                notify({
                    title: 'Taks Error',
                    text: errorMessage,
                    type: 'warn'
                })
            }
        }

        /** Activate the Edit modal and assign current data to Be Updated */
        const edit = reactive({
            name: '',
            description: '',
            end_date: '',
            error: ''
        })
        const showEdit = ()=> {
            edit.name = task.name
            edit.description = task.description
            edit.end_date = task.end_date
        }
        const updateTask = async()=> {
            try {
                const inputData = { name: edit.name, description: edit.description, end_date: edit.end_date }
                const id = route.params.id
                const { data } = await axios.put('/tasks/'+id, inputData)
                get_tasks()
                document.querySelector("#dismissEditTaskModal").click()
                notify({
                    title: 'Taks Update Success',
                    text: data.message,
                    type: 'success'
                })
            } catch (error) {
                const errorMessage = error.response? error.response.data.message :error.message
                edit.error = errorMessage
                notify({
                    title: 'Taks Update Error',
                    text: errorMessage,
                    type: 'warn'
                })
            }
        }

        onMounted(()=> get_tasks())
        const user = computed(()=> store.getters.user)
        return { user, task, destroy_task, completed, edit, showEdit, updateTask }
    }
}
</script>