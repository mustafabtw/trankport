// Resmi TCDD Kalkış Saatleri
const SINCAN_DEPARTURES = [
    "06:00", "06:15", "06:30", "06:45", "07:00", "07:10", "07:15", "07:20", "07:30", "07:40", "07:45", "07:50",
    "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45",
    "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45",
    "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45",
    "20:00", "20:15", "20:30", "20:45", "21:00", "21:30", "22:00", "22:30", "23:00"
];

const KAYAS_DEPARTURES = [
    "06:00", "06:15", "06:30", "06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:10", "08:15", "08:20",
    "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15",
    "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15",
    "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15",
    "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15",
    "20:30", "20:45", "21:00", "21:30", "22:00", "22:30", "23:00"
];

const STATION_OFFSETS = {
    "Sincan": 0, "Lale": 2, "Elvankent": 4, "Eryaman YHT": 6,
    "Özgüneş": 8, "Etimesgut": 10, "Havadurağı": 12, "Yıldırım": 14,
    "Behiçbey": 17, "Motor Durağı": 20, "Gazi": 22, "Gazi Mahallesi": 24,
    "Hipodrom": 26, "Ankara": 29, "Yenişehir": 33, "Kurtuluş": 34,
    "Cebeci": 36, "Demirlibahçe": 38, "Saimekadın": 40, "Mamak": 42,
    "Bağderesi": 44, "Üreğil": 45, "Köstence": 47, "Kayaş": 49
};

const stations = Object.keys(STATION_OFFSETS);

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
    
    // Her 15 saniyede bir otomatik yenile
    setInterval(calculateTime, 15000);
});

// Tren saati hesaplama motoru (Eskiden Python'daydı)
function getTrainTime(station, direction) {
    const now = new Date();
    const baseTimes = (direction === "sincan_kayas") ? SINCAN_DEPARTURES : KAYAS_DEPARTURES;
    const offset = (direction === "sincan_kayas") ? STATION_OFFSETS[station] : 49 - STATION_OFFSETS[station];

    for (let i = 0; i < baseTimes.length; i++) {
        let parts = baseTimes[i].split(':');
        let trainTime = new Date();
        trainTime.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
        trainTime.setMinutes(trainTime.getMinutes() + offset);

        if (trainTime > now) {
            let diffMs = trainTime - now;
            let diffMins = Math.floor(diffMs / 60000);
            
            // Saati 08:05 formatında almak için
            let hh = String(trainTime.getHours()).padStart(2, '0');
            let mm = String(trainTime.getMinutes()).padStart(2, '0');
            
            return {
                exact_time: `${hh}:${mm}`,
                minutes_left: diffMins
            };
        }
    }
    return { exact_time: "--:--", minutes_left: "Yok" };
}

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

    // Direkt cihazda hesapla (Sunucu bekleme süresi SIFIR!)
    const data = getTrainTime(station, direction);
    
    const resultArea = document.getElementById("result-area");
    resultArea.classList.remove("hidden");
    
    document.getElementById("minutes-left").innerText = data.minutes_left;
    document.getElementById("exact-time").innerText = data.exact_time;
}