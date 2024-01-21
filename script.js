(function  (w,  d,  t,  f)  {  
  w[f]  =  w[f]  ||  function  (c,  k,  n)  {  
    s  =  w[f],  k  =  s['k']  =  (s['k']  ||  (k  ?  ('&k='  +  k)  :  ''));  s['c']  =  
      c  =  (c  instanceof  Array)  ?  c  :  [c];  s['n']  =  n  =  n  ||  0;  L  =  d.createElement(t),  e  =  d.getElementsByTagName(t)[0];  
    L.async  =  1;  L.src  =  '//feed.aqicn.org/feed/'  +  (c[n].city)  +  '/'  +  (c[n].lang  ||  '')  +  '/feed.v1.js?n='  +  n  +  k;  
    e.parentNode.insertBefore(L,  e);  
  };  
})(window,  document,  'script',  '_aqiFeed'); 

// 模拟数据
  
  var casts=[];
// Replace '12345678' with your actual API key
  const tianqiMiyao = '14985a2a100707be5834102936113426';
  
  const areas = {
      area1: {
        name: '湾  梁',
        aqiPath: "guangdong/fushan/wanliang",
        cityCode: '440604'
      },
      area2: {
          name: '南  京',
          aqiPath: "nanjing",
          cityCode: '320100'
        },
      area3: {
          name: '武  汉',
          aqiPath: "wuhan",
          cityCode: '420100'
        }
  };
  //区域aqi对应名称
  const airQualityData = {
      area1: "guangdong/fushan/wanliang",
      area2: "nanjing",
      area3: "wuhan"
  };
//按钮标题，按需调整

function getAqi(area){
  _aqiFeed({    
    //display:"%cityname  AQI  is  %aqi<br><small>on  %date</small>",
    display:"%details%",
    container:"air-quality",    
    city:area,
    lang:"cn" 
  });  
}
  // Set button text based on the areas object
  document.getElementById("area1").innerText = areas['area1'].name;
  document.getElementById("area2").innerText = areas['area2'].name;
  document.getElementById("area3").innerText = areas['area3'].name;
  // 初始化显示数据
  getAqi(areas['area1'].aqiPath);
  getWeatherData(areas['area1'].cityCode);

  // 天气预报按钮点击事件
  $(".btn-info").click(function () {
      const day = $(this).attr("id");
      $("#weather-info").text(weatherData[day]);
  });

  // 空气质量按钮点击事件
  $(".btn-success").click(function () {
      const area = $(this).attr("id");
      //$("#air-quality").text(airQualityData[area]);
      getAqi(areas[area].aqiPath);
      getWeatherData(areas[area].cityCode);
  });;

  
// Function to dynamically create date buttons
function createButtons() {
  const dateButtonsContainer = document.getElementById('dateButtons');
  // Clear existing buttons
  dateButtonsContainer.innerHTML = '';

  casts.forEach(day => {
    const button = document.createElement('button');
    button.textContent = day.date;
    button.classList.add('btn', 'btn-info');
    button.addEventListener('click', () => displayWeatherInfo(day));
    dateButtonsContainer.appendChild(button);
  });
  // Display weather info for the first day by default
  displayWeatherInfo(casts[0]);
}

// Function to display weather info for a selected date
function displayWeatherInfo(day) {
  const weatherInfoContainer = document.getElementById('weather-info');
  const weatherInfo = `
    <div>
      <p>Date: ${day.date}</p>
    </div>
    <div class="weather-details">
      <div class="weather-left">
        <p>白天: ${day.dayweather}</p>
        <p>白天温度: ${day.daytemp}°C</p>
      </div>
      <div class="weather-right">
        <p>晚上: ${day.nightweather}</p>
        <p>晚上温度: ${day.nighttemp}°C</p>
      </div>
    </div>
      `;
  weatherInfoContainer.innerHTML = weatherInfo;
}

function getWeatherData(cityCode){
  // Send a GET request using fetch
  const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=${tianqiMiyao}&extensions=all`;  
  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          // Handle the API response data here
          //console.log(data);

          // Assuming you want to store the response data for later use
          const responseData = data;
          casts = responseData.forecasts[0].casts;
          //console.log(casts);
          createButtons();
          // Now you can work with 'responseData'
      })
      .catch(error => {
          // Handle errors during the fetch operation
          console.error('Error during fetch:', error);
      });
}