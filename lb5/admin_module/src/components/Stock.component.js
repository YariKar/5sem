import {useEffect, useState} from "react";
//import LineChart from "./line.component";
//import {CategoryScale, Chart, registerables} from "chart.js";
import {useDispatch, useSelector} from "react-redux";
import "./Components_style.css"
const way = 'http://localhost:3001/getAllStock'

export const StockComponent = () => {
    const [stocks, setStocks] = useState([])
    const dispatch = useDispatch()
    const listTradings = []
    useEffect(() => {

        (async () => {
            const data = await fetch(way)
                .then(res => res.json())

            setStocks(data)

        })()
    }, [])

   /* const changeListTrading = (e) =>{


        if(e.target.checked){
            listTradings.push(e.target.value)
        }else{
            let index = listTradings.indexOf(e.target.value);
            listTradings.splice(index,1);
        }
        console.log(listTradings)
        dispatch({type:"SAVE", listTrading:listTradings})
    }*/

    if (stocks?.length) {
        //console.log(stocks)
        return (
            <div style={{padding:10, margin:10}}>
                
                <h1>Stocks:</h1>
                <div>
                    {stocks.map(stock => {
                        return <Stock key={stock.id} value={stock}></Stock>
                    })}

                </div>
            </div>
        )
    }

    return <h1> Bad</h1>

}


function Stock(props) {
    const [open, setOpen] = useState(false)
    return (
        <>
        <div className="data_box">
            {props.value.id}<br></br>
            {props.value.name}<br></br>
            
        </div>


    </>
    )

}


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