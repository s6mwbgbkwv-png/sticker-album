// ========== 主页初始化 ==========
function initializeHomePage() {
    // 渲染日历
    calendarManager.renderCalendar('calendarDays');
    calendarManager.updateUpcomingList();
    
    // 日历导航按钮
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        calendarManager.prevMonth();
    });
    document.getElementById('nextMonth')?.addEventListener('click', () => {
        calendarManager.nextMonth();
    });
    
    // 今日推荐
    renderTodayRecommendations();
    
    // 移动端菜单切换
    document.querySelector('.nav-toggle')?.addEventListener('click', () => {
        document.querySelector('.nav-menu')?.classList.toggle('active');
    });
    
    // 更新统计数据
    updateStats();
}

// ========== 今日推荐 ==========
function renderTodayRecommendations() {
    const container = document.getElementById('todayGrid');
    if (!container) return;
    
    // 随机选4个贴纸展示
    const shuffled = [...stickerData].sort(() => 0.5 - Math.random());
    const todayPicks = shuffled.slice(0, 4);
    
    container.innerHTML = todayPicks.map(item => `
        <div class="today-card">
            <div class="today-card-image">
                ${item.emoji || '📌'}
            </div>
            <div class="today-card-info">
                <div class="today-card-name">${item.name}</div>
                <div class="today-card-brand">${item.brand}</div>
                <div class="today-card-price">¥${item.price}</div>
            </div>
        </div>
    `).join('');
}

// ========== 更新统计数据 ==========
function updateStats() {
    const totalStickersEl = document.getElementById('totalStickers');
    const totalBrandsEl = document.getElementById('totalBrands');
    const newThisWeekEl = document.getElementById('newThisWeek');
    
    if (totalStickersEl) {
        animateNumber(totalStickersEl, stickerData.length);
    }
    if (totalBrandsEl) {
        const uniqueBrands = [...new Set(stickerData.map(s => s.brand))];
        animateNumber(totalBrandsEl, uniqueBrands.length);
    }
    if (newThisWeekEl) {
        // 模拟本周上新数量
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const newItems = stickerData.filter(s => new Date(s.releaseDate) >= weekAgo);
        animateNumber(newThisWeekEl, Math.max(newItems.length, 3));
    }
}

function animateNumber(element, target) {
    const duration = 1000;
    const start = parseInt(element.textContent) || 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (target - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ========== 意见箱初始化 ==========
function initializeFeedbackPage() {
    // 模拟已有反馈数据
    const sampleFeedbacks = [
        {
            id: 1,
            type: 'suggestion',
            title: '希望增加按颜色分类的功能',
            content: '可以按照贴纸的主色调进行分类，方便搭配手账时选择。',
            status: 'processing',
            date: '2024-01-20'
        },
        {
            id: 2,
            type: 'newsticker',
            title: '求添加MT胶带图鉴',
            content: '希望能增加MT和纸胶带的图鉴，配合贴纸一起使用。',
            status: 'adopted',
            date: '2024-01-18'
        },
        {
            id: 3,
            type: 'bug',
            title: '搜索功能偶尔无响应',
            content: '在iOS Safari上搜索时偶尔会出现卡顿现象。',
            status: 'processing',
            date: '2024-01-22'
        },
        {
            id: 4,
            type: 'suggestion',
            title: '希望有对比功能',
            content: '可以选择两个贴纸并排对比大小、价格等信息。',
            status: 'pending',
            date: '2024-01-23'
        },
    ];
    
    // 从localStorage加载
    const savedFeedbacks = localStorage.getItem('siteFeedbacks');
    const allFeedbacks = savedFeedbacks ? [...sampleFeedbacks, ...JSON.parse(savedFeedbacks)] : sampleFeedbacks;
    
    updateFeedbackStats(allFeedbacks);
    renderFeedbackList(allFeedbacks);
    
    // 反馈筛选
    document.querySelectorAll('.feedback-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.feedback-filter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const filtered = filter === 'all' ? allFeedbacks : allFeedbacks.filter(f => f.type === filter);
            renderFeedbackList(filtered);
            updateFeedbackStats(filter === 'all' ? allFeedbacks : filtered);
        });
    });
    
    // 表单提交
    document.getElementById('feedbackForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newFeedback = {
            id: Date.now(),
            type: document.getElementById('feedbackType').value,
            title: document.getElementById('feedbackTitle').value,
            content: document.getElementById('feedbackContent').value,
            contact: document.getElementById('feedbackContact').value,
            status: 'pending',
            date: new Date().toISOString().split('T')[0]
        };
        
        // 保存到localStorage
        const existing = JSON.parse(localStorage.getItem('siteFeedbacks') || '[]');
        existing.unshift(newFeedback);
        localStorage.setItem('siteFeedbacks', JSON.stringify(existing));
        
        // 更新显示
        allFeedbacks.unshift(newFeedback);
        renderFeedbackList(allFeedbacks);
        updateFeedbackStats(allFeedbacks);
        
        // 重置表单
        e.target.reset();
        showToast('感谢反馈！我们会认真考虑您的建议。', 'success');
    });
    
    // 移动端菜单
    document.querySelector('.nav-toggle')?.addEventListener('click', () => {
        document.querySelector('.nav-menu')?.classList.toggle('active');
    });
}

function renderFeedbackList(feedbacks) {
    const container = document.getElementById('feedbackList');
    if (!container) return;
    
    const typeLabels = {
        suggestion: '功能建议',
        newsticker: '求添加',
        bug: '问题报告',
        other: '其他'
    };
    
    const statusLabels = {
        adopted: '已采纳',
        processing: '处理中',
        pending: '待处理'
    };
    
    container.innerHTML = feedbacks.map(f => `
        <div class="feedback-item type-${f.type}">
            <div class="feedback-item-header">
                <span class="feedback-item-title">${f.title}</span>
                <span class="feedback-item-type type-${f.type}">${typeLabels[f.type]}</span>
            </div>
            <div class="feedback-item-content">${f.content}</div>
            <div class="feedback-item-status">
                <span class="status-${f.status}">● ${statusLabels[f.status]}</span>
                <span style="margin-left: 12px; color: var(--text-light); font-size: 0.8rem;">${f.date}</span>
            </div>
        </div>
    `).join('');
}

function updateFeedbackStats(feedbacks) {
    const suggestionCount = document.getElementById('suggestionCount');
    const adoptedCount = document.getElementById('adoptedCount');
    const processingCount = document.getElementById('processingCount');
    
    if (suggestionCount) suggestionCount.textContent = feedbacks.filter(f => f.type === 'suggestion').length;
    if (adoptedCount) adoptedCount.textContent = feedbacks.filter(f => f.status === 'adopted').length;
    if (processingCount) processingCount.textContent = feedbacks.filter(f => f.status === 'processing').length;
}

// ========== Toast提示 ==========
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}