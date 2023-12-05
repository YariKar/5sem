<template>
    <div class="navigation_bar">
        <router-link class="button" to="/admin">Admin page</router-link>
        <router-link class="button" to="/login">Exit</router-link>
    </div>
    <div v-if="stocks" class="all_data">
        <div v-if="broker" class="user_info">
            Name: {{ broker.name }} <br>
            <div id="BrokerMoney"> Money: {{ Number(broker.money).toFixed(2) }}<br></div>
        </div>
        <div v-if="this.$store.state.listTrading.length !== 0" class="trading">
            <div class="date_box">
                Current trading date: {{ stocks[0].data[stocks[0].data.length - 1 - this.$store.state.index]?.Date }}
            </div>
            <div>
                <div v-for="stock in stocks || []" v-bind:key="stock.id">
                    <div class="box" v-if="this.$store.state.listTrading.includes(stock.id)">
                        <div class="stock_box">

                            Stock: {{ stock.name }} <br>
                           <div v-bind:id="stock.id+'_stock_price'"> Cost: {{ stock.data[stock.data.length - 1 - this.$store.state.index]?.Open }} <br> </div>
                            <div v-if="!is_open && OpenGraphic">
                                <button class="button" @click="OpenGraphic(stock.id)">Open Graphic</button>
                            </div>
                            <div v-if="is_open && CloseGraphic">

                                <dialog class="graphic" open v-if="showDialog === stock.id">
                                    <LineChart id="my-chart-id" :options="{
                                        responsive: true,
                                        height: 1000,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: stock.id,
                                            },
                                        },
                                    }" :data="{
    title: stock.id,
    labels: stock.data.map((data) => data.Date).slice(stock.data.length - 1 - this.$store.state.index, stock.data.length - 1).reverse(),
    datasets: [{
        label: stock.id,
        data: stock.data.map((data) =>
            data.Open.match(/(\d+)/)[0]).slice(stock.data.length - 1 - this.$store.state.index, stock.data.length - 1).reverse()

    }]
}" />
                                    <button class="button" v-on:click="CloseGraphic">Close</button>
                                </dialog>

                            </div>
                        </div>
                        <div v-if="OpenBuyWindow && OpenSellWindow" class="user_box">
                            <div v-if="broker.stocks[stock.id]">
                                Stock count: {{ broker.stocks[stock.id]?.count }} <br>
                                <div v-if="broker.stocks[stock.id]?.count">Delta: {{ (Number(stock.data[stock.data.length -
                                    1 - this.$store.state.index]?.Open.slice(1))
                                    - broker.stocks[stock.id]?.sum / broker.stocks[stock.id]?.count).toFixed(2) }} <br>
                                </div>
                            </div>
                            <button v-bind:id="stock.id+'_buy_stock'" class="button" v-on:click="OpenBuyWindow(stock.id)">Buy</button>
                            <dialog class="dialog_window" open v-if="showBuyDialog == stock.id">
                                <input v-bind:id="stock.id+'_input_buy'" class="button" type="number" min=0 placeholder="input count" v-model="count">
                                <button v-bind:id="stock.id+'_confirm_buy'" class="button" v-on:click="ConfirmBuy(stock.id)">Buy</button>
                            </dialog>
                            <button class="button" v-on:click="OpenSellWindow(stock.id)">Sell</button>
                            <dialog class="dialog_window" open v-if="showSellDialog == stock.id">
                                <input class="button" type="number" min=0 placeholder="input count" v-model="count">
                                <button class="button" v-on:click="ConfirmSell(stock.id)">Sell</button>
                            </dialog>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import router from '../Router.js'
import { Line as LineChart } from 'vue-chartjs'
//axios.AxiosHeaders = {withCredentials: true}
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
//import bodyParser from 'body-parser';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const get_broker_path = 'http://localhost:3001/getBroker/?name='
const get_stocks_path = 'http://localhost:3001/getAllStock'

