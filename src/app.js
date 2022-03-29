import { FetchWrapper } from "./fetchWapper.js";
import "./style.css";
import snackbar from "snackbar"; //name from where we get npm
import "snackbar/dist/snackbar.min.css";
import Chart from "chart.js/auto";
const snackbar = require("snackbar");

//API

const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/"
);

const foodname = document.querySelector("#menu-name");
const submitBtn = document.querySelector("#submit");
const frame = document.querySelector(".cardFrame");
const protein = document.querySelector("#protein");
const fat = document.querySelector("#fat");
const carbs = document.querySelector("#carb");
const totalCal = document.querySelector("#totalCalori");
const ctx = document.getElementById("myChart");

// POSTs food to the API
const addFood = async (event) => {
  event.preventDefault();

  //Asigining value from form to a variable
  const foodItem = foodname.value;
  const proteinVal = protein.value;
  console.log(proteinVal);
  const carbsVal = carbs.value;
  const fatVal = fat.value;
  const calCount = proteinVal * 4 + carbsVal * 4 + fatVal * 9;
  //Calculating calorie:
  let body = {
    fields: {
      carbs: { integerValue: carbs.value },

      protein: { integerValue: protein.value },

      fat: { integerValue: fat.value },

      foodname: { stringValue: foodname.value },
    },
  };
  if (!foodItem === "#" || (carbsVal && proteinVal && fatVal)) {
    API.post("pravesh123", body).then((data) => {
      console.log(data);
    });

    displayItem(foodItem, carbsVal, proteinVal, fatVal, calCount);

    snackbar.show("Calculating");
    myChart.data.datasets[0].data = [];
    myChart.data.datasets[0].data.push(proteinVal, carbsVal, fatVal);
    myChart.update();
  } else {
    window.alert("Value must be clecked");
  }
};

// Resets the fields
const resetFields = () => {
  protein.value = " ";
  carbs.value = " ";
  fat.value = " ";
  //foodname.selectedIndex = 0;
};

//Chart
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        label: "Food contains",
        data: [protein.value, carbs.value, fat.value],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

//Does all the display of data on the interface

const displayItem = (foodItem, carbsVal, proteinVal, fatVal, calCount) => {
  let total = [];
  let totals;
  let arr;
  API.get("pravesh123").then((response) => {
    if (response.documents) {
      for (let i = 0; i < response.documents.length; i++) {
        total.push(response.documents[i].fields.total.integerValue);
      }
      arr = total.map((tex) => Number(tex));
      totals = arr.reduce((partialSum, a) => partialSum + a, 0);
      totalCal.textContent = `total: ${totals + calCount}`;
      console(totalCal.textContent);
    } else {
      totalCal.textContent = `Total Calories Logged: ${calCount}`;
    }
  });
  const ItemData = `
  <div class="cardFrame">
    <div>
    <h2 class="item_title">${foodItem}</h2>
    </div>
    <div>
    <h4 class="totalCal">Calories: ${calCount}g</h4>
    </div>
    <div>
    <h4>Protein: ${proteinVal}g</h4>
    </div>
    <div>
      <h4>Carbs: ${carbsVal}g</h4>
    </div>
    <div>
    <h4>Fat: ${fatVal}g</h4>
    </div>
  </div>`;
  frame.insertAdjacentHTML("beforeend", ItemData);
};

//Clears the database containing all food items saved
const resetData = () => {
  API.get("pravesh123").then((data) => {
    for (d in data.documents) {
      API.delete(`pravesh123${data.documents[d].name.slice(67)}`);
    }
  });
  snackbar.show("reset all items");
  resetInputs();
  frame.innerHTML = " ";
  myChart.data.datasets[0].data = [];
  myChart.update();
  totalCal.textContent = " ";
};

// the click events
submitBtn.addEventListener("click", addFood);
//resetData();
