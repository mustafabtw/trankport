from flask import Flask, render_template, jsonify, request
from datetime import datetime, timedelta

app = Flask(__name__)

# Sincan kalkışlı seferler (Source 1 tablosundan)
SINCAN_DEPARTURES = [
    "06:00", "06:15", "06:30", "06:45", "07:00", "07:10", "07:15", "07:20", "07:30", "07:40", "07:45", "07:50",
    "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45",
    "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45",
    "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45",
    "20:00", "20:15", "20:30", "20:45", "21:00", "21:30", "22:00", "22:30", "23:00"
]

# Kayaş kalkışlı seferler (Source 2 tablosundan)
KAYAS_DEPARTURES = [
    "06:00", "06:15", "06:30", "06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:10", "08:15", "08:20",
    "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15",
    "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15",
    "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15",
    "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15",
    "20:30", "20:45", "21:00", "21:30", "22:00", "22:30", "23:00"
]

# TCDD tablolarına göre Sincan'dan Kayaş'a doğru istasyonların dakika farkları
STATION_OFFSETS = {
    "Sincan": 0, "Lale": 2, "Elvankent": 4, "Eryaman YHT": 6,
    "Özgüneş": 8, "Etimesgut": 10, "Havadurağı": 12, "Yıldırım": 14,
    "Behiçbey": 17, "Motor Durağı": 20, "Gazi": 22, "Gazi Mahallesi": 24,
    "Hipodrom": 26, "Ankara": 29, "Yenişehir": 33, "Kurtuluş": 34,
    "Cebeci": 36, "Demirlibahçe": 38, "Saimekadın": 40, "Mamak": 42,
    "Bağderesi": 44, "Üreğil": 45, "Köstence": 47, "Kayaş": 49
}

def get_train_time(station, direction):
    now = datetime.now()
    
    if direction == "sincan_kayas":
        base_times = SINCAN_DEPARTURES
        offset = STATION_OFFSETS[station]
    else: # kayas_sincan
        base_times = KAYAS_DEPARTURES
        offset = 49 - STATION_OFFSETS[station] # Tersten dakika farkı
        
    for time_str in base_times:
        h, m = map(int, time_str.split(':'))
        train_time = now.replace(hour=h, minute=m, second=0, microsecond=0) + timedelta(minutes=offset)
        
        if train_time > now:
            diff = int((train_time - now).total_seconds() / 60)
            return {
                "exact_time": train_time.strftime("%H:%M"),
                "minutes_left": diff
            }
            
    return {"exact_time": "--:--", "minutes_left": "Yok"}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_status', methods=['POST'])
def get_status():
    data = request.json
    station = data.get('station')
    direction = data.get('direction')
    
    result = get_train_time(station, direction)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)