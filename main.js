// ========== 日历数据与功能 ==========
class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        
        // 模拟发售事件数据
        this.events = {};
        this.loadEvents();
    }
    
    loadEvents() {
        // 从localStorage加载或使用默认数据
        const saved = localStorage.getItem('calendarEvents');
        if (saved) {
            this.events = JSON.parse(saved);
        } else {
            this.generateSampleEvents();
            this.saveEvents();
        }
    }
    
    saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(this.events));
    }
    
    generateSampleEvents() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        // 生成一些示例事件
        const sampleEvents = [
            { day: 5, type: 'new-release', title: 'Mind Wave 森林系列' },
            { day: 10, type: 'restock', title: '古川纸工 和风花' },
            { day: 15, type: 'preorder', title: 'Q-Lia 甜品贴纸' },
            { day: 20, type: 'new-release', title: 'Beverly 猫咪日常' },
            { day: 25, type: 'preorder', title: 'Kamio 星空系列' },
        ];
        
        sampleEvents.forEach(event => {
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(event.day).padStart(2, '0')}`;
            if (!this.events[key]) {
                this.events[key] = [];
            }
            this.events[key].push(event);
        });
    }
    
    getMonthDays(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    
    getFirstDayOfWeek(year, month) {
        return new Date(year, month, 1).getDay();
    }
    
    getEventForDate(year, month, day) {
        const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return this.events[key] || [];
    }
    
    renderCalendar(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const year = this.currentYear;
        const month = this.currentMonth;
        const daysInMonth = this.getMonthDays(year, month);
        const firstDay = this.getFirstDayOfWeek(year, month);
        const prevMonthDays = this.getMonthDays(year, month - 1);
        
        // 更新月份标题
        const monthTitle = document.getElementById('currentMonth');
        if (monthTitle) {
            const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            monthTitle.textContent = `${year}年${monthNames[month]}`;
        }
        
        container.innerHTML = '';
        const today = new Date();
        
        // 填充上月末尾日期
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            const dayEl = this.createDayElement(day, true, false);
            container.appendChild(dayEl);
        }
        
        // 填充本月日期
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = today.getFullYear() === year && 
                           today.getMonth() === month && 
                           today.getDate() === day;
            const dayEl = this.createDayElement(day, false, isToday);
            
            // 检查事件
            const events = this.getEventForDate(year, month, day);
            if (events.length > 0) {
                dayEl.classList.add('has-event');
                events.forEach(event => {
                    dayEl.classList.add(event.type);
                });
                dayEl.title = events.map(e => e.title).join('\n');
            }
            
            container.appendChild(dayEl);
        }
        
        // 填充下月开头日期
        const remainingCells = 42 - (firstDay + daysInMonth); // 6行 * 7列
        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = this.createDayElement(day, true, false);
            container.appendChild(dayEl);
        }
    }
    
    createDayElement(day, isOtherMonth, isToday) {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        div.textContent = day;
        
        if (isOtherMonth) div.classList.add('other-month');
        if (isToday) div.classList.add('today');
        
        return div;
    }
    
    prevMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderCalendar('calendarDays');
        this.updateUpcomingList();
    }
    
    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.renderCalendar('calendarDays');
        this.updateUpcomingList();
    }
    
    addEvent(dateStr, type, title) {
        if (!this.events[dateStr]) {
            this.events[dateStr] = [];
        }
        this.events[dateStr].push({ day: parseInt(dateStr.split('-')[2]), type, title });
        this.saveEvents();
        this.renderCalendar('calendarDays');
    }
    
    updateUpcomingList() {
        const container = document.getElementById('upcomingList');
        if (!container) return;
        
        // 获取未来30天内的事件
        const upcoming = [];
        const now = new Date();
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + i);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const events = this.events[key] || [];
            events.forEach(event => {
                upcoming.push({
                    date,
                    ...event
                });
            });
        }
        
        if (upcoming.length === 0) {
            container.innerHTML = `
                <div class="upcoming-item" style="justify-content: center; color: var(--text-light);">
                    暂无即将发售的贴纸
                </div>
            `;
            return;
        }
        
        container.innerHTML = upcoming.slice(0, 8).map(item => `
            <div class="upcoming-item">
                <div class="upcoming-date">
                    <span class="day">${item.date.getDate()}</span>
                    <span class="month">${item.date.getMonth() + 1}月</span>
                </div>
                <div class="upcoming-info">
                    <div class="title">${item.title}</div>
                    <div class="brand">${this.getTypeLabel(item.type)}</div>
                </div>
                <span class="upcoming-tag tag-${item.type}">
                    ${this.getTypeLabel(item.type)}
                </span>
            </div>
        `).join('');
    }
    
    getTypeLabel(type) {
        const labels = {
            'new-release': '新品发售',
            'restock': '再贩',
            'preorder': '预售开启'
        };
        return labels[type] || type;
    }
}

// 创建全局日历实例
const calendarManager = new CalendarManager();