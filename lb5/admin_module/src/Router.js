import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { BrokersComponent } from "./components/Brokers.component";
import { StockComponent } from "./components/Stock.component";
import "./components/Components_style.css"
import TradingComponent from "./components/Trading.component";

function NavigationBar() {
    return (
        <div className="main_bar" >
            <Link to="/brokers" style={{ padding: 10, color: "white", fontSize: 25 }}>Brokers</Link>
            <Link to="/stock" style={{ padding: 10, color: "white", fontSize: 25 }}>Stocks</Link>
            <Link to="/trading" style={{ padding: 10, color: "white", fontSize: 25 }}>Trading</Link>
            <Link to="/" style={{ padding: 10, color: "white", fontSize: 25 }}>Home</Link>
            <Link to="/about" style={{ padding: 10, color: "white", fontSize: 25 }}>About</Link>
        </div>
    )
}

export default function Router() {
    return (
        <BrowserRouter>
            <NavigationBar></NavigationBar>
            <Routes>
                <Route exact path="/" element={<Home />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="*" element={<NoMatch />}></Route>
                <Route path="/brokers" element={<Brokers />}></Route>
                <Route path="/stock" element={<Stock />}></Route>
                <Route path="/trading" element={<Trading />}></Route>
            </Routes>
        </BrowserRouter>
    );
}


function Home() { return <div className="data_box"><h1>Welcome to stock exchange admin module</h1></div> }
function About() {
    return (
    <div className="data_box"><h1>About pages:</h1>
        <h3>Brokers - brokers list with add, delete and change functions</h3>
        <h3>Stocks - stocks list with show grahics and choose stocks function</h3>
        <h3>Trading - a page with the ability to start and stop trading on current shares, as well as choose the year and the rate of change in the cost of stocks </h3>
    </div>
    )
}
function NoMatch() { return <div><h3>No match!</h3></div> }
function Brokers() {
    return <BrokersComponent></BrokersComponent>
}
function Stock() {
    return <StockComponent></StockComponent>
}
function Trading() {
    return <TradingComponent></TradingComponent>
}
