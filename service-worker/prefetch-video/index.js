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

// 使用 setTimeout 函數
setTimeout(function() {
  var CACHE_VERSION = 2;
  var CURRENT_CACHES = {
    prefetch: 'prefetch-cache-v' + CACHE_VERSION
  };
  var urlsToPrefetch = [
    'https://youtu.be/4m0ib2mt0M0?si=w8jSZX70iYqJTFpU',
  ];
  // 這裡放置你想要延遲執行的程式碼
  caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
    cache.addAll(urlsToPrefetch);
  })

  // 取得 <video> 元素
  var videoElement = document.getElementById('video');

  // 取得第一個 <source> 元素
  var sourceElement = videoElement.getElementsByTagName('source')[0];

  // 設定新的影片 URL
  var newVideoURL = 'https://youtu.be/4m0ib2mt0M0?si=w8jSZX70iYqJTFpU';

  // 改變 <source> 元素的影片 URL
  sourceElement.src = newVideoURL;

  // 重新載入影片
  videoElement.load();

}, 5000); // 5000 毫秒等於 5 秒

