document.getElementById("languageToggle").addEventListener("click", switchLanguage);
document.getElementById("calculateButton").addEventListener("click", calculateDividends);

let isKorean = true; // 기본 언어 설정

function switchLanguage() {
    isKorean = !isKorean; // 언어 전환
    updateLanguage();
}

function updateLanguage() {
    const title = isKorean ? "배당금 계산기 (Dividend Calculator)" : "Dividend Calculator";
    const buttonText = isKorean ? "언어 전환 (Switch Language)" : "Switch Language";
    const calculateText = isKorean ? "계산하기 (Calculate)" : "Calculate";
    
    document.getElementById("title").innerText = title;
    document.getElementById("languageToggle").innerText = buttonText;
    document.getElementById("calculateButton").innerText = calculateText;

    // 입력 필드의 라벨 업데이트
    const labels = [
        "초기 투자금 (Initial Investment, 만원)",
        "배당률 (Dividend Rate, %)",
        "배당 성장률 (Dividend Growth Rate, %)",
        "주가 상승률 (Stock Growth Rate, %)",
        "월 투자금 (Monthly Investment, 만원)",
        "월 투자금 증가율 (Monthly Investment Growth Rate, %)",
        "배당금 재투자율 (Reinvestment Rate, %)",
        "세율 (Tax Rate, %)",
        "인플레이션 (Inflation Rate, %)",
        "목표 월 배당금 (Target Monthly Dividend, 만원)"
    ];

    labels.forEach((label, index) => {
        document.querySelectorAll("label")[index].innerText = isKorean ? label : label.split(" (")[0];
    });

    // 결과 메시지 업데이트
    document.getElementById("resultMessage").innerText = "";
}

function calculateDividends() {
    const initialInvestment = parseFloat(document.getElementById("initialInvestment").value) * 10000; // 만원 단위
    const dividendRate = parseFloat(document.getElementById("dividendRate").value) / 100;
    const dividendGrowthRate = parseFloat(document.getElementById("dividendGrowthRate").value) / 100;
    const stockGrowthRate = parseFloat(document.getElementById("stockGrowthRate").value) / 100;
    const monthlyInvestment = parseFloat(document.getElementById("monthlyInvestment").value) * 10000;
    const monthlyInvestmentGrowthRate = parseFloat(document.getElementById("monthlyInvestmentGrowthRate").value) / 100;
    const reinvestmentRate = parseFloat(document.getElementById("reinvestmentRate").value) / 100;
    const taxRate = parseFloat(document.getElementById("taxRate").value) / 100;
    const inflationRate = parseFloat(document.getElementById("inflationRate").value) / 100;
    const targetMonthlyDividend = parseFloat(document.getElementById("targetMonthlyDividend").value) * 10000;

    // 결과 테이블 초기화
    const resultsTableBody = document.getElementById("resultsTable").querySelector("tbody");
    resultsTableBody.innerHTML = ""; // 기존 데이터 삭제

    let totalInvestment = initialInvestment;
    let totalDividends = 0;
    let year = 0;
    let monthlyInvestmentCurrent = monthlyInvestment;
    const results = [];

    while (true) {
        year++;

        // 첫해와 둘째해 월 투자금 계산
        if (year > 1) {
            monthlyInvestmentCurrent *= (1 + monthlyInvestmentGrowthRate);
        }

        // 연 투자금 및 연 배당금 계산
        const annualInvestment = totalInvestment + (monthlyInvestmentCurrent * 12);
        const annualDividend = annualInvestment * dividendRate * reinvestmentRate * (1 - taxRate) * (1 - inflationRate);

        // 연말 총 자산 계산
        totalInvestment += (annualDividend + (monthlyInvestmentCurrent * 12));
        const totalAssets = (annualInvestment + annualDividend) * (1 + stockGrowthRate);

        // 누적 투자 배당금 및 총 자산
        totalDividends += annualDividend;

        // 결과 저장
        results.push({
            year: year,
            annualDividend: annualDividend,
            monthlyDividend: annualDividend / 12,
            totalAssets: totalAssets,
            cumulativeInvestment: totalInvestment,
            cumulativeDividends: totalDividends
        });

        // 목표 월 배당금 도달 여부 확인
        if (results[results.length - 1].monthlyDividend >= targetMonthlyDividend) {
            break;
        }
    }

    // 결과 테이블에 데이터 추가
    results.forEach(result => {
        const row = resultsTableBody.insertRow();
        row.insertCell(0).innerText = result.year;
        row.insertCell(1).innerText = result.annualDividend.toLocaleString();
        row.insertCell(2).innerText = result.monthlyDividend.toLocaleString();
        row.insertCell(3).innerText = result.totalAssets.toLocaleString();
        row.insertCell(4).innerText = result.cumulativeInvestment.toLocaleString();
        row.insertCell(5).innerText = result.cumulativeDividends.toLocaleString();
    });

    // 목표 달성을 위한 총 기간 계산
    document.getElementById("resultMessage").innerText = 
        `월 투자금 ${monthlyInvestmentCurrent.toLocaleString()}만원으로 목표 월 배당금을 달성하기 위해서는 총 ${year}년이 걸립니다. 경제적 자유를 위해 화이팅하세요!`;

    // 그래프 그리기
    drawChart(results);
}

function drawChart(results) {
    const ctx = document.getElementById("dividendChart").getContext("2d");
    const labels = results.map(result => result.year);
    const monthlyDividends = results.map(result => result.monthlyDividend);

    const data = {
        labels: labels,
        datasets: [{
            label: '월 평균 배당금',
            data: monthlyDividends,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '배당금 (원)'
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
    };

    new Chart(ctx, config);
}

