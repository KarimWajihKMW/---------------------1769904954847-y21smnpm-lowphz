console.log('Akwadra Services Loaded');

// --- Mock Data ---
const professionals = [
    {
        id: 1,
        name: "أحمد محمد",
        job: "سباك",
        rating: 4.8,
        reviews: 124,
        price: 50,
        image: "https://i.pravatar.cc/150?img=11",
        tags: ["صيانة", "تركيب", "طوارئ"]
    },
    {
        id: 2,
        name: "خالد العتيبي",
        job: "كهربائي",
        rating: 4.9,
        reviews: 89,
        price: 70,
        image: "https://i.pravatar.cc/150?img=13",
        tags: ["تأسيس", "إصلاح أعطال"]
    },
    {
        id: 3,
        name: "يوسف حسن",
        job: "نجار",
        rating: 4.6,
        reviews: 55,
        price: 60,
        image: "https://i.pravatar.cc/150?img=33",
        tags: ["أثاث", "أبواب", "مطابخ"]
    },
    {
        id: 4,
        name: "سارة علي",
        job: "مهندسة ديكور",
        rating: 5.0,
        reviews: 42,
        price: 150,
        image: "https://i.pravatar.cc/150?img=5",
        tags: ["تصميم داخلي", "استشارات"]
    },
    {
        id: 5,
        name: "عمر فاروق",
        job: "سباك",
        rating: 4.5,
        reviews: 76,
        price: 45,
        image: "https://i.pravatar.cc/150?img=60",
        tags: ["تسليك", "خزانات"]
    },
    {
        id: 6,
        name: "ماجد عبدالله",
        job: "كهربائي",
        rating: 4.7,
        reviews: 110,
        price: 65,
        image: "https://i.pravatar.cc/150?img=68",
        tags: ["إضاءة", "ذكية"]
    }
];

// --- State ---
let currentFilter = 'all';

// --- DOM Elements ---
const grid = document.getElementById('professionalsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const bookingModal = document.getElementById('bookingModal');
const modalContent = document.getElementById('modalContent');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModal');
const bookingForm = document.getElementById('bookingForm');
const modalProName = document.getElementById('modalProName');
const toast = document.getElementById('toast');
const searchInput = document.getElementById('searchInput');

// --- Functions ---

// 1. Render Cards
function renderCards(data) {
    grid.innerHTML = '';
    if (data.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500">لا يوجد نتائج مطابقة لبحثك.</div>`;
        return;
    }

    data.forEach((pro, index) => {
        const card = document.createElement('div');
        card.className = `pro-card bg-white rounded-2xl p-6 shadow-lg border border-slate-100 opacity-0 animate-fade-in-up`;
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Stars Generation
        const stars = Array(5).fill(0).map((_, i) => 
            i < Math.floor(pro.rating) 
            ? `<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`
            : `<svg class="w-4 h-4 text-slate-200" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`
        ).join('');

        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-4 space-x-reverse">
                    <img src="${pro.image}" alt="${pro.name}" class="w-16 h-16 rounded-full object-cover border-2 border-indigo-100">
                    <div>
                        <h3 class="font-bold text-lg text-slate-900">${pro.name}</h3>
                        <p class="text-indigo-600 text-sm font-medium">${pro.job}</p>
                    </div>
                </div>
                <span class="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded-lg">${pro.price} ريال/س</span>
            </div>
            
            <div class="flex items-center mb-4">
                <div class="flex ml-2">${stars}</div>
                <span class="text-xs text-slate-500">(${pro.reviews} تقييم)</span>
            </div>

            <div class="flex flex-wrap gap-2 mb-6">
                ${pro.tags.map(tag => `<span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">${tag}</span>`).join('')}
            </div>

            <button onclick="openBookingModal('${pro.name}')" class="w-full bg-slate-900 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-600 transition-colors duration-300 flex items-center justify-center gap-2 group">
                <span>حجز موعد</span>
                <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
        `;
        grid.appendChild(card);
    });
}

// 2. Filter Logic
function filterProfessionals(category) {
    currentFilter = category;
    
    // Update Buttons UI
    filterButtons.forEach(btn => {
        if(btn.dataset.category === category) {
            btn.classList.remove('bg-white', 'text-slate-600');
            btn.classList.add('bg-indigo-600', 'text-white');
        } else {
            btn.classList.add('bg-white', 'text-slate-600');
            btn.classList.remove('bg-indigo-600', 'text-white');
        }
    });

    // Filter Data
    if (category === 'all') {
        renderCards(professionals);
    } else {
        const filtered = professionals.filter(p => p.job === category);
        renderCards(filtered);
    }
}

// 3. Search Logic
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = professionals.filter(p => 
        p.name.includes(term) || 
        p.job.includes(term) ||
        p.tags.some(tag => tag.includes(term))
    );
    renderCards(filtered);
});

// 4. Modal Logic
window.openBookingModal = function(name) {
    modalProName.textContent = name;
    bookingModal.classList.remove('hidden');
    // Small delay to allow display:block to apply before opacity transition
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeBookingModal() {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        bookingModal.classList.add('hidden');
        bookingForm.reset();
    }, 300);
}

closeModalBtn.addEventListener('click', closeBookingModal);
modalOverlay.addEventListener('click', closeBookingModal);

// 5. Form Submission
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    closeBookingModal();
    
    // Show Toast
    toast.classList.remove('translate-y-24');
    setTimeout(() => {
        toast.classList.add('translate-y-24');
    }, 3000);
});

// 6. Category Click Handlers
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterProfessionals(btn.dataset.category);
    });
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderCards(professionals);
});