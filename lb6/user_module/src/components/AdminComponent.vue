<template>
    <div v-if="GoBack">
        <button class="button" v-on:click="GoBack">
            Back
        </button>
    </div>
    <div v-if="brokers">
        <div class="all_users_box" v-for="broker in brokers" v-bind:key="broker.id">
            <div class="user_box">
                Name: {{ broker.name }} <br>
                Money: {{ Number(broker.money).toFixed(2) }}<br>
                <div class="user_stocks_box" v-for="stock in stocks" v-bind:key="stock.id">
                    <div class="stock_box" v-if="broker.stocks[stock.id]?.count">
                        Stock: {{ stock.name }} <br>
                        Cost: {{ stock.data[stock.data.length - 1 - this.$store.state.index]?.Open }} <br>
                        <div v-if="broker.stocks[stock.id]?.count">Delta: {{ (Number(stock.data[stock.data.length - 1 -
                            this.$store.state.index]?.Open.slice(1))
                            - broker.stocks[stock.id]?.sum / broker.stocks[stock.id]?.count).toFixed(2) }} <br> </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>




<script>
import axios from 'axios';
import router from '../Router.js'


const get_broker_path = 'http://localhost:3001/getAllBrokers'
const get_stocks_path = 'http://localhost:3001/getAllStock'


export default {
    name: 'UserComponent',
    props: {

    },
    data() {
        return {
            brokers: null,
            stocks: null
        }

    },
    created() {
        //const timerId = setTimeout(() => {}, 1000)
        axios.get(get_broker_path)
            .then(response => (
                this.brokers = response.data
                //this.$store.commit("setBalance", this.broker.balance),
                //this.$store.commit("setUserStocks", this.broker.stocks)
                //console.log(response.data)
            ))
            .catch(error => {
                this.errorMessage = error.message;
                console.error("There was an error!", error);
            });

        axios.get(get_stocks_path)
            .then(response => (
                this.stocks = response.data
            ))
            .catch(error => {
                this.errorMessage = error.message;
                console.error("There was an error!", error);
            });
    },
    mounted(){
        this.$socket.on("updateBroker", (data) => {
          let broker = JSON.parse(data)
            for (let i = 0; i < this.brokers.length; i++) {
              if (this.brokers[i].id == broker.id){
                this.brokers[i] = broker
              }
            }
        })
    },
    methods: {
        GoBack() {
            router.go(-1)
        }
    }
}
</script>

<style>
.user_box {
    font-size: large;
    font-weight: 600;
    min-width: max-content;
    border-color: black;
    border-radius: 2vh;
    border-style: outset;
}

.stock_box{
    font-size: large;
    font-weight: 600;
    min-width: max-content;
    border-color: black;
    border-radius: 2vh;
    border-style: outset;
    background-color:  #B0A1B0;
}
</style>

