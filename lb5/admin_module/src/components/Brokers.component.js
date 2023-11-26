import {useEffect, useState} from 'react'
//import axios from "axios";
import "./Components_style.css"

const get_path = 'http://localhost:3001/getAllBrokers'
const post_path = 'http://localhost:3001/postBroker'
const delete_path = 'http://localhost:3001/deleteBroker/'
const put_path = "http://localhost:3001/changeBroker/"
const default_path = "http://localhost:3000/brokers"

export const BrokersComponent = () => {
    const [brokers, setBrokers] = useState([])
    const [load_flag, setLoad] = useState(false)

    useEffect(() => {
        if (!load_flag)
            (async () => {
                const data = await fetch(get_path)
                    .then(res => res.json())

                setBrokers(data)
                setLoad(true)
            })()
    }, [])


    if (brokers?.length) {
        //console.log(brokers)
        return (
            <div style={{paddingLeft: 20}}>
                <h1>Brokers:</h1>
                <AddBroker></AddBroker>

                <div>
                    {brokers.map(broker => {
                        return <Broker key={broker.id} value={broker}></Broker>
                    })}

                </div>
            </div>
        )
    }

    return <h1> Wait</h1>

}


function AddBroker(){
    const [openAdd, setOpenAdd] = useState(false);
    const [inputMoney, setInputMoney] = useState(0);
    const [inputName, setInputName] = useState("");
    const OpenAddWindow= () => {
        setOpenAdd(true);
    };
    const CloseAddWindow = async () => {
        console.log("new value" + inputName)

        if (inputName)

            try {
                const response = await fetch(post_path, {
                    method: "POST",
                    body: JSON.stringify({
                        "id": -1,
                        "name": inputName,
                        "money": inputMoney
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                    ,
                });

                if (!response.ok) {
                    throw new Error(`error: ${response.status}`);
                }

                const result = await response.json();
                if (result.mes === "success")

                    console.log(result);
            } catch (err) {
                console.log(err.message);
            }

        setOpenAdd(false)
        window.location = default_path
    }
    const ChangeMoney = (e) => {
        setInputMoney(Number(e.target.value))
    }
    const ChangeName = (e) => {
        setInputName(e.target.value)
    }
    return (
        <>
            <button onClick={OpenAddWindow}
                    className='data_box'> Add
            </button>
            <dialog open={openAdd} className='dialog_window'>
                <p>Add broker</p>
                <form>
                    <input type="text" value={inputName}
                           placeholder="name" onChange={ChangeName} style={{fontSize: 18}}/>
                    <input type="number" value={inputMoney}
                           placeholder="start money" onChange={ChangeMoney} style={{fontSize: 18}}/>
                    <button
                        className='button'
                        onClick={CloseAddWindow}
                        color="primary" autoFocus style={{fontSize: 18}}>
                        Add
                    </button>
                </form>


            </dialog>
        </>
    )
}




function Broker(props){
    const [open, setOpen] = useState(false);

    const [inputText, setInputText] = useState(0);

    const DeleteBroker = async (broker_id) =>{
        console.log(broker_id.target.value)

        try {
            const response = await fetch(delete_path + broker_id.target.value, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.mes === "success")

                console.log(result);
        } catch (err) {
            console.log(err.message);
        }

        setOpen(false);
        window.location = default_path
    }

    const ChangeWindowOpen = () => {
        setOpen(true);
    };

    const Change = (e) => {
        let value = Number(e.target.value)

        setInputText(value)
    }

    const ChangeWindowClose = async (broker_id) =>{
        console.log(broker_id.target.value)
        console.log("new value" + inputText)

        try {
            const response = await fetch(put_path + broker_id.target.value, {
                method: "PUT",
                body: JSON.stringify({"money": inputText}),
                headers: {
                    'Content-Type': 'application/json'
                }
                ,
            });

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.mes === "success")

                console.log(result);
        } catch (err) {
            console.log(err.message);
        }

        setOpen(false);
        window.location = default_path
    }
    


    return (
        <div className="data_box">
            <p>Name: {props.value.name}</p>
            <p>Money:  {props.value.money}</p>
            <button className='button' onClick={ChangeWindowOpen} style={{fontSize: 20}}> Change</button>
            <button className='button' onClick={DeleteBroker} value={props.value.id} style={{fontSize: 20}}> Delete</button>
            <dialog open={open} className='dialog_window'>
                <p> Change money: {props.value.name}</p>
                <form>
                    <input type="number" value={inputText}
                           placeholder="Input money" onChange={Change} style={{fontSize: 18}}/>
                    <button value={props.value.id}
                            onClick={ChangeWindowClose}
                            color="primary" autoFocus style={{fontSize: 18}}>
                        Change
                    </button>
                </form>


            </dialog>
        </div>

    )
}
/*<button onClick={handleClickToOpen} style={{fontSize: 20}}> Change</button>
            <button onClick={handleToDelete} value={props.value.id} style={{fontSize: 20}}> Delete</button>
            <dialog open={open} style={{borderColor: "gray", borderRadius: 10}}>
                <p> Изменить баланс пользователя: {props.value.name}</p>
                <form>
                    <input type="number" value={inputText}
                           placeholder="Введите баланс" onChange={onChange} style={{fontSize: 18}}/>
                    <button value={props.value.id}
                            onClick={handleToClose}
                            color="primary" autoFocus style={{fontSize: 18}}>
                        Изменить
                    </button>
                </form>


            </dialog> */
/*<AddBroker></AddBroker>

                <div>
                    {brokers.map(broker => {
                        return <Broker key={broker.id} value={broker}></Broker>
                    })}

                </div>*/


/**
    ) */