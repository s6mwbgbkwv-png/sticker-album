// ========== 贴纸图鉴数据 ==========
const stickerData = [
    {
        id: 1,
        name: '森林小动物贴纸',
        brand: 'Mind Wave',
        series: '动物系列',
        price: 680,
        category: 'animal',
        image: null, // 实际使用时替换为图片路径
        emoji: '🦊',
        description: '可爱的森林动物系列，包含狐狸、兔子、松鼠等多种动物图案。纸质优良，适合手账装饰。',
        releaseDate: '2024-01-15',
        tags: ['新品', '人气']
    },
    {
        id: 2,
        name: '和风花朵贴纸',
        brand: '古川纸工',
        series: '花卉系列',
        price: 550,
        category: 'flower',
        image: null,
        emoji: '🌸',
        description: '传统的和风花卉设计，采用和纸材质，质感温润，适合日系手账风格。',
        releaseDate: '2024-01-20',
        tags: ['人气']
    },
    {
        id: 3,
        name: '甜品派对',
        brand: 'Q-Lia',
        series: '食物系列',
        price: 720,
        category: 'food',
        image: null,
        emoji: '🍰',
        description: 'Q-Lia招牌甜品系列，马卡龙色系，闪闪发亮的烫金工艺。',
        releaseDate: '2024-02-01',
        tags: ['新品', '限定']
    },
    {
        id: 4,
        name: '猫咪日常贴纸包',
        brand: 'Beverly',
        series: '动物系列',
        price: 480,
        category: 'animal',
        image: null,
        emoji: '🐱',
        description: '记录猫咪日常的可爱贴纸包，包含各种猫咪姿势和表情。',
        releaseDate: '2024-01-10',
        tags: ['人气']
    },
    {
        id: 5,
        name: '星空物语',
        brand: 'Kamio Japan',
        series: '季节限定',
        price: 850,
        category: 'season',
        image: null,
        emoji: '⭐',
        description: '梦幻星空系列，使用特殊闪粉印刷，在光线下闪闪发光。冬季限定发售。',
        releaseDate: '2024-02-14',
        tags: ['限定', '新品']
    },
    {
        id: 6,
        name: '日常小物贴纸',
        brand: 'AIUEO',
        series: '日常系列',
        price: 600,
        category: 'daily',
        image: null,
        emoji: '📝',
        description: '简约风格的日常小物贴纸，包含文具、餐具等生活用品图案。',
        releaseDate: '2024-01-25',
        tags: []
    },
    {
        id: 7,
        name: '海洋生物贴纸',
        brand: 'Mind Wave',
        series: '动物系列',
        price: 680,
        category: 'animal',
        image: null,
        emoji: '🐠',
        description: '缤纷的海洋生物系列，色彩鲜艳，适合夏季手账装饰。',
        releaseDate: '2024-03-01',
        tags: ['新品']
    },
    {
        id: 8,
        name: '春日野餐',
        brand: 'Q-Lia',
        series: '季节限定',
        price: 780,
        category: 'season',
        image: null,
        emoji: '🧺',
        description: '春季限定野餐主题，包含三明治、水果、野餐篮等元素。',
        releaseDate: '2024-03-15',
        tags: ['限定', '人气']
    },
    {
        id: 9,
        name: '复古文具贴纸',
        brand: '古川纸工',
        series: '日常系列',
        price: 520,
        category: 'daily',
        image: null,
        emoji: '✒️',
        description: '复古风格的文具贴纸，怀旧色调，适合复古手账风格。',
        releaseDate: '2024-02-20',
        tags: []
    },
    {
        id: 10,
        name: '水果篮子',
        brand: 'Beverly',
        series: '食物系列',
        price: 450,
        category: 'food',
        image: null,
        emoji: '🍓',
        description: '新鲜可爱的水果系列，色彩鲜亮，适合夏季手账。',
        releaseDate: '2024-04-01',
        tags: ['新品']
    },
    {
        id: 11,
        name: '秋冬森林',
        brand: 'Mind Wave',
        series: '季节限定',
        price: 720,
        category: 'season',
        image: null,
        emoji: '🍂',
        description: '秋冬季节限定森林系列，温暖的色调，包含落叶、蘑菇等元素。',
        releaseDate: '2024-09-01',
        tags: ['限定']
    },
    {
        id: 12,
        name: '手绘花朵贴纸',
        brand: 'AIUEO',
        series: '花卉系列',
        price: 580,
        category: 'flower',
        image: null,
        emoji: '🌻',
        description: '手绘风格的花朵贴纸，清新自然，每张都是独特的设计。',
        releaseDate: '2024-03-20',
        tags: ['人气']
    },
];

// ========== 图鉴管理器 ==========
class GalleryManager {
    constructor() {
        this.data = stickerData;
        this.filteredData = [...this.data];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentView = 'grid';
        this.favorites = this.loadFavorites();
    }
    
    loadFavorites() {
        const saved = localStorage.getItem('stickerFavorites');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveFavorites() {
        localStorage.setItem('stickerFavorites', JSON.stringify(this.favorites));
    }
    
    toggleFavorite(id) {
        const index = this.favorites.indexOf(id);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(id);
        }
        this.saveFavorites();
        return this.favorites.includes(id);
    }
    
