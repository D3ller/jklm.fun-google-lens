// ==UserScript==
// @name         Log Elements and Send Images to Server on Google Lens
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Send every element with class 'LzliJc' and converted blob images in Base64 to server when they load on Google Lens and other sites.
// @author       You
// @include      *://*/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard:', text);
            })
            .catch(err => {
                console.error('Error copying text to clipboard:', err);
            });
    }


    function sendElementsToServer() {
        if (window.location.href.includes('lens.google.com')) {
            const elements = document.querySelectorAll('.LzliJc');

            const firstResponse = elements[0].textContent;
            copyToClipboard(firstResponse);

            if (data.length > 0) {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'http://localhost:7777/lens/url',
                    data: JSON.stringify({ elements: data }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function(response) {
                        console.log('Success:', response.responseText);
                    },
                    onerror: function(response) {
                        console.error('Error:', response.statusText);
                    }
                });
            }
        }
    }

    if (window.location.href.includes('lens.google.com')) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    sendElementsToServer();
                }
            });
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    const sentImages = new Set();

    function blobToBase64(blob, callback) {
        const reader = new FileReader();
        reader.onload = function() {
            const dataUrl = reader.result;
            const base64 = dataUrl.split(',')[1];
            callback(base64);
        };
        reader.readAsDataURL(blob);
    }

    function sendImageData(base64) {
        const hash = btoa(base64).substring(0, 50);
        if (sentImages.has(hash)) return;
        sentImages.add(hash);

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://localhost:7777/image',
            data: JSON.stringify({ imageData: `data:image/png;base64,${base64}` }),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log('Image data sent successfully:', hash);
                    const responseData = JSON.parse(response.responseText);
                    window.open(responseData.googleLensUrl, '_blank');
                } else {
                    console.error('Failed to send image data:', hash);
                }
            }
        });
    }

    setInterval(() => {
        document.querySelectorAll('.actual').forEach(element => {
            const style = getComputedStyle(element);
            const match = style.backgroundImage.match(/url\("?(blob:.+?)"?\)/);
            if (match) {
                const imageUrl = match[1];
                if (imageUrl.startsWith('blob:')) {
                    fetch(imageUrl)
                        .then(response => response.blob())
                        .then(blob => {
                            blobToBase64(blob, base64 => {
                                sendImageData(base64);
                            });
                        });
                }
            }
        });
    }, 1000);
})();
