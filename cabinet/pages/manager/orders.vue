<template>
  <customLayout>
    <template #main>
      <fixedLeftColumn>
        <template #fixed>
          <div class="wrapper__whole">
            <div class="wrapper__left">
              <div class="block">
                <InputDate
                v-model="datePickerValue"
                @update:model-value="handleDatePicker" />
                <Search 
                :search-query="searchQuery" 
                :search-types="searchTypes" 
                :search-type="searchType"
                @update:search-type="handleSearchTypeChanged" 
                @update:search-query="handleSearchQueryChanged"
                @submit="handleSubmit" 
                @clear="handleClear" />
                <ToggleGroup />
              </div>

              <div class="block">
                <Select 
                v-model="selectedValue" 
                v-model:open="isOpen" 
                :items="items" 
                :required="true" 
                :readonly="false"
                :with-portal="true" 
                :theme="'light'" 
                :size="'small'" 
                :with-checkmark="false"
                @update:model-value="handleModelValueChanged" />
                <div class="toggle__box">
                  <Toggle @click="handleYearFilterClick">
                    <template #buttonText>
                      Показать
                    </template>
                  </Toggle>
                  <Toggle :data-color="color" @click="handleResetClick">
                    <template #buttonText>
                      Сбросить
                    </template>
                  </Toggle>
                </div>
              </div>
            </div>
            <div v-if="queryParams.size !==0" class="wrapper_right">
              <StatusCard v-for="order in filteredOrders" :key="order.id" :status=order.status>
                <template #uid>
                  <div class="uid__string">
                    № {{ order.id }}
                  </div>
                </template>
              </StatusCard>
              <Empty v-if="filteredOrders.length === 0" />
            </div>
            <div v-else class="wrapper_right">
              <StatusCard v-for="order in idAndStatus" :key="order.id" :status=order.status>
                <template #uid>
                  <div class="uid__string">
                    № {{ order.id }}
                  </div>
                </template>
              </StatusCard>
            </div>
          </div>
        </template>
      </fixedLeftColumn>
    </template>
  </customLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";

import InputDate from "../src/shared/ui/inputs/input-date/index.vue";
import customLayout from "../layouts/default.vue";
import fixedLeftColumn from "../src/shared/ui/templates/fixed-left-column.vue";
import Search from "../src/shared/ui/search/index.vue";
import ToggleGroup from "../src/shared/ui/toggle-group/index.vue";
import Select from "../src/shared/ui/select/index.vue";
import Toggle from "../src/shared/ui/toggle/index.vue";
import StatusCard from "../src/shared/ui/status-card/index.vue";
import { useDataStore } from "../DataStore.ts";
import Empty from "../src/shared/ui/empty/index.vue";

definePageMeta({
  layout: 'custom',
})

const dataStore = useDataStore();
const idAndStatus = dataStore.idAndStatus
const filteredOrders = reactive([]);

const selectedValue = ref(null)
const isOpen = ref(false)
const color = "white"
const modelValueYear = ref('')

const datePickerValue = ref('')

const items =
  [
    { value: '2023', title: '2023' },
    { value: '2022', title: '2022' },
    { value: '2021', title: '2021' },
  ]

const searchTypes =
  [
    { value: 'order_number', title: 'Номер заказа' },
    { value: 'psid', title: 'Номер фотосессии' },
    { value: 'client_id', title: 'Клиент ID' },
    { value: 'phone', title: 'Телефон' },
    { value: 'email', title: 'Email' },
    { value: 'payer', title: 'Плательщик, ребенок' },
  ]

const searchType = ref('')
const searchQuery = ref('')
const queryParams = new URLSearchParams();


const handleSearchTypeChanged = (newSearchType: string) => {
  searchType.value = newSearchType
}

const handleSearchQueryChanged = (newSearchQuery: string) => {
  searchQuery.value = newSearchQuery
}

const handleSubmit = () => {
  queryParams.delete('year');
  queryParams.delete('search_type');
  queryParams.delete('search_value');
  queryParams.delete('date_start');
  queryParams.delete('date_end');
  switch (searchType.value) {
    case '0':
      queryParams.set('search_type', 'order_number');
      break;
    case '1':
      queryParams.set('search_type', 'psid');
      break;
    case '2':
      queryParams.set('search_type', 'client_id');
      break;
    case '3':
      queryParams.set('search_type', 'phone');
      break;
    case '4':
      queryParams.set('search_type', 'email');
      break;
    case '5':
      queryParams.set('search_type', 'payer');
      break;
  }

  queryParams.set('search_value', searchQuery.value);

  const url = `${window.location.pathname}?${queryParams.toString()}`;
  window.history.pushState({}, '', url);

  filteredOrders.splice(0);
  Object.values(idAndStatus).forEach((order) => {
    if (
      searchType.value === '' ||
      (searchType.value === '0' &&
        order.id.toString().includes(searchQuery.value)) ||
      (searchType.value === '1' && order.psid.includes(searchQuery.value)) ||
      (searchType.value === '2' &&
        order.client.toString().includes(searchQuery.value)) ||
      (searchType.value === '3' && order.phone.includes(searchQuery.value)) ||
      (searchType.value === '4' && order.email.includes(searchQuery.value)) ||
      (searchType.value === '5' && order.payer.includes(searchQuery.value))
    ) {
      filteredOrders.push(order);
    }
  });
};

