document.getElementById("calculateButton").addEventListener("click", function() {
    // 입력값 가져오기
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

    // 결과 변수 초기화
    let results = [];
    let totalInvestment = initialInvestment;
    let totalDividends = 0;
    let accumulatedDividends = 0;
    let year = 0;

    while (true) {
        year++;
        const currentMonthlyInvestment = monthlyInvestment * Math.pow(1 + monthlyInvestmentGrowthRate, year - 1);
        const annualInvestment = totalInvestment + currentMonthlyInvestment * 12;
        const annualDividend = (annualInvestment * dividendRate) * reinvestmentRate * (1 - taxRate);
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

        if (results[results.length - 1].monthlyDividend >= targetMonthlyDividend) {
            break;
        }
    }

    let resultHTML = "<h2>계산 결과</h2>";
    resultHTML += "<table border='1'><tr><th>연도</th><th>연 배당금 (만원)</th><th>월 배당금 (만원)</th><th>총 자산 (만원)</th><th>누적 투자 원금 (만원)</th><th>누적 투자 배당금 (만원)</th></tr>";
    results.forEach(result => {
        resultHTML += `<tr>
            <td>${result.year}</td>
            <td>${numberWithCommas((result.annualDividend / 10000).toFixed(2))}</td>
            <td>${numberWithCommas((result.monthlyDividend / 10000).toFixed(2))}</td>
            <td>${numberWithCommas((result.totalAssets / 10000).toFixed(2))}</td>
            <td>${numberWithCommas((result.totalInvestment / 10000).toFixed(2))}</td>
            <td>${numberWithCommas((result.totalDividends / 10000).toFixed(2))}</td>
        </tr>`;
    });
    resultHTML += "</table>";
    document.getElementById("results").innerHTML = resultHTML;

    drawChart(results);
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function drawChart(results) {
    const ctx = document.getElementById('dividendChart').getContext('2d');
    const years = results.map(result => result.year);
    const monthlyDividends = results.map(result => result.monthlyDividend / 10000);
    const totalAssets = results.map(result => result.totalAssets / 10000);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: '월 배당금 (만원)',
                    data: monthlyDividends,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: '총 자산 (만원)',
                    data: totalAssets,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '금액 (만원)'
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

// 언어 전환 버튼 기능
document.getElementById("switchLanguage").addEventListener("click", function() {
    const isKorean = document.body.classList.toggle("korean");

    if (isKorean) {
        // 한국어로 변경
        document.querySelector("h1").innerText = "배당금 계산기";
        document.getElementById("switchLanguage").innerText = "영문 계산기로 전환";
        document.querySelector("label[for='initialInvestment']").innerText = "초기 투자금 (만원):";
        document.querySelector("label[for='dividendRate']").innerText = "배당률 (%):";
        document.querySelector("label[for='dividendGrowthRate']").innerText = "배당 성장률 (%):";
        document.querySelector("label[for='stockGrowthRate']").innerText = "주가 상승률 (%):";
        document.querySelector("label[for='monthlyInvestment']").innerText = "월 투자금 (만원):";
        document.querySelector("label[for='monthlyInvestmentGrowthRate']").innerText = "월 투자금 증가율 (%):";
        document.querySelector("label[for='reinvestmentRate']").innerText = "배당금 재투자율 (%):";
        document.querySelector("label[for='taxRate']").innerText = "세율 (%):";
        document.querySelector("label[for='inflationRate']").innerText = "인플레이션 (%):";
        document.querySelector("label[for='targetMonthlyDividend']").innerText = "목표 월 배당금 (만원):";
        document.getElementById("calculateButton").innerText = "계산하기";
    } else {
        // 영어로 변경
        document.querySelector("h1").innerText = "Dividend Calculator";
        document.getElementById("switchLanguage").innerText = "Switch to Korean Calculator";
        document.querySelector("label[for='initialInvestment']").innerText = "Initial Investment (10,000 won):";
        document.querySelector("label[for='dividendRate']").innerText = "Dividend Rate (%):";
        document.querySelector("label[for='dividendGrowthRate']").innerText = "Dividend Growth Rate (%):";
        document.querySelector("label[for='stockGrowthRate']").innerText = "Stock Growth Rate (%):";
        document.querySelector("label[for='monthlyInvestment']").innerText = "Monthly Investment (10,000 won):";
        document.querySelector("label[for='monthlyInvestmentGrowthRate']").innerText = "Monthly Investment Growth Rate (%):";
        document.querySelector("label[for='reinvestmentRate']").innerText = "Reinvestment Rate (%):";
        document.querySelector("label[for='taxRate']").innerText = "Tax Rate (%):";
        document.querySelector("label[for='inflationRate']").innerText = "Inflation (%):";
        document.querySelector("label[for='targetMonthlyDividend']").innerText = "Target Monthly Dividend (10,000 won):";
        document.getElementById("calculateButton").innerText = "Calculate";
    }
});
