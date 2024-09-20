document.addEventListener('DOMContentLoaded', () => {
    // Register the service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    }

    // Function to fetch files from the server and store them in IndexedDB
    function fetchAndStoreAssets() {
        // List of files you want to cache
        const files = [
            '/5478943.png',
            '/main.css',
            '/js/script.js'
            // Add paths to your other static files here
        ];

        files.forEach(file => {
            fetch(file)
                .then(response => response.blob())
                .then(blob => {
                    // Save file to IndexedDB
                    openDatabase().then(db => {
                        const transaction = db.transaction(['files'], 'readwrite');
                        const objectStore = transaction.objectStore('files');
                        const fileData = {
                            id: file,
                            fileName: file,
                            fileContent: URL.createObjectURL(blob)
                        };
                        objectStore.put(fileData);
                    });
                })
                .catch(error => {
                    console.error(`Failed to fetch and store ${file}:`, error);
                });
        });
    }

    fetchAndStoreAssets();
});