    filterData(searchTerm = '', brand = '', series = '', priceRange = '') {
        this.filteredData = this.data.filter(item => {
            // 搜索过滤
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const matchesName = item.name.toLowerCase().includes(term);
                const matchesBrand = item.brand.toLowerCase().includes(term);
                const matchesSeries = item.series.toLowerCase().includes(term);
                const matchesDesc = item.description.toLowerCase().includes(term);
                if (!matchesName && !matchesBrand && !matchesSeries && !matchesDesc) {
                    return false;
                }
            }
            
            // 厂家过滤
            if (brand && item.brand !== brand) return false;
            
            // 系列过滤
            if (series && item.series !== series) return false;
            
            // 价格过滤
            if (priceRange) {
                const [min, max] = priceRange.split('-').map(v => {
                    if (v.endsWith('+')) return Infinity;
                    return parseInt(v);
                });
                if (item.price < min || item.price > max) return false;
            }
            
            return true;
        });
        
        this.currentPage = 1;
        return this.filteredData;
    }
    
    getPageData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredData.slice(start, end);
    }
    
    getTotalPages() {
        return Math.ceil(this.filteredData.length / this.itemsPerPage);
    }
    
    renderGallery(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const pageData = this.getPageData();
        
        // 更新视图类名
        container.className = `gallery-grid ${this.currentView === 'list' ? 'list-view' : ''}`;
        
        if (pageData.length === 0) {
            document.getElementById('noResults').style.display = 'block';
            container.innerHTML = '';
        } else {
            document.getElementById('noResults').style.display = 'none';
            container.innerHTML = pageData.map(item => this.createCardHTML(item)).join('');
        }
        
        // 更新结果计数
        const resultCount = document.getElementById('resultCount');
        if (resultCount) {
            resultCount.textContent = `显示 ${this.filteredData.length} 个结果`;
        }
        
        // 更新分页
        this.renderPagination('pagination');
    }
    
    createCardHTML(item) {
        const isFav = this.favorites.includes(item.id);
        const imageContent = item.image 
            ? `<img src="${item.image}" alt="${item.name}" class="sticker-image-src" loading="lazy">`
            : `<span class="sticker-emoji">${item.emoji || '📌'}</span>`;
        
        const tagsHTML = item.tags.map(tag => 
            `<span class="sticker-tag">${tag}</span>`
        ).join('');
        
        return `
            <div class="sticker-card" data-id="${item.id}">
                <div class="sticker-image">
                    ${imageContent}
                    <span class="sticker-series">${item.series}</span>
                    <button class="sticker-fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); galleryManager.toggleFavorite(${item.id}); galleryManager.renderGallery('galleryGrid');">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="sticker-info">
                    <div class="sticker-name">${item.name}</div>
                    <div class="sticker-meta">
                        <span class="sticker-brand">${item.brand}</span>
                        <span class="sticker-price">¥${item.price}</span>
                    </div>
                    ${this.currentView === 'list' ? `
                        <div class="sticker-detail">${item.description}</div>
                        <div class="sticker-tags">${tagsHTML}</div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    renderPagination(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const totalPages = this.getTotalPages();
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let html = '';
        html += `<button ${this.currentPage === 1 ? 'disabled' : ''} onclick="galleryManager.goToPage(${this.currentPage - 1})">← 上一页</button>`;
        
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || 
                i === totalPages || 
                (i >= this.currentPage - 2 && i <= this.currentPage + 2)
            ) {
                html += `<button class="${i === this.currentPage ? 'active' : ''}" onclick="galleryManager.goToPage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                html += `<button disabled>...</button>`;
            }
        }
        
        html += `<button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="galleryManager.goToPage(${this.currentPage + 1})">下一页 →</button>`;
        
        container.innerHTML = html;
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderGallery('galleryGrid');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    setView(view) {
        this.currentView = view;
        document.querySelectorAll('.view-toggle .btn-icon').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        this.renderGallery('galleryGrid');
    }
}

// 创建全局图鉴实例
const galleryManager = new GalleryManager();

// ========== 页面初始化函数 ==========
function initializeGalleryPage() {
    galleryManager.renderGallery('galleryGrid');
    
    // 搜索事件
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            const brand = document.getElementById('brandFilter').value;
            const series = document.getElementById('seriesFilter').value;
            const price = document.getElementById('priceFilter').value;
            galleryManager.filterData(searchInput.value, brand, series, price);
            galleryManager.renderGallery('galleryGrid');
        }, 300));
    }
    
    // 筛选事件
    ['brandFilter', 'seriesFilter', 'priceFilter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', () => {
                const searchTerm = document.getElementById('searchInput')?.value || '';
                const brand = document.getElementById('brandFilter').value;
                const series = document.getElementById('seriesFilter').value;
                const price = document.getElementById('priceFilter').value;
                galleryManager.filterData(searchTerm, brand, series, price);
                galleryManager.renderGallery('galleryGrid');
            });
        }
    });
    
    // 重置筛选
    const resetBtn = document.getElementById('resetFilter');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            document.getElementById('brandFilter').value = '';
            document.getElementById('seriesFilter').value = '';
            document.getElementById('priceFilter').value = '';
            galleryManager.filterData('', '', '', '');
            galleryManager.renderGallery('galleryGrid');
        });
    }
    
    // 视图切换
    document.querySelectorAll('.view-toggle .btn-icon').forEach(btn => {
        btn.addEventListener('click', () => {
            galleryManager.setView(btn.dataset.view);
        });
    });
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}