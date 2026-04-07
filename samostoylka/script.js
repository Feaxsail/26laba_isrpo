const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

async function convertCurrency(amount, from, to) {
    try {
        const response = await fetch(`${API_URL}${from}`);
        if (!response.ok) throw new Error('Ошибка загрузки курсов');
        const data = await response.json();
        const rate = data.rates[to];
        if (!rate) throw new Error('Валюта не найдена');
        return amount * rate;
    } catch (error) {
        console.error(error);
        return null;
    }
}

document.getElementById('convertBtn').addEventListener('click', async () => {
    const amountInput = document.getElementById('amount');
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const resultDiv = document.getElementById('result');

    let amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (isNaN(amount) || amountInput.value.trim() === '') {
        resultDiv.textContent = 'Пожалуйста, введите корректную сумму';
        return;
    }

    resultDiv.textContent = 'Конвертация...';
    const converted = await convertCurrency(amount, from, to);
    if (converted !== null) {
        resultDiv.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
    } else {
        resultDiv.textContent = 'Ошибка при конвертации. Попробуйте позже.';
    }
});