const handleClear = () => {
  queryParams.delete('year');
  queryParams.delete('search_type');
  queryParams.delete('search_value');
  queryParams.delete('date_start');
  queryParams.delete('date_end');
  searchType.value = ''
  searchQuery.value = ''
  window.history.replaceState(null, '', '/manager/orders')
  filteredOrders.splice(0);
}

const handleModelValueChanged = (newModelValueYear: string) => {
  modelValueYear.value = newModelValueYear
}

const handleYearFilterClick = () => {
  queryParams.delete('year');
  queryParams.delete('search_type');
  queryParams.delete('search_value');
  queryParams.delete('date_start');
  queryParams.delete('date_end');
  queryParams.set('year', modelValueYear.value);
  const url = `${window.location.pathname}?${queryParams.toString()}`;
  window.history.pushState({}, '', url);
  filteredOrders.splice(0);
  Object.values(idAndStatus).forEach((order) => {
    if ( order.date.includes(modelValueYear.value)) {
      filteredOrders.push(order);
    }
  });
}

const handleResetClick = () => {
  queryParams.delete('year');
  queryParams.delete('search_type');
  queryParams.delete('search_value');
  queryParams.delete('date_start');
  queryParams.delete('date_end');
  window.history.replaceState(null, '', '/manager/orders')
  modelValueYear.value = ''
  selectedValue.value = null
  filteredOrders.splice(0);
}

const handleDatePicker = (date: string) => {
  queryParams.delete('year');
  queryParams.delete('search_type');
  queryParams.delete('search_value');
  queryParams.delete('date_start');
  queryParams.delete('date_end');
  window.history.replaceState(null, '', '/manager/orders')
  datePickerValue.value = date
  const startDate: string = String(new Date(datePickerValue.value).getFullYear()) + String(new Date(datePickerValue.value).getMonth() + 1).padStart(2, '0') + String(new Date(datePickerValue.value).getDate()).padStart(2, '0')
  const endDate: string = String(new Date().getFullYear()) + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0')
  queryParams.set('date_start', startDate);
  queryParams.set('date_end', endDate);
  const url = `${window.location.pathname}?${queryParams.toString()}`;
  window.history.pushState({}, '', url);
  filteredOrders.splice(0);
  Object.values(idAndStatus).forEach((order) => {
    if (isDateBetween(parseDate(order.date), datePickerValue.value, new Date())) {
      filteredOrders.push(order);
    }
  });
}

function parseDate(dateString: string): Date | null {
  const pattern = /^(\d{2})\.(\d{2})\.(\d{4}) в (\d{2}):(\d{2}) \(GMT\)$/;
  const match = dateString.match(pattern);

  if (match) {
    const [, day, month, year, hours, minutes] = match.map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  return null;
}

function isDateBetween(date: Date, startDate: Date, endDate: Date): boolean {
  if (startDate > endDate) {
    throw new Error("Начальная дата должна быть меньше конечной даты");
  }

  const dateMs = date.getTime();
  const startDateMs = startDate.getTime();
  const endDateMs = endDate.getTime();
  return dateMs >= startDateMs && dateMs <= endDateMs;
}



onMounted(() => {
  queryParams.delete('year');
  queryParams.delete('search_type');
  queryParams.delete('search_value');
  window.history.replaceState(null, '', '/manager/orders')
  dataStore.getData()
})


</script>

<style scoped>
.wrapper__whole {
  display: flex;
  flex-direction: row;

}

.wrapper__left {
  margin-right: 15px;
}

.block {
  padding: 16px;
  margin: 15px;
  width: 100%;
}

.dp__main{
  margin-bottom: 15px;
}

.toggle__box {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

@media screen and (max-width: 430px) {
  .wrapper__whole{
    flex-direction: column;
  }

  .wrapper_right{
    width: 100%;
  }

  .block{
    margin: 3px;
  }

  .block.status-card{
    width: 97%;
  }
}
</style>
