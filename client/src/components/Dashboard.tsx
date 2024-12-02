import { useEffect, useState } from "react";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";

const Dashboard = () => {
  const [fitnessData, setFitnessData] = useState<any>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    axios
      .get("/fetch-google-fit-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, 
        },
      })
      .then((response) => {
        if (response.data.success) {
          setFitnessData(response.data.fitnessData);
        } else {
          setError("Failed to fetch fitness data");
        }
      })
      .catch((err) => {
        if (err.response) {
          console.error("API Error:", err.response.data);
          setError("Error fetching data from the server.");
        } else if (err.request) {
          console.error("Network Error:", err.request);
          setError("Network error, please try again later.");
        } else {
          console.error("Error:", err.message);
          setError("An unexpected error occurred.");
        }
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ height: 400 }}>
      {fitnessData.length > 0 ? (
        <ResponsiveLine
          data={[
            {
              id: "Heart Rate",
              data: fitnessData.map((item: any) => ({
                x: item.date,
                y: item.heart_rate, 
              })),
            },
            {
              id: "Step Count",
              data: fitnessData.map((item: any) => ({
                x: item.date,
                y: item.step_count, 
              })),
            },
          ]}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            stacked: false,
            min: "auto",
            max: "auto",
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Date",
            legendOffset: 36,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Value",
            legendOffset: -40,
          }}
          lineWidth={2}
          enablePoints={false}
          enableGridX={false}
          enableGridY={true}
        />
      ) : (
        <div>No fitness data available</div>
      )}
    </div>
  );
};

export default Dashboard;
