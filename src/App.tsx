import { useEffect, useState } from "react";
import "./styles.css";

const url = "https://api.coingecko.com/api/v3/exchange_rates";

// 1> all the values should be in litecoin; if i select litecoin
// 2> store localStorage; comeback with previous state
function useRates() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        setData(response);
      });
  }, []);

  return { data };
}

export default function App() {
  const { data } = useRates();
  const [cryptoCurrSelected, setCrytoCurrSelected] = useState(null);

  useEffect(() => {
    const localStorageValue = localStorage.getItem("lastCryptoCurrSelected");
    if (localStorageValue) {
      const localStorageCryptoCurrInfo = JSON.parse(localStorageValue);
      setCrytoCurrSelected(localStorageCryptoCurrInfo);
    } else {
      setCrytoCurrSelected({
        name: "Bitcoin",
        value: 1
      });
    }
  }, []);

  useEffect(() => {
    function saveToLocalStorage() {
      if (cryptoCurrSelected?.name) {
        localStorage.setItem(
          "lastCryptoCurrSelected",
          JSON.stringify(cryptoCurrSelected)
        );
      }
    }

    saveToLocalStorage();
  }, [cryptoCurrSelected]);

  function selectedCryptoCurr(e) {
    // setCrytoCurrSelected(e.target.value);
    const _crytoCurrSelected = e.target.value;
    let _crytoCurrSelectedValue = null;

    for (let [key, { name, value }] of Object.entries(data.rates)) {
      if (name === _crytoCurrSelected) {
        _crytoCurrSelectedValue = value;
        break;
      }
    }

    setCrytoCurrSelected({
      name: _crytoCurrSelected,
      value: _crytoCurrSelectedValue
    });
  }

  return (
    <div className="App">
      {
        <select
          onChange={(e) => selectedCryptoCurr(e)}
          value={cryptoCurrSelected?.name}
        >
          {data.rates &&
            Object.values(data.rates).map((currency) => {
              return <option>{currency.name}</option>;
            })}
        </select>
      }
      {data.rates &&
        Object.values(data.rates).map((currency) => {
          return (
            <p>
              {currency.name}{" "}
              {currency.value / (cryptoCurrSelected?.value ?? 1)}
            </p>
          );
        })}
    </div>
  );
}
