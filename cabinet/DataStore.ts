import { reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
interface DataState {
  baseAPI: string;
  uidArray: Ref<string[]>;
  statusArray: Ref<string[]>;
  psidArray: Ref<string[]>;
  clientArray: Ref<string[]>;
  phoneArray: Ref<string[]>;
  emailArray: Ref<string[]>;
  payerArray: Ref<string[]>;
  dateArray: Ref<string[]>;
  idAndStatus: Record<string, Record<string, string>>;
}

export const useDataStore = defineStore('data', {
  state: (): DataState => ({
    baseAPI: 'https://api.dev-cabinet.seenday.com/',
    uidArray: ref([]),
    statusArray: ref([]),
    psidArray: ref([]),
    clientArray: ref([]),
    phoneArray: ref([]),
    emailArray: ref([]),
    payerArray: ref([]),
    idAndStatus: reactive({}),
    dateArray: ref([])
  }),
  actions: {
    async getData() {
      try {
        const res = await axios.get(`${this.baseAPI}method/orders.getTest`);
        for (let i = 0; i < res.data.response.data.orders.length; i++) {
          const orderId = res.data.response.data.orders[i].id;
          const orderStatus = res.data.response.data.orders[i].status;
          const psidID = res.data.response.data.orders[i].psid;
          const clientID = res.data.response.data.orders[i].client;
          const phone = res.data.response.data.orders[i].phone;
          const email = res.data.response.data.orders[i].receiving_email;
          const payer = res.data.response.data.orders[i].fio_payer;
          const date = res.data.response.data.orders[i].date;
          this.idAndStatus[orderId] = { id: orderId, status: this.getStatusLabel(orderStatus), psid: psidID,
                                        client: clientID, phone, email, payer, date};
        }
      } catch (error) {
        alert(error);
      }
    },
    getStatusLabel(status: string): string {
      switch (status) {
        case '0':
          return 'primary';
        case '1':
          return 'info';
        case '2':
          return 'lightPurple';
        case '3':
          return 'lightBlue';
        case '4':
          return 'success';
        case '5':
          return 'danger';
        case '6':
          return 'warning';
        case '7':
          return 'idle';
        case '8':
          return 'blue';
        default:
          return 'unknown';
      }
    }
  }
});
