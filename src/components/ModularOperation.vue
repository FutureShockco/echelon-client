<script lang="ts" setup>
import { ref } from 'vue';
import { operations, type OperationDefinition } from '@/utils/operations';
import TransactionService from '@/services/transaction';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
let result = ref()
const formValues = ref<Record<string, Record<string, any>>>({});

operations.forEach(operation => {
    formValues.value[operation.type] = {};
    Object.keys(operation.fields).forEach(field => {
        if (field === 'author' || field === 'voter' || field === 'from' || field === 'creator') {
            operation.fields[field].value = authStore.username;
            formValues.value[operation.type][field] = authStore.username;
        }
        else
            formValues.value[operation.type][field] = '';
    });
});


const updateValue = (operationType: string, field: string | number, fieldType: string, value: string | number | boolean) => {
    if (fieldType === 'boolean') {
        formValues.value[operationType][field] = Boolean(value); // Convert to number
    }
    else if (fieldType === 'number') {
        formValues.value[operationType][field] = Number(value); // Convert to number
    } else {
        formValues.value[operationType][field] = value; // Keep as string
    }
};

const send = async (operation: OperationDefinition) => {
    console.log(operation)
    const tx = {} as any
    Object.keys(operation.fields).forEach((key) => {
        tx[key] = operation.fields[key].value
    })
    const response = await TransactionService.send(operation.type, tx)
    result.value = response
    console.log(response)
}
</script>

<template>
    <div class="card card-style" v-for="operation in operations" :key="operation.type">
        <div class="content">
            <h2>{{ operation.type }} operation</h2>
            <form @submit.prevent="send(operation)">
                <div class="form-custom form-label mb-3" v-for="(fieldDef, field, index) in operation.fields"
                    :key="field">
                    <div v-if="fieldDef.type === 'string' || fieldDef.type === 'number' || fieldDef.type === 'date'">
                        <label class="color-theme" :for="field.toString() + index">{{ field }}</label>
                        <input class="form-control rounded-xs" :id="field.toString() + index" :type="fieldDef.type"
                            v-model="fieldDef.value"
                            @input="updateValue(operation.type, field, fieldDef.type, fieldDef.value)" />
                    </div>
                    <div v-else class="d-flex mx-1" :data-trigger-switch="field.toString() + index">
                        <div class="align-self-center">
                            <h6 class="mb-0 font-12">{{ field }}</h6>
                        </div>
                        <div class="ms-auto align-self-center">
                            <div class="form-switch android-switch switch-blue switch-s">
                                <input type="checkbox" class="android-input" :id="field.toString() + index"
                                    v-model="fieldDef.value">
                                <label class="custom-control-label" :for="field.toString() + index"></label>
                            </div>
                        </div>
                    </div>

                </div>

                <div v-if="authStore.isAuthenticated" @click="send(operation)"
                    class='card content btn rounded-sm btn-m gradient-green text-uppercase font-700 mt-3 mb-3 btn-full shadow-bg shadow-bg-s'>
                    Send</div>
            </form>
        </div>
    </div>
</template>