export default {
    name: 'UserComponent',
    components: { LineChart  },
    data() {
        return {
            broker: null,
            stocks: null,
            is_open: false,
            showDialog: "",
            startIndex: 0,
            showBuyDialog: "",
            count: 0,
            showSellDialog: ""
        }

    },

    created() {

        axios.get(get_broker_path + this.$route.params.name)
            .then(response => (
                this.broker = response.data
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
    mounted() {
        this.$socket.on("trading_list", (data) => {
            this.$store.commit("setListTrading", JSON.parse(data))
            console.log("get trading_list from server: ", JSON.parse(data))
        })
        this.$socket.on("trading", (data) => {
            this.$store.commit("setIndex", JSON.parse(data))
            console.log("get trading index from server: ", JSON.parse(data))
        })
        this.$socket.on("updateBroker", (data) => {
            const updated_broker = JSON.parse(data)
            if (this.broker.id == updated_broker.id) {
                this.broker = updated_broker
            }
        })
    },
    //rules: { 'vue/multi-word-component-names': 0 },
    methods: {
        GoToAdminPage() {
            router.push({
                path: `/admin`
            })
        },
        Exit() {
            router.push({
                path: `/`
            })
        },
        OpenBuyWindow(stock_id) {
            this.showBuyDialog = stock_id
        },
        OpenSellWindow(stock_id) {
            this.showSellDialog = stock_id
        },
        ConfirmBuy(stock_id) {
            this.showBuyDialog = ""
            console.log("Confirm buy", stock_id, this.count)
            const body = JSON.stringify({
                "broker_id": this.broker.id,
                "stock_id": stock_id,
                "index": this.$store.state.index,
                "count": this.count
            })
            this.$socket.emit("buyStocks", body)
            this.count = 0
        },
        ConfirmSell(stock_id) {
            this.showSellDialog = ""
            console.log("Confirm sell", stock_id, this.count)
            const body = JSON.stringify({
                "broker_id": this.broker.id,
                "stock_id": stock_id,
                "index": this.$store.state.index,
                "count": this.count
            })
            this.$socket.emit("sellStocks", body)
            this.count = 0
        },
        OpenGraphic(id) {
            this.is_open = true
            this.showDialog = id
        },
        CloseGraphic() {
            this.is_open = false
        }


    }
}

</script>


<style scoped>
body {
    display: flex;
    flex-direction: row;

}

.box {
    display: flex;
    flex-direction: column;
    margin-top: 3vh;
}

.navigation_bar {
    min-height: 5vh;
    background-color: #B0A1B0;
    border-radius: 2vh;
    border-color: black;
    border-style: outset;
    display: flex;
    justify-content: center;
}

.button {
    min-width: 5vh;
    min-height: 3vh;
    background-color: #C5C8B7;
    font-size: large;
    font-weight: 600;
    border-radius: 2vh;
    border-color: black;
    border-style: outset;
}

.user_info {
    margin-top: 3vh;
    border-color: black;
    border-radius: 2vh;
    border-style: outset;
    font-size: large;
    font-weight: 600;


}

.date_box {
    margin-top: 3vh;
    border-color: black;
    border-radius: 2vh;
    border-style: outset;
    font-size: large;
    font-weight: 600;
}

.all_data {
    min-height: 100%;
    min-width: 100%;
}

.graphic {
    background-color: #B0A1B0;
    min-height: 40vh;
    min-width: 90vh;
    border-color: black;
    border-radius: 5vh;
    border-style: outset;
}

.dialog_window {
    background-color: #B0A1B0;
    min-height: max-content;
    min-width: 20vh;
    border-color: black;
    border-radius: 5vh;
    border-style: outset;
}

.stock_box {
    font-size: large;
    font-weight: 600;
    min-width: max-content;
    border-color: black;
    border-radius: 2vh;
    border-style: outset;
    background-color: #B0A1B0;
}

.user_box {
    font-size: large;
    font-weight: 600;
    min-width: max-content;
    border-color: black;
    border-radius: 2vh;
    border-style: outset;
}
</style>