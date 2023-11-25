import {createStore} from 'vuex'

export default createStore({
    state() {
        return {
            date: null,
            listTrading:[],
            index: 0,
            //date: ""
            

        }
    },
    mutations: {
        setListTrading(state, list){
            state.listTrading = list
            //console.log(state)
        },
        setIndex(state, index){
            state.index = index
        }
    }
})



/*currentIndex: 0,
            balance:0,
            startDate: null,
            userStocks:[],
            brokers:[] */