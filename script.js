let currentLanguage = 'ko';

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

document.getElementById("calculateButton").addEventListener("click", function() {
    const initialInvestment = parseFloat(document.getElementById("initialInvestment").value) * 10000;
    const dividendRate = parseFloat(document.getElementById("dividendRate").value) / 100;
    const dividendGrowthRate = parseFloat(document.getElementById("dividendGrowthRate").value) / 100;
    const stockGrowthRate = parseFloat(document.getElementById("stockGrowthRate").value) / 100;
    const monthlyInvestment = parseFloat(document.getElementById("monthlyInvestment").value) * 10000;
    const monthlyInvestmentGrowthRate = parseFloat(document.getElementById("monthlyInvestmentGrowthRate").value) / 100;
    const reinvestmentRate = parseFloat(document.getElementById("reinvestmentRate").value) / 100;
    const taxRate = parseFloat(document.getElementById("taxRate").value) / 100;
    const inflationRate = parseFloat(document.getElementById("inflationRate").value) / 100;
    const targetMonthlyDividend = parseFloat(document.getElementById("targetMonthlyDividend").value) * 10000;

    let results = [];
    let totalInvestment = initialInvestment;
    let totalDividends = 0;
    let accumulatedDividends = 0;

    for (let year = 1; year <= 30; year++) {
        const currentMonthlyInvestment = year === 1 ? monthlyInvestment : monthlyInvestment * Math.pow(1 + monthlyInvestmentGrowthRate, year - 1);
        const annualInvestment = totalInvestment + currentMonthlyInvestment * 12;
        const annualDividend = (annualInvestment * dividendRate) * reinvestmentRate * (1 - taxRate) * (1 - inflationRate);
        const adjustedDividend = annualDividend * Math.pow(1 + dividendGrowthRate, year - 1);

        const totalAssets = (annualInvestment + adjustedDividend) * (1 + stockGrowthRate);

        results.push({
            year: year,
            annualDividend: adjustedDividend,
            monthlyDividend: adjustedDividend / 12,
            totalAssets: totalAssets,
            totalInvestment: totalInvestment + currentMonthlyInvestment * 12,
            totalDividends: accumulatedDividends + adjustedDividend
        });

        totalInvestment += currentMonthlyInvestment * 12;
        accumulatedDividends += adjustedDividend;
    }

    const yearsToTarget = results.findIndex(result => result.monthlyDividend >= targetMonthlyDividend) + 1;

    if (yearsToTarget > 0) {
        results = results.slice(0, yearsToTarget); // 결과를 목표 달성 연도까지만 저장
    }

    let resultHTML = "<h2>계산 결과</h2>";
    resultHTML += "<table border='1'><tr><th>연도</th><th>연 배당금 (만원)</th><th>월 배당금 (만원)</th><th>총 자산 (만원)</th><th>누적 투자 원금 (만원)</th><th>누적 투자 배당금 (만원)</th></tr>";
    results.forEach(result => {
        resultHTML += `<tr>
            <td>${result.year}</td>
            <td>${formatNumber(Math.round(result.annualDividend / 10000))}</td>
            <td>${formatNumber(Math.round(result.monthlyDividend / 10000))}</td>
            <td>${formatNumber(Math.round(result.totalAssets / 10000))}</td>
            <td>${formatNumber(Math.round(result.totalInvestment / 10000))}</td>
            <td>${formatNumber(Math.round(result.totalDividends / 10000))}</td>
        </tr>`;
    });
    resultHTML += "</table>";

    document.getElementById("results").innerHTML = resultHTML;

    drawChart(results);
});

function drawChart(results) {
    const ctx = document.getElementById('dividendChart').getContext('2d');
    const years = results.map(result => result.year);
    const monthlyDividends = results.map(result => Math.round(result.monthlyDividend / 10000));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: '월 평균 배당금',
                data: monthlyDividends,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '배당금 (만원)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '연도'
                    }
                }
            }
        }
    });
}

document.getElementById("langSwitch").addEventListener("click", function() {
    currentLanguage = currentLanguage === 'ko' ? 'en' : 'ko';
    switchLanguage();
});

function switchLanguage() {
    const elements = {
        "초기 투자금 (만원)": "Initial Investment (10,000 won)",
        "배당률 (%)": "Dividend Rate (%)",
        "배당 성장률 (%)": "Dividend Growth Rate (%)",
        "주가 상승률 (%)": "Stock Growth Rate (%)",
        "월 투자금 (만원)": "Monthly Investment (10,000 won)",
        "월 투자금 증가율 (%)": "Monthly Investment Growth Rate (%)",
        "배당금 재투자율 (%)": "Reinvestment Rate (%)",
        "세율 (%)": "Tax Rate (%)",
        "인플레이션 (%)": "Inflation Rate (%)",
        "목표 월 배당금 (만원)": "Target Monthly Dividend (10,000 won)",
        "계산하기": "Calculate",
        "영어로 전환": "Switch to Korean",
        "계산 결과": "Calculation Results",
        "연 배당금 (만원)": "Annual Dividend (10,000 won)",
        "월 배당금 (만원)": "Monthly Dividend (10,000 won)",
        "총 자산 (만원)": "Total Assets (10,000 won)",
        "누적 투자 원금 (만원)": "Total Investment (10,000 won)",
        "누적 투자 배당금 (만원)": "Total Dividends (10,000 won)",
    };

    document.querySelectorAll('label').forEach(label => {
        const text = label.innerText;
        label.innerText = currentLanguage === 'ko' ? text : elements[text];
    });

    document.getElementById("calculateButton").innerText = currentLanguage === 'ko' ? "계산하기" : "Calculate";
    document.getElementById("langSwitch").innerText = currentLanguage === 'ko' ? "영어로 전환" : "Switch to Korean";
    
    if (currentLanguage === 'en') {
        const resultsTable = document.querySelector("#results table");
        if (resultsTable) {
            resultsTable.querySelector('th:nth-child(1)').innerText = "Year";
            resultsTable.querySelector('th:nth-child(2)').innerText = "Annual Dividend (10,000 won)";
            resultsTable.querySelector('th:nth-child(3)').innerText = "Monthly Dividend (10,000 won)";
            resultsTable.querySelector('th:nth-child(4)').innerText = "Total Assets (10,000 won)";
            resultsTable.querySelector('th:nth-child(5)').innerText = "Total Investment (10,000 won)";
            resultsTable.querySelector('th:nth-child(6)').innerText = "Total Dividends (10,000 won)";
        }
    }
}

