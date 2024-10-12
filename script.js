document.getElementById("calculateButton").addEventListener("click", function() {
    // 입력값 가져오기
    const initialInvestment = parseFloat(document.getElementById("initialInvestment").value) * 10000; // 만원 단위
    const dividendRate = parseFloat(document.getElementById("dividendRate").value) / 100;
    const dividendGrowthRate = parseFloat(document.getElementById("dividendGrowthRate").value) / 100;
    const stockGrowthRate = parseFloat(document.getElementById("stockGrowthRate").value) / 100;
    const monthlyInvestment = parseFloat(document.getElementById("monthlyInvestment").value) * 10000; // 만원 단위
    const monthlyInvestmentGrowthRate = parseFloat(document.getElementById("monthlyInvestmentGrowthRate").value) / 100;
    const reinvestmentRate = parseFloat(document.getElementById("reinvestmentRate").value) / 100;
    const taxRate = parseFloat(document.getElementById("taxRate").value) / 100;
    const inflationRate = parseFloat(document.getElementById("inflationRate").value) / 100;
    const targetMonthlyDividend = parseFloat(document.getElementById("targetMonthlyDividend").value) * 10000; // 만원 단위

    // 결과 변수 초기화
    let results = [];
    let totalInvestment = initialInvestment;
    let totalDividends = 0;
    let accumulatedDividends = 0; // 누적 배당금 초기화
    let year = 0;

    while (true) {
        year++;
        // 첫해 월 투자금
        const currentMonthlyInvestment = monthlyInvestment * Math.pow(1 + monthlyInvestmentGrowthRate, year - 1);
        
        // 연 투자금
        const annualInvestment = totalInvestment + currentMonthlyInvestment * 12;

        // 첫해 배당금 계산
        const annualDividend = (annualInvestment * dividendRate) * reinvestmentRate * (1 - taxRate) * (1 - inflationRate);
        
        // 배당금 성장률 적용
        const adjustedDividend = annualDividend * Math.pow(1 + dividendGrowthRate, year - 1); // 배당금 성장률 적용
        
        // 총 자산
        const totalAssets = (annualInvestment + adjustedDividend) * (1 + stockGrowthRate);

        // 결과 저장
        results.push({
            year: year,
            annualDividend: adjustedDividend,
            monthlyDividend: adjustedDividend / 12,
            totalAssets: totalAssets,
            totalInvestment: totalInvestment + currentMonthlyInvestment * 12,
            totalDividends: accumulatedDividends + adjustedDividend
        });

        // 총 투자금과 배당금 업데이트
        totalInvestment += currentMonthlyInvestment * 12;
        accumulatedDividends += adjustedDividend;

        // 목표 달성 계산
        if (results[results.length - 1].monthlyDividend >= targetMonthlyDividend) {
            break;
        }
    }

    // 결과 출력
    let resultHTML = "<h2 id='resultTitle'>계산 결과 | Calculation Results</h2>";
    resultHTML += "<table border='1'><tr><th id='yearHeader'>연도 | Year</th><th id='annualDividendHeader'>연 배당금 | Annual Dividend (만원)</th><th id='monthlyDividendHeader'>월 배당금 | Monthly Dividend (만원)</th><th id='totalAssetsHeader'>총 자산 | Total Assets (만원)</th><th id='totalInvestmentHeader'>누적 투자 원금 | Cumulative Investment (만원)</th><th id='totalDividendsHeader'>누적 투자 배당금 | Cumulative Dividend (만원)</th></tr>";
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

    // 차트 그리기
    drawChart(results);
});

// 언어 전환 기능
document.getElementById("toggleLanguageButton").addEventListener("click", function() {
    const isKorean = document.getElementById("title").innerText.includes("배당금 계산기");
    if (isKorean) {
        document.getElementById("title").innerText = "Dividend Calculator | 배당금 계산기";
        document.getElementById("calculateButton").innerText = "Calculate";
        document.getElementById("toggleLanguageButton").innerText = "영어로 전환 | Switch to English";

        // 레이블 업데이트
        document.querySelectorAll(".input-group label").forEach((label, index) => {
            const englishLabels = [
                "Initial Investment (만원):",
                "Dividend Rate (%):",
                "Dividend Growth Rate (%):",
                "Stock Growth Rate (%):",
                "Monthly Investment (만원):",
                "Monthly Investment Growth Rate (%):",
                "Reinvestment Rate (%):",
                "Tax Rate (%):",
                "Inflation Rate (%):",
                "Target Monthly Dividend (만원):"
            ];
            label.innerText = englishLabels[index];
        });
        
        // 결과 테이블 헤더 업데이트
        document.getElementById("yearHeader").innerText = "Year";
        document.getElementById("annualDividendHeader").innerText = "Annual Dividend (만원)";
        document.getElementById("monthlyDividendHeader").innerText = "Monthly Dividend (만원)";
        document.getElementById("totalAssetsHeader").innerText = "Total Assets (만원)";
        document.getElementById("totalInvestmentHeader").innerText = "Cumulative Investment (만원)";
        document.getElementById("totalDividendsHeader").innerText = "Cumulative Dividend (만원)";
    } else {
        document.getElementById("title").innerText = "배당금 계산기 | Dividend Calculator";
        document.getElementById("calculateButton").innerText = "계산하기";
        document.getElementById("toggleLanguageButton").innerText = "Switch to English | 영어로 전환";

        // 레이블 업데이트
        document.querySelectorAll(".input-group label").forEach((label, index) => {
            const koreanLabels = [
                "초기 투자금 (만원):",
                "배당률 (%):",
                "배당 성장률 (%):",
                "주가 상승률 (%):",
                "월 투자금 (만원):",
                "월 투자금 증가율 (%):",
                "배당금 재투자율 (%):",
                "세율 (%):",
                "인플레이션 (%):",
                "목표 월 배당금 (만원):"
            ];
            label.innerText = koreanLabels[index];
        });
        
        // 결과 테이블 헤더 업데이트
        document.getElementById("yearHeader").innerText = "연도";
        document.getElementById("annualDividendHeader").innerText = "연 배당금 (만원)";
        document.getElementById("monthlyDividendHeader").innerText = "월 배당금 (만원)";
        document.getElementById("totalAssetsHeader").innerText = "총 자산 (만원)";
        document.getElementById("totalInvestmentHeader").innerText = "누적 투자 원금 (만원)";
        document.getElementById("totalDividendsHeader").innerText = "누적 투자 배당금 (만원)";
    }
});

// 차트 그리기 함수
function drawChart(results) {
    const ctx = document.getElementById("dividendChart").getContext("2d");
    const years = results.map(result => result.year);
    const monthlyDividends = results.map(result => result.monthlyDividend / 10000); // 만원 단위
    const totalAssets = results.map(result => result.totalAssets / 10000); // 만원 단위

    // 차트 그리기
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: '월 배당금 (만원)',
                    data: monthlyDividends,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
                {
                    label: '총 자산 (만원)',
                    data: totalAssets,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 숫자에 천 단위 구분 기호 추가
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
