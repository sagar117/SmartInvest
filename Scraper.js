const axios = require('axios');
const cheerio = require('cheerio');
const google = require('google');

// Function to scrape financial data for a specific stock
async function scrapeFinancialData(stockSymbol) {
  try {
    // Set the desired search query
    const searchQuery = `${stockSymbol} quarterly result Moneycontrol`;

    return new Promise(async (resolve, reject) => {
      try {
        // Perform a Google search to get the first link
        const firstLink = await getFirstGoogleSearchLink(searchQuery);
        console.log(firstLink)
        // Extract the actual URL
        const startIndex = firstLink.indexOf("/url?q=") + "/url?q=".length;
        const endIndex = firstLink.indexOf("&sa=U");

        const actualURL = firstLink.substring(startIndex, endIndex);
        console.log(actualURL);
        // firstLink=actualURL;
        
        if (actualURL) {
          // Proceed with scraping financial data using the extracted URL
          const financialData = await scrapeFinancialDataFromURL(actualURL);
          resolve(financialData);
        } else {
          console.error('No search results found for the query:', searchQuery);
          reject(new Error('No search results found for the query.'));
        }
      } catch (error) {
        console.error('Error during scraping:', error);
        reject(error);
      }
    });
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  }
}

// Function to get the first Google search link
async function getFirstGoogleSearchLink(query) {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl);

    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
    //   console.log($)

      const firstLink = $('div.egMi0 a').attr('href');
      console.log(firstLink)
      return firstLink;
    } else {
      console.error('Failed to retrieve search results from Google.');
      return null;
    }
  } catch (error) {
    console.error('Error during Google search:', error);
    return null;
  }
  return firstLink
}

// Function to scrape financial data from a specific URL
async function scrapeFinancialDataFromURL(url) {
    try {
        const moneyControlUrl = url
    
        const response = await axios.get(moneyControlUrl, {
          headers: {
            'User-Agent': 'Your User Agent',
          },
        });
    
        if (response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html);
    
          const relevantText = [];
    
          // Select specific elements containing relevant information and add their text to relevantText
          $('div#new-format table tr, div#new-format table td, div.blosum_section table td').each((index, element) => {
            relevantText.push($(element).text().trim());
          });
    
          // Concatenate the relevant text and log it
          const allRelevantText = relevantText.join('\n');
          console.log("Shruika");
          return allRelevantText
        } else {
          console.error('Failed to retrieve the Moneycontrol webpage for the stock symbol:', stockSymbol);
        }
      } catch (error) {
        console.error('Error scraping Moneycontrol:', error);
      }
}

module.exports = {
  scrapeFinancialData,
};

// Example usage:
// const stockSymbol = 'tcs';
// scrapeFinancialData(stockSymbol)
//   .then((financialData) => {
//     if (financialData) {
//       console.log(financialData);
//     } else {
//       console.log('No financial data found.');
//     }
//   })
//   .catch((error) => {
//     console.error('An error occurred:', error);
//   });
