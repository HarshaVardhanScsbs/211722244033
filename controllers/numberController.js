const mysqlPool = require("../config/db");
const { fetchNumbersFromServer } = require("../utils/fetchUtils");

const WINDOW_SIZE = 10;

const processNumberID = async (req, res) => {
    const numberid = req.params.numberid;
    const validIDs = { p:"primes", f:"fibo", e:"even", r:"rand" };

    if (!validIDs[numberid])
    return res.status(400).json({ 
        success: false, 
        message: "Invalid number ID" 
    });

    const endpoint = `http://20.244.56.144/evaluation-service/${validIDs[numberid]}`;

    try {
    const [prev] = await mysqlPool.query("select value from numbers order by id asc");
    const windowPrevState = prev.map(row => row.value);

    const apiNumbers = await fetchNumbersFromServer(endpoint);
    const uniqueNew = apiNumbers.filter(num => !windowPrevState.includes(num));

    let updatedWindow = [...windowPrevState, ...uniqueNew];
    updatedWindow = [...new Set(updatedWindow)];

    
    while (updatedWindow.length > WINDOW_SIZE) {
        updatedWindow.shift();
    }

    
    await mysqlPool.query("delete from numbers");
    for (const val of updatedWindow) {
        await mysqlPool.query("insert into numbers (value) values (?)", [val]);
    }

    const avg = updatedWindow.reduce((a, b) => a + b, 0) / updatedWindow.length;

    res.status(200).json({
        windowPrevState,
        windowCurrState: updatedWindow,
        numbers: apiNumbers,
        avg: parseFloat(avg.toFixed(2))
    });

    } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error", err });
    }
};

module.exports = { processNumberID };
