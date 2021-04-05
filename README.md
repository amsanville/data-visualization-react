# Data Visualization in React
Uses React to visualization currency exchange rate data (https://exchangeratesapi.io). Uses CSS flex elements to create a bar graph.

#### Update as of 4/4/2021:
I guess the people at exchangeratesapi.io got bought out or something, As there are now a couple of currency exchange rate APIs that have essentially the same website (https://fixer.io/ vs. https://exchangeratesapi.io/), so I assume someone is trying to make some money. According to this repo (https://github.com/benmajor/ExchangeRatesAPI) which is wrapper to the old API, the data can be found here: https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html

Rather than trying to build a scrapper for that website to get the latest data (future project?), I'm going to save a JSON file of a snapshot of data (the data is from 4/1/2021). I will put the code that uses this data rather than fetch the data from the API. The fetch code will still be in the main branch, but will likely not work.

As an aside, to get the fetch code to work, I simply need a URL where it returns an object with a base and rates key, base is a string with the country name for the base currency and the rates is an object with all the currencies stored by key, except the base. So something like:

data\
|--base: "EUR",\
|--rates:\
>|--USD: 1.2,\
>|--CAD: 1.3,\
>...

The data is structured such that the base exchanges 1 to whatever is under the rate (so in this case, 1 euro to 12 US dollars).
