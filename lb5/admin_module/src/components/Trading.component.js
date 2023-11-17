import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
//import {useConnectSocket} from "./hooks/useConnectSocket";
//import {SocketApi} from "./api/socket-api";


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
        SocketApi.socket.on("trading", (data) => {
            console.log("trading" + data)
            setChange(data)
        })
    }, [])


    useEffect(() => {

        (async () => {
            const data = await fetch("http://localhost:3001/getStock")
                .then(res => res.json())


            setStocks(data)
            let tr = []
            listTradings.forEach((el) => {
                const index = data.map((g) => {
                    return g.id;
                }).indexOf(el);
                if (index > -1) {
                    tr.push({id: data[index].id, name: data[index].name, prices: data[index].data})

                }

            })

            setTrading(tr)

        })()
    }, [])


    const clickStart = () => {
        if (speed > 0 && date)
            SocketApi.socket.emit("getData", {date, speed})
        console.log("start")
        console.log(trading)

    }
    const clickStop = () => {
        SocketApi.socket.emit("stop")
        clearInterval(intervalID)
        setIntervalID(null)
        //setChange(0)
    }
    const setSpeedChange = (e) => {
        setSpeed(e.target.value)
    }
    const setDateChange = (e) => {
        setDate(e.target.value)
    }

    if (stocks?.length) {
        //console.log(stocks)
        return (
            <div style={{padding: 10, margin: 10}}>
                <div >
                    <div>
                        <label style={{margin: 10, fontSize: 18}}>Дата начала</label>
                        <input type="date" onChange={setDateChange} value={date} style={{fontSize: 18}}/>
                    </div>
                    <div>
                        <label style={{margin: 10, fontSize: 18}}>Скорость</label>
                        <input type="number" onChange={setSpeedChange} value={speed} style={{fontSize: 18}}/>
                    </div>

                    <button onClick={clickStart} style={{fontSize: 18}}>START</button>
                    <button onClick={clickStop} style={{fontSize: 18}}>STOP</button>
                </div>

                <h1>Trading data:</h1>
                <div style={{backgroundColor:"#FF4B3A", color:"white", fontSize:18, padding:10, borderRadius:10}}>
                    {
                        (change > 0 && date && speed) ? (
                            trading.map(trad => (
                                <div key={trad.id}>
                                    <>
                                        {trad.name}<br></br>
                                        {trad.prices[change].Open}
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