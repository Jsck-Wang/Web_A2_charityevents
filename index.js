// 首页加载时获取并展示所有慈善活动
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 获取活动列表容器
        const eventsContainer = document.getElementById('events-container');
        
        // 显示加载状态
        eventsContainer.innerHTML = '<p class="loading">Loading charity events...</p>';
        
        // 从API获取所有慈善活动
        const response = await fetch('/api/charity-events');
        
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        
        const events = await response.json();
        
        // 清空加载状态
        eventsContainer.innerHTML = '';
        
        // 如果没有活动
        if (events.length === 0) {
            eventsContainer.innerHTML = '<p>No charity events found.</p>';
            return;
        }
        
        // 遍历活动并创建HTML
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <h3>${event.event_name}</h3>
                <p class="date">${new Date(event.event_date).toLocaleString()}</p>
                <p class="location">${event.event_location}</p>
                <p class="description">${event.event_desc.substring(0, 100)}${event.event_desc.length > 100 ? '...' : ''}</p>
                <div class="progress">
                    <div class="progress-bar" style="width: ${(event.event_progress / event.event_goal) * 100}%"></div>
                    <span>${Math.round((event.event_progress / event.event_goal) * 100)}% of $${event.event_goal.toFixed(2)}</span>
                </div>
                <a href="event-detail.html?id=${event.event_id}" class="details-btn">View Details</a>
            `;
            eventsContainer.appendChild(eventCard);
        });
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('events-container').innerHTML = '<p class="error">Failed to load events. Please try again later.</p>';
    }
});
    