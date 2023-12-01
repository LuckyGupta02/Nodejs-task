const axios = require('axios');
const fs = require('fs');

const apiUrl = 'https://catfact.ninja/breeds';

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

async function logResponseToFile(data) {
  try {
    await fs.promises.writeFile('catBreedsResponse.txt', JSON.stringify(data, null, 2));
    console.log('Response logged to catBreedsResponse.txt');
  } catch (error) {
    console.error('Error writing to file:', error.message);
  }
}

async function getNumberOfPages() {
  try {
    const response = await fetchData(apiUrl);
    console.log('Number of pages:', response.last_page);
    return response.last_page;
  } catch (error) {
    console.error('Error fetching number of pages:', error.message);
    throw error;
  }
}

async function getAllPagesData(numPages) {
  const allData = [];
  for (let page = 1; page <= numPages; page++) {
    const pageUrl = `${apiUrl}?page=${page}`;
    const pageData = await fetchData(pageUrl);
    allData.push(...pageData.data);
  }
  return allData;
}

function groupByCountry(data) {
  const groupedData = {};
  data.forEach(breed => {
    const country = breed.origin;
    if (!groupedData[country]) {
      groupedData[country] = [];
    }
    groupedData[country].push({
      breed: breed.breed,
      origin: breed.origin,
      coat: breed.coat,
      pattern: breed.pattern,
    });
  });
  return groupedData;
}

(async () => {
  try {
    const numPages = await getNumberOfPages();
    const allPagesData = await getAllPagesData(numPages);
    const groupedByCountry = groupByCountry(allPagesData);

    // console.log(JSON.stringify(groupedByCountry, null, 2));

    await logResponseToFile(groupedByCountry);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
