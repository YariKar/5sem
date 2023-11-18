import { useEffect, useState } from "react";
//import LineChart from "./line.component";
//import {CategoryScale, Chart, registerables} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import "./Components_style.css"
import { Graphic } from "./Graphic.component";
const get_path = 'http://localhost:3001/getAllStock'

export const StockComponent = () => {
    const [load_flag, SetLoad] = useState(false)
    const [stocks, setStocks] = useState([])
    const dispatch = useDispatch()
    const listTradings = []
    useEffect(() => {
        if(!load_flag){
        (async () => {
            dispatch({type:"SAVE", listTrading:[]})
            const data = await fetch(get_path)
                .then(res => res.json())

            setStocks(data)
            SetLoad(true)
        })()

    }
    }, [])
    
    if (stocks?.length) {
        //console.log(stocks)
        return (
            <div style={{ padding: 10, margin: 10 }}>
                <h1>Stocks:</h1>

                <div>
                    {stocks.map(stock => {
                        return <Stock key={stock.id} value={stock}></Stock>
                    })}

                </div>
            </div>
        )
    }

    return <h1> Wait</h1>

}

/*<h1>Stock List:</h1>
                <div>
                    {stocks.map(stock => {
                        return <div key={stock.id}>

                            <label>{stock.id}</label>
                        </div>
                    })}
                </div>*/
function Stock(props) {
    const [open, setOpen] = useState(false)
    const listTrading = useSelector(state=> state.listTrading)
    const dispatch = useDispatch()
    const [chartData, setChartData] = useState({
        labels: props.value.data.map((data) => data.Date).reverse(),
        datasets: [
            {
                label: "Users Gained ",
                data: props.value.data.map((data) => data.Open.match(/(\d+)/)[0]).reverse(),
                borderColor: "black",
                borderWidth: 2
            }
        ]
    });
    const ClickOpen = () => {
        setOpen(true)
    }
    const ClickClose = () => {
        setOpen(false)
    }
    const ChangeListTrading = (e) => {
        if(e.target.checked){
            listTrading.push(e.target.value)
        }
        else{
            let index = listTrading.indexOf(e.target.value);
            listTrading.splice(index,1);
        }
        console.log(listTrading)
        dispatch({type:"SAVE", listTrading:listTrading})
    }
    return (
        <>
            <div className="data_box">
                <input className="button" type="checkbox" onChange={ChangeListTrading} value={props.value.id} />
                {props.value.id}<br></br>
                {props.value.name}<br></br>
                <button className="button" onClick={ClickOpen} style={{fontSize:18}}>Open Graphic</button>
                {open ? <div>
                    <Graphic chartData={chartData} ></Graphic>
                    <button className="button" onClick={ClickClose} style={{ fontSize: 18 }}>Close</button>
                </div>
                    : null
                }
            </div>


        </>
    )

}

//
/*<h1>Choose trading data:</h1>
                <div>
                    {stocks.map(stock => {
                        return <div key={stock.id}>
                            <input type="checkbox" onChange={changeListTrading} value={stock.id}/>
                            <label>{stock.id}</label>
                        </div>
                    })}
                </div> */

/*<button onClick={handleClickOpen} style={{fontSize:18}}>График</button>
            {open ? <div>
                    <LineChart chartData={chartData} ></LineChart>
                    <button onClick={handleClickClose} style={{fontSize:18}}>Close</button>
                </div>
                : null
            } */