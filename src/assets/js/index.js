let page = 1;
let limit = 5;
let loading = false;
let hasMoreData = true; 

// เปิดฐานข้อมูล IndexedDB
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('cdn', 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore('files', { keyPath: 'id' });
            objectStore.createIndex('fileName', 'fileName', { unique: false });
        };
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

openDatabase()

// เก็บไฟล์ลงใน IndexedDB
function saveFileToDatabase(id, fileName, fileContent) {
    return openDatabase().then(db => {
        const transaction = db.transaction(['files'], 'readwrite');
        const objectStore = transaction.objectStore('files');
        const fileData = { id, fileName, fileContent };
        objectStore.put(fileData);
    });
}

// ดึงไฟล์จาก IndexedDB
function fetchFileFromDatabase(fileName) {
    return openDatabase().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['files'], 'readonly');
            const objectStore = transaction.objectStore('files');
            const index = objectStore.index('fileName');
            const request = index.get(fileName);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}


async function fetchAnimes(page) {
    if (!hasMoreData || loading) return; // Don't fetch if no more data or already loading

    loading = true;
    document.getElementById('loading').classList.remove('hidden');

    // Show skeleton loaders
    showSkeletonLoaders();

    try {
        const response = await fetch(`https://ani-night.online/api/v2/animes?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'x-api-key': '1774bcb5-9e11-4ee0-b93d-a970c1da34fb',
            }
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // ตรวจสอบโครงสร้างข้อมูล

        const animeGrid = document.getElementById('animeGrid');
        animeGrid.innerHTML = ''; // Clear previous skeletons

        if (Array.isArray(data.Animelists)) {
            if (data.Animelists.length === 0) {
                hasMoreData = false; // No more data to load
                document.getElementById('loading').textContent = 'No more data'; // Optional: show message
            } else {
                data.Animelists.forEach(anime => {
                    const imageUrl = typeof anime.poster === 'string' ? getImageUrl(anime.poster) : '';

                    const animeCard = `
                        <div class="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
                            <a href="/list/anime/${anime.urlslug}">
                                <img src="${imageUrl}" alt="${anime.title}" class="w-full h-[200px] md:h-[300px] object-cover rounded">
                                <h3 class="mt-2 text-lg font-semibold">${anime.title}</h3>
                            </a>
                            <p class="text-sm text-gray-600">${anime.categories ? anime.categories.join(', ') : 'Unknown genre'}</p>
                        </div>
                    `;
                    animeGrid.insertAdjacentHTML('beforeend', animeCard);
                });
                page += 1; // Move to the next page if data is loaded successfully
            }
        } else {
            console.error("Expected 'Animelists' in API response but got:", data);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loading = false;
        document.getElementById('loading').classList.add('hidden');
    }
}

function showSkeletonLoaders() {
    const animeGrid = document.getElementById('animeGrid');
    animeGrid.innerHTML = ''; // Clear previous content

    for (let i = 0; i < limit; i++) {
        const skeletonCard = `
            <div class="bg-gray-200 p-4 rounded shadow animate-pulse">
                <div class="h-[200px] md:h-[300px] bg-gray-300 rounded"></div>
                <div class="mt-2 h-6 bg-gray-300 rounded w-3/4"></div>
                <div class="h-4 bg-gray-300 rounded mt-2"></div>
            </div>
        `;
        animeGrid.insertAdjacentHTML('beforeend', skeletonCard);
    }
}

// Load more data on scroll
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !loading) {
        fetchAnimes(page);
    }
});

fetchAnimes(page);

function getImageUrl(image) {
    if (typeof image === 'string' && (image.startsWith('http') || image.startsWith('https'))) {
        return image;
    } else {
        return `https://ani-night.online/uploads/posters/${image || 'default-image.jpg'}`;
    }
}