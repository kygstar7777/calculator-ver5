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

    for (let year = 1; year <= 30; year++) {
        // 첫해 월 투자금
        const currentMonthlyInvestment = year === 1 ? monthlyInvestment : monthlyInvestment * Math.pow(1 + monthlyInvestmentGrowthRate, year - 1);
        
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
    }

    // 결과 출력
    let resultHTML = "<h2>계산 결과 | Calculation Results</h2>";
    resultHTML += "<table border='1'><tr><th>연도 | Year</th><th>연 배당금 | Annual Dividend (만원)</th><th>월 배당금 | Monthly Dividend (만원)</th><th>총 자산 | Total Assets (만원)</th><th>누적 투자 원금 | Cumulative Investment (만원)</th><th>누적 투자 배당금 | Cumulative Dividend (만원)</th></tr>";
    results.forEach(result => {
        resultHTML += `<tr>
            <td>${result.year}</td>
            <td>${(result.annualDividend / 10000).toFixed(2)}</td>
            <td>${(result.monthlyDividend / 10000).toFixed(2)}</td>
            <td>${(result.totalAssets / 10000).toFixed(2)}</td>
            <td>${(result.totalInvestment / 10000).toFixed(2)}</td>
            <td>${(result.totalDividends / 10000).toFixed(2)}</td>
        </tr>`;
    });
    resultHTML += "</table>";

    // 목표 달성 계산
    const yearsToTarget = results.findIndex(result => result.monthlyDividend >= targetMonthlyDividend) + 1;

    if (yearsToTarget > 0) {
        resultHTML += `<p>월 투자금 ${monthlyInvestment / 10000}만원으로 목표 월 배당금을 달성하기 위해서는 총 ${yearsToTarget}년이 걸립니다.</p>`;
    } else {
        resultHTML += `<p>목표 월 배당금을 달성할 수 없습니다. 월 투자금을 증가시키세요.</p>`;
    }
    
    resultHTML += "<p>경제적 자유를 위해 화이팅하세요!</p>";
    document.getElementById("results").innerHTML = resultHTML;
});
