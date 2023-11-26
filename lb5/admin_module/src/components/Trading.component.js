import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketService, useConnectSocket } from "../Socket.service";
const get_path = "http://localhost:3001/getAllStock"
const default_path = "http://localhost:3000/stock"
const TradingComponent = () => {

    const listTradings = useSelector(state => state.listTrading)
    const [intervalID, setIntervalID] = useState(0)

    const [stocks, setStocks] = useState([])
    const [trading, setTrading] = useState([])
    const [speed, setSpeed] = useState(0)
    const [date, setDate] = useState('')
    const [change, setChange] = useState(0)

    useConnectSocket()
    useEffect(() => {
        SocketService.socket.on("trading", (data) => {
            if(trading.prices && data>trading.prices.length){
                clickStop()
            }
            console.log("trading" + data)
            setChange(data)
        })
    }, [])


    useEffect(() => {
        if (clickStop) { clickStop()}
        (async () => {
            const data = await fetch(get_path)
                .then(res => res.json())


            setStocks(data)
            let tr = []
            listTradings.forEach((el) => {
                const index = data.map((g) => {
                    return g.id;
                }).indexOf(el);
                if (index > -1) {
                    tr.push({ id: data[index].id, name: data[index].name, prices: data[index].data.reverse() })

                }

            })

            setTrading(tr)

        })()
    }, [])


    const clickStart = () => {
        let index = 0
        let date_str = new Date(date).toDateString()
        let find_flag = false
        //let a =new Date(trading[0].prices[0].Date).toDateString()
        //console.log(date_str,a, date_str==a)
        if (speed > 0 && date && trading){
            for (let i = 0; i < trading[0].prices.length ; i++) {
                let cur_date = new Date(trading[0].prices[i].Date).toDateString()
                if(date_str == cur_date){
                    console.log(date_str, cur_date, i)
                    index = i
                    find_flag = true
                    break
                }
                    
            }
            if(!find_flag){
                console.log("no select data, the values begin to be taken from the beginning")
            }
            SocketService.socket.emit("getData", { date, speed, index })
        }
        console.log("start")
        console.log(trading)

    }
    const clickStop = () => {
        SocketService.socket.emit("stop")
    }
    const setSpeedChange = (e) => {
        setSpeed(e.target.value)
    }
    const setDateChange = (e) => {
        setDate(e.target.value)
    }

    if (stocks?.length) {
        //console.log(stocks)
        
        if(!trading[0]?.prices[change]){
            clickStop()
            window.location = default_path
        }
        return (
            <div style={{ padding: 10, margin: 10 }}>
                <div >
                    <div className="data_box">
                        <label style={{ margin: 10, fontSize: 18 }}>Begin date</label>
                        <input type="date" onChange={setDateChange} value={date} style={{ fontSize: 18 }} />
                    </div>
                    <div className="data_box">
                        <label style={{ margin: 10, fontSize: 18 }}>Speed</label>
                        <input type="number" onChange={setSpeedChange} value={speed} style={{ fontSize: 18 }} />
                    </div>

                    <button className="button" onClick={clickStart} style={{ fontSize: 18 }}>START</button>
                    <button className="button" onClick={clickStop} style={{ fontSize: 18 }}>STOP</button>
                </div>

                <h1>Trading data:</h1>
                <div className="data_box">
                    {
                        (change > 0 && date && speed) ? (
                            trading.map(trad => (
                                <div key={trad.id}>
                                    <>
                                        {trad.name}<br></br>
                                        {trad.prices[change]?.Open} <br></br>
                                        {trad.prices[change]?.Date}
                                    </>
                                    <br></br>
                                    <br></br>
                                </div>
                            ))
                        ) : (<></>)

                    }


                </div>
            </div>
        )
    }

    return <h1> Wait</h1>

}

export default TradingComponent;