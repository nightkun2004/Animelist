// Function to get the image URL
function getImageUrl(image) {
    if (typeof image === 'string' && (image.startsWith('http') || image.startsWith('https'))) {
        return image;
    } else {
        return `https://ani-night.online/uploads/posters/${image || 'default-image.jpg'}`;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const animeContainer = document.getElementById('anime-container');
    const urlslug = animeContainer.dataset.urlslug;
    const apiKey = '1774bcb5-9e11-4ee0-b93d-a970c1da34fb'; // ใส่ API key ที่ต้องการ

    if (!urlslug) {
        console.error('URL slug not found!');
        return;
    }

    // Fetch anime info from the API
    axios.get(`https://ani-night.online/api/v2/anime/info/${urlslug}`, {
        headers: {
            'x-api-key': apiKey
        }
    })
        .then(response => {
            const animeData = response.data.anime;
            console.log(animeData)

            // Remove skeleton loaders and populate data
            document.getElementById('anime-banner').classList.remove('skeleton');
            document.getElementById('anime-banner').style.backgroundImage = `url(${getImageUrl(animeData.banner)})`;

            document.getElementById('anime-poster').classList.remove('skeleton');
            document.getElementById('anime-poster').innerHTML = `<img src="${getImageUrl(animeData.poster)}" alt="${animeData.title}" class="w-full h-full object-cover rounded">`;

            document.getElementById('anime-info').querySelector('h1').classList.remove('skeleton');
            document.getElementById('anime-info').querySelector('h1').textContent = animeData.title;

            document.getElementById('anime-info').querySelector('p').classList.remove('skeleton');
            document.getElementById('anime-info').querySelector('p').textContent = animeData.synopsis;

            // Additional anime details
            const animeDetails = `
                <p><strong>ประเภท:</strong> ${animeData.animetype}</p>
                <p><strong>ปีที่ออกฉาย:</strong> ${animeData.year}</p>
                <p><strong>ฤดูกาล:</strong> ${animeData.season}</p>
                <p><strong>เสียงพากย์:</strong> ${animeData.voice}</p>
            `;
            document.getElementById('anime-details').classList.remove('skeleton');
            document.getElementById('anime-details').innerHTML = animeDetails;

            // Streaming platforms
            // Streaming platforms
            const platformsContainer = document.getElementById('streaming-platforms');
            platformsContainer.querySelector('h2').classList.remove('skeleton');
            platformsContainer.querySelector('h2').textContent = 'ช่องทางการรับชม';

            const platformGrid = platformsContainer.querySelector('.grid');
            platformGrid.innerHTML = ''; // Clear skeletons

            if (animeData.streaming.length > 0) {
                animeData.streaming.forEach(platform => {
                    // ตรวจสอบว่ามีลิงก์ในแต่ละแพลตฟอร์มหรือไม่
                    const platforms = {
                        bilibili: platform.bilibili,
                        crunchyroll: platform.crunchyroll,
                        iqiyi: platform.iqiyi
                    };

                    // Loop through the platforms to check for non-empty links
                    for (const [name, link] of Object.entries(platforms)) {
                        if (link && link.trim() !== "") {
                            platformGrid.innerHTML += `
                            <div class="bg-white rounded shadow p-4 text-center">
                                <a href="${link}" target="_blank" class="text-blue-600 font-semibold">
                                    รับชมผ่าน ${name.charAt(0).toUpperCase() + name.slice(1)}
                                </a>
                            </div>`;
                        }
                    }
                });
            } else {
                platformGrid.innerHTML = '<p>ไม่มีแพลตฟอร์มสตรีมมิ่งในขณะนี้</p>';
            }

        })
        .catch(error => {
            console.error('Error fetching anime data:', error);
        });
});