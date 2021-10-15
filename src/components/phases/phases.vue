<template>
    <div class="col-12 col-md-7 p-2 py-md-0 px-md-3">
        <div class="d-flex justify-content-between align-items-center p-2 mb-2">
            <h2 class="h4 my-auto fw-bold">Task Phases</h2>
            <button class="btn btn-success border-0 btn-sm" data-bs-toggle="modal" data-bs-target="#createPhaseModal">New Phase</button>
        </div>

        <div v-for="phase in phases.data" :key="phase.id">
            <div class="card mb-3 border-0" v-if="!phases.show">
                <div class="card-body p-2">
                    <h5 class="card-tilte my-1 h5"><span class="fw-bold">Phase: </span>{{ phase.name }}</h5>
                    <p class="card-text my-0">{{ phase.description }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="text-sm my-auto">Last Updated: {{ phase.updated_at }}</p>
                        <button class="btn btn-outline-success border-0 btn-sm text-sm" @click="choosePhase(phase.id)">Todos</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mb-3 border-0" v-if="phases.show">
            <div class="card-body p-2">
                <h5 class="card-tilte my-1 h5"><span class="fw-bold">Phase: </span> {{ phases.active.name }}</h5>
                <p class="card-text my-0">{{ phases.active.description }}</p>
                <p class="text-sm my-auto mb-2">Last Updated: {{ phases.active.updated_at }}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                        <button class="btn btn-outline-danger btn-sm text-sm" data-bs-toggle="modal" data-bs-target="#destroyPhaseModal">Remove</button>
                        <button class="btn btn-outline-warning btn-sm text-sm" data-bs-toggle="modal" data-bs-target="#editPhaseModal" @click="editPhaseActive">edit</button>
                    </div>
                    <button class="btn btn-outline-secondary border-0 btn-sm text-sm" @click="choosePhase(phases.active.id)">Hide</button>
                </div>
            </div>
        </div>
        
    </div>
    
    <!-- create task modal with static backdrop -->
    <div class="modal fade" id="createPhaseModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="createPhaseModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createPhaseModalLabel">New Phase</h5>
                    <button type="button" id="dismissCreatePhaseModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="createPhase" action="#" method="post">
                        <div class="mb-4">
                            <label for="name" class="form-label">Phase Name</label>
                            <textarea class="form-control ip-1 bg-light" v-model="newPhase.name" placeholder="Phase one of seven ..."></textarea>
                        </div>
                        <div class="mb-4">
                            <label for="description" class="form-label">Phase Description - optional</label>
                            <textarea class="form-control ip-1 bg-light" rows="3" v-model="newPhase.description" placeholder="try describing your phase ..."></textarea>
                        </div>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn btn-success">create phase</button>
                        </div>
                        <p class="text-center text-danger mb-0 mt-3" v-if="newPhase.error">{{ newPhase.error }}</p>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- task edit and update static backdrop modal-->
    <div class="modal fade" id="editPhaseModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editPhaseModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editPhaseModalLabel">Phase Update</h5>
                    <button type="button" id="dismissEditPhaseModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="updatePhase" action="#" method="post">
                        <div class="mb-4">
                            <label for="name" class="form-label">Phase Name</label>
                            <textarea class="form-control ip-1 bg-light" v-model="editPhaseInput.name"></textarea>
                        </div>
                        <div class="mb-4">
                            <label for="description" class="form-label">Phase Description - optional</label>
                            <textarea class="form-control ip-1 bg-light" rows="3" v-model="editPhaseInput.description"></textarea>
                        </div>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn btn-success">update phase</button>
                        </div>
                        <p class="text-center text-danger mb-0 mt-3" v-if="editPhaseInput.error">{{ editPhaseInput.error }}</p>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Phase Deletion confirmation modal-->
    <div class="modal fade" id="destroyPhaseModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="destroyPhaseModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="destroyPhaseModalLabel">Confirm Delete</h5>
                    <button type="button" id="dismissDestroyPhaseModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                   <h5 class="h5 text-center">Are you sure you want yo delete this Phase</h5>
                   <p class="text-center"> this phase contains todos which are categorized in order. your data will be deleted permanently</p>
                   <div class="row justify-content-center">
                       <div class="btn-group col">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">cancel</button>
                        <button class="btn btn-danger" @click="destroy_phase">confirm delete</button>
                    </div>
                   </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import { reactive } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { onMounted } from '@vue/runtime-core'
import axios from 'axios'
import { notify } from '@kyvg/vue3-notification'
export default {
    setup() {
        const route = useRoute()

        const phases = reactive({
            loading: true,
            show: false,
            data: [],
            active: {
                id: null,
                name: '',
                description: '',
                created_at: '',
                updated_at: ''
            }
        })

        /** On Mounted get Phases that belongs to the Task and task_id is in params */
        const getPhases = async()=> {
            try {
                phases.data = []
                const task_id = route.params.id
                const { data } = await axios.get('/phases/'+ task_id)
                data.forEach(phase => {
                    phases.data.push(phase)
                })
                phases.loading = false
            } catch (error) {
                phases.loading = false
                const errorMessage = error.response? error.response.data.message :error.message
                notify({
                    title: 'Phase Error',
                    text: errorMessage,
                    type: 'warn'
                })
            }
        }

        /** Choose Phase to be marked active */
        const choosePhase = (phase_id)=> {
            if (phases.active.id == phase_id) {
                phases.show = false
                phases.active.id = null
            }
            else {
                phases.data.map(phase => {
                    if (phase.id != phase_id) return
                    phases.show = true
                    phases.active.id = phase_id
                    phases.active.name = phase.name
                    phases.active.description = phase.description
                    phases.active.created_at = phase.created_at
                    phases.active.updated_at = phase.updated_at
                })
            }
        }

        /** Sending a POST request to create new Task Phase */
        const newPhase = reactive({
            name: '',
            description: '',
            error: ''
        })
        const createPhase = async()=> {
            try {
                const inputData = { name: newPhase.name, description: newPhase.description }
                const task_id = route.params.id
                const { data } = await axios.post('/phases/'+ task_id, inputData)
                await getPhases()
                choosePhase(data.phase_id)
                document.querySelector("#dismissCreatePhaseModal").click()
                notify({
                    title: 'Phase Error',
                    text: data.message,
                    type: 'success'
                })
                newPhase.name = ''
                newPhase.description = ''
                newPhase.error = ''
            } catch (error) {
                phases.loading = false
                const errorMessage = error.response? error.response.data.message :error.message
                newPhase.error = errorMessage
                notify({
                    title: 'Phase Error',
                    text: errorMessage,
                    type: 'warn'
                })
            }
        }

        /** Update Phase  */
        const editPhaseInput = reactive({
            id: '',
            name: '',
            description: '',
            error: ''
        })
        const editPhaseActive = ()=> {
            editPhaseInput.id = phases.active.id
            editPhaseInput.name = phases.active.name
            editPhaseInput.description = phases.active.description
        }
        const updatePhase = async()=> {
            try {
                const inputData = { name: editPhaseInput.name, description: editPhaseInput.description }
                const phase_id = editPhaseInput.id
                const { data } = await axios.put('/phases/'+ phase_id, inputData)
                phases.active.name = inputData.name
                phases.active.description = inputData.description
                await getPhases()
                document.querySelector("#dismissEditPhaseModal").click()
                notify({
                    title: 'Phase Update Success',
                    text: data.message,
                    type: 'success'
                })
            } catch (error) {
                phases.loading = false
                const errorMessage = error.response? error.response.data.message :error.message
                newPhase.error = errorMessage
                notify({
                    title: 'Phase Update Error',
                    text: errorMessage,
                    type: 'warn'
                })
            }
        }

        /** delete phase with all of its data || delete all children from database */
        const destroy_phase = async ()=>{
            try {
                const id = phases.active.id
                const { data } = await axios.delete('/phases/'+ id)
                notify({
                    title: 'Task Deleted',
                    text: data.message,
                    type: 'warn'
                })
                document.querySelector("#dismissDestroyPhaseModal").click()
                await getPhases()
                phases.show = false
            } catch (error) {
                const errorMessage = error.response? error.response.data.message :error.message
                notify({
                    title: 'Task Error',
                    text: errorMessage,
                    type: 'warn'
                })
            }
        }

        onMounted(()=> getPhases())
        return {
            phases,
            newPhase,
            createPhase,
            choosePhase,
            editPhaseInput,
            editPhaseActive,
            updatePhase,
            destroy_phase
        }
    }
}
</script>