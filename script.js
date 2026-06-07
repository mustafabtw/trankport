const stations = [
    "Sincan", "Lale", "Elvankent", "Eryaman YHT", "Özgüneş", "Etimesgut", 
    "Havadurağı", "Yıldırım", "Behiçbey", "Motor Durağı", "Gazi", "Gazi Mahallesi", 
    "Hipodrom", "Ankara", "Yenişehir", "Kurtuluş", "Cebeci", "Demirlibahçe", 
    "Saimekadın", "Mamak", "Bağderesi", "Üreğil", "Köstence", "Kayaş"
];

document.addEventListener("DOMContentLoaded", () => {
    // Intro animasyonu
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.classList.add('hidden'), 500);
        }
    }, 1500);

    // Seçiciyi doldur
    const select = document.getElementById("station-select");
    stations.forEach(station => {
        let option = document.createElement("option");
        option.value = station;
        option.text = station;
        select.appendChild(option);
    });
    
    setInterval(calculateTime, 20000);
});

function calculateTime() {
    const station = document.getElementById("station-select").value;
    const directionEl = document.querySelector('input[name="direction"]:checked');
    
    if (!station || !directionEl) return;
    const direction = directionEl.value;
    
    if (station === "Sincan" && direction === "kayas_sincan") {
        alert("Sincan istasyonunda Sincan yönüne gidemezsiniz."); return;
    }
    if (station === "Kayaş" && direction === "sincan_kayas") {
        alert("Kayaş istasyonunda Kayaş yönüne gidemezsiniz."); return;
    }

    fetch('/get_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ station: station, direction: direction })
    })
    .then(res => res.json())
    .then(data => {
        const resultArea = document.getElementById("result-area");
        
        // Sonuç kutudan çıkıp direkt arka planla bütünleşik hale geldi
        resultArea.classList.remove("hidden");
        
        document.getElementById("minutes-left").innerText = data.minutes_left;
        document.getElementById("exact-time").innerText = data.exact_time;
    });
}