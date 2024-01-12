// Helper function which returns a promise which resolves once the service worker registration
// is past the "installing" state.
function waitUntilInstalled(registration) {
  return new Promise(function(resolve, reject) {
    if (registration.installing) {
      // If the current registration represents the "installing" service worker, then wait
      // until the installation step (during which the resources are pre-fetched) completes
      // to display the file list.
      registration.installing.addEventListener('statechange', function(e) {
        if (e.target.state === 'installed') {
          resolve();
        } else if (e.target.state === 'redundant') {
          reject();
        }
      });
    } else {
      // Otherwise, if this isn't the "installing" service worker, then installation must have been
      // completed during a previous visit to this page, and the resources are already pre-fetched.
      // So we can show the list of files right away.
      resolve();
    }
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js', {
    scope: './'
  })
    .then(waitUntilInstalled)
    // .then(showFilesList)
    .catch(function(error) {
      // Something went wrong during registration. The service-worker.js file
      // might be unavailable or contain a syntax error.
      document.querySelector('#status').textContent = error;
    });
} else {
  // The current browser doesn't support service workers.
  var aElement = document.createElement('a');
  aElement.href =
    'http://www.chromium.org/blink/serviceworker/service-worker-faq';
  aElement.textContent =
    'Service workers are not supported in the current browser.';
  document.querySelector('#status').appendChild(aElement);
}

document.querySelector('video').onloadedmetadata = function() {
  var fileName = this.currentSrc.replace(/^.*[\\\/]/, '');
  document.querySelector('#currentSrc').textContent = 'Video src: ' + fileName;
};

var CACHE_VERSION = 2;
var CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};
var urlsToPrefetch = [
  'https://storage.googleapis.com/media-session/sample.webm',
];
// 這裡放置你想要延遲執行的程式碼
// 建立一個 Date 物件
var currentDate = new Date();

// 取得當前的時間
var currentTime = currentDate.toLocaleTimeString();
console.log('當前時間:', currentTime);
console.log('start to add');
caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
  cache.addAll(urlsToPrefetch);    
})

// 定義要執行的函數
function myFunction() {
  // 建立一個 Date 物件
  var currentDate = new Date();

  // 取得當前的時間
  var currentTime = currentDate.toLocaleTimeString();

  // 列印出當前的時間
  console.log('當前時間:', currentTime);
  // 列出所有快取的清單
  caches.keys().then(function(cacheNames) {
    cacheNames.forEach(function(cacheName) {
      console.log('快取名稱:', cacheName);
    });
  });
}

// 設定每秒執行一次的間隔
var intervalID = setInterval(myFunction, 1000); // 1000 毫秒等於 1 秒

