

mapboxgl.accessToken = 'api tokenınız';
// Harita ayarları
var map = new mapboxgl.Map({
    container: 'harita',
    style: 'mapbox://styles/mericorhay/cm3z3ij20009q01sgbkub4x0k',
    center: [29.0, 41.0],
    zoom: 12
});


let data = null;


if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const userLocation = [position.coords.longitude, position.coords.latitude];

           
            map.flyTo({
                center: userLocation,
                zoom: 17,
                essential: true,
                pitch: 70,
                bearing: 0
            });

            
            new mapboxgl.Marker({ color: 'red' })
                .setLngLat(userLocation)
                .setPopup(new mapboxgl.Popup().setHTML('<b>Buradasınız</b>'))
                .addTo(map);

            // OpenWeatherMap API'den hava durumu verilerini al
            await fetchWeather(position.coords.latitude, position.coords.longitude);

            // Uyarıları kontrol et
            checkWarnings(data);
        },
        (error) => {
            console.error('Konum alınamadı:', error.message);
            alert('Konum alınamadı, lütfen tarayıcı ayarlarını kontrol edin.');
        }
    );
} else {
    alert('Tarayıcınız konum özelliğini desteklemiyor.');
}

// HTML elemanlarını seç
const cityElement = document.getElementById('city');
const temperatureElement = document.getElementById('temperature');
const windElement = document.getElementById('wind');
const windDirectionElement = document.getElementById('wind-direction');
const humidityElement = document.getElementById('humidity');
const pressureElement = document.getElementById('pressure');
const weatherDescElement = document.getElementById('weather-desc');
const visibilityElement = document.getElementById('visibility');


const API_KEY = 'openweather api';


async function fetchWeather(lat, lon) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(API_URL);
        data = await response.json(); // Global değişkeni güncelle

        // HTML elemanlarını API'den gelen verilerle güncelle
        cityElement.textContent = `Bölge: ${data.name}`;
        temperatureElement.textContent = `Sıcaklık: ${data.main.temp}°C`;
        windElement.textContent = `Rüzgar Hızı: ${data.wind.speed} m/s`;
        windDirectionElement.textContent = `Rüzgar Yönü: ${data.wind.deg}°`;
        humidityElement.textContent = `Nem: ${data.main.humidity}%`;
        pressureElement.textContent = `Basınç: ${data.main.pressure} hPa`;
        weatherDescElement.textContent = `Durum: ${data.weather[0].description}`;
        visibilityElement.textContent = `Görüş Mesafesi: ${(data.visibility / 1000).toFixed(2)} km`;

    } catch (error) {
        console.error('Hava durumu bilgisi alınamadı:', error);
        alert('Hava durumu bilgisi alınamadı!');
    }
}


function checkWarnings(data) {
    const kullaniciuyarilari = [
        document.getElementById('kullaniciuyarilari2'),
        document.getElementById('kullaniciuyarilari3'),
        document.getElementById('kullaniciuyarilari4'),
        document.getElementById('kullaniciuyarilari5'),
        document.getElementById('kullaniciuyarilari6')
    ];

    try {
        const uyarilar = [];

        if (data.main.temp < -2) {
            uyarilar.push("Uçuş Riskli: Sıcaklık Düşük");
        }
        else
        {
            uyarilar.push("Sıcaklık Güvenli");
        }
        if (data.wind.speed > 8) {
            uyarilar.push("Uçuş Riskli: Rüzgar Çok Kuvvetli");
        }
        else{
            uyarilar.push("Rüzgar Güvenli");
        }
        if (data.main.humidity > 90) {
            uyarilar.push("Uçuş Riskli: Nem Çok Yüksek");
        }
        else{
            uyarilar.push("Nem Güvenli");
        }
        
        if (data.visibility < 5000) {
            uyarilar.push("Uçuş Riskli: Görüş Mesafesi Düşük");
        }
        else{
            uyarilar.push("Görüş Mesafesi Güvenli");
        }
        if (data.main.pressure < 1000) {
            uyarilar.push("Uçuş Riskli: Basınç Düşük");
        }
        else{
            uyarilar.push("Basınç Güvenli");
        }

        // Uyarıları elementlere yazdır
        kullaniciuyarilari.forEach((elem, index) => {
            if (elem) {
                elem.textContent = uyarilar[index] || "Güvenli";
            }
        });
    } catch (error) {
        console.error('Uyarılar kontrol edilemedi:', error);
    }
}
