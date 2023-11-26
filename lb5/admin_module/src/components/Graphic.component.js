import React from "react";
import { Chart } from "chart.js/auto";
import { Line } from "react-chartjs-2";

export function Graphic({ chartData }) {
    console.log("in line")
    return (
            <Line
                data={
                chartData
            }
                options={

                {
                    plugins: {
                        title: {
                            display: true,
                            text: "Prices"
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            }
                style={{backgroundColor:"white"}}
            />
    );
}