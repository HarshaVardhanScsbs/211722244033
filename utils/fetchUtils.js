const axios = require('axios');

const fetchNumbersFromServer = async (url) => {
    try {
    const response = await axios.get(url, { timeout: 500 });
    return response.data.numbers || [];
} catch (err) {
    console.log("Error fetching from:", url);
    return [];
}
};

module.exports = { fetchNumbersFromServer };
