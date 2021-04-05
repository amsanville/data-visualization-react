import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Cached data from the API
  const [currData, setData] = useState({});

  // State variable tracking which buttons are toggled
  const [toggleButtons, setToggleButtons] = useState([]);
  // State variable tracking which country is selected as the base
  const [countrySelect, setCountrySelect] = useState('');
  
  function initialization(){
    // Initialization function
    // -Fills out list of countries for the selector and the toggles
    // -Sets up data for initial graph

    // Initial countries displayed on the site
    const initCountries = ['EUR', 'USD', 'AUD', 'CAD'];

    // Run initial API request
    let url = 'https://api.exchangerate.host/latest?source=ecb';
    fetch(url)
        .then(response => response.json())
        .then(data => {
          // Add in the base currency    
          let allCountries = data.rates;
          allCountries[data.base] = 1.0;
          
          // Build the toggle buttons
          let tempToggleButtons = []
          for(let country of Object.keys(data.rates).sort()){
            if(initCountries.includes(country)){
              tempToggleButtons.push({name: country, toggled: true, height: '100%'});
            } else {
              tempToggleButtons.push({name: country, toggled: false, height: '100%'});
            }
          }

          // Calculate the minimum height
          let min = Number.MAX_SAFE_INTEGER;
          for(let country of tempToggleButtons){
            if(country.toggled && min > data.rates[country.name]){
              min = data.rates[country.name];
            }
          }

          // Update the toggled buttons heights
          for(let country of tempToggleButtons){
            if(country.toggled){
              country.height = (min / data.rates[country.name] * 100) + '%';
            }
          }

          // Perform sets at the end
          setData(allCountries);
          setCountrySelect(data.base);
          setToggleButtons(tempToggleButtons);
        });
  }

  function onToggle(toggledCountry){
    // Toggles the bars on and off, correcting the height as necessary
    let tempToggleButtons = toggleButtons;
    let index = tempToggleButtons.map((country) => {return country.name}).indexOf(toggledCountry);
    tempToggleButtons[index].toggled = !tempToggleButtons[index].toggled;
    
    // Update the minimum value
    let min = Number.MAX_SAFE_INTEGER;
    for(let country of tempToggleButtons){
      if(country.toggled && min > currData[country.name]){
        min = currData[country.name];
      }
    }

    // Update the height of all toggled buttons
    for(let country of tempToggleButtons){
      if(country.toggled){
        country.height = (min / currData[country.name] * 100) + '%';
      }
    }
    // Update with the temporary variable only at the end
    setToggleButtons([...tempToggleButtons]);
  }

  function onSelect(ev){
    // Update based on changing the select field

    // Pull out the country
    const value = ev.target.value;

    // Run initial API request
    let url = 'https://api.exchangerate.host/latest?source=ecb&base=' + value;
    fetch(url)
        .then(response => response.json())
        .then(data => {
          // Add in the selected countries
          let allCountries = data.rates;
          allCountries[data.base] = 1.0;

          // Update the states
          setData(allCountries);
          setCountrySelect(data.base);
        });
  }

  // Initialize with a useEffect
  useEffect(initialization, []);
  return (
    <div className="DataVis">
        <div className="DataVis-title">
            <h3>Currency Exchange Rates</h3>
            <p>Choose base currency:</p>
            <select value={countrySelect} onChange={onSelect}>
              {
                toggleButtons
                .map(country =>(
                  <option key={"opt-" + country.name}>{country.name}</option>
                ))
              }
            </select>
            <p>Toggle countries to display:</p>
            <div className="DataVis-title-buttonbar">
                {
                  toggleButtons.map(country => ((
                    <button key={"btn-" + country.name} className={"DataVis-title-buttonbar-button" + (country.toggled ? (" DataVis-title-buttonbar-button--toggle") : (""))}
                    onClick={() => onToggle(country.name)}>
                      {country.name}
                    </button>
                  )
                  ))
                }
            </div>
        </div>
        <div className="DataVis-content">
          {
            toggleButtons
            .filter(country => country.toggled)
            .map(country => (
              <div key={"bar-" + country.name} className="DataVis-content-bar" style={{height: country.height}} onClick={() => alert(country.name + ' to ' + countrySelect + ': ' + currData[country.name] + ' to 1')}>{country.name}</div>
            ))
          }
      </div>
    </div>);
}
export default App;
