// 活动详情页加载时获取并展示特定活动详情
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 从URL获取活动ID
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');
        
        if (!eventId) {
            document.getElementById('event-detail').innerHTML = '<p class="error">No event ID specified.</p>';
            return;
        }
        
        // 显示加载状态
        document.getElementById('event-detail').innerHTML = '<p class="loading">Loading event details...</p>';
        
        // 从API获取特定活动详情
        const response = await fetch(`/api/charity-events/${eventId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch event details');
        }
        
        const event = await response.json();
        
        // 获取相关机构信息
        const orgResponse = await fetch(`/api/organizations/${event.org_id}`);
        const organization = await orgResponse.json();
        
        // 获取相关类别信息
        const categoryResponse = await fetch(`/api/categories/${event.category_id}`);
        const category = await categoryResponse.json();
        
        // 渲染活动详情
        document.getElementById('event-detail').innerHTML = `
            <div class="event-header">
                <h1>${event.event_name}</h1>
                <span class="category">${category.category_name}</span>
                ${event.is_active ? '<span class="active">Active</span>' : '<span class="inactive">Inactive</span>'}
            </div>
            
            <div class="event-meta">
                <p><strong>Date & Time:</strong> ${new Date(event.event_date).toLocaleString()}</p>
                <p><strong>Location:</strong> ${event.event_location}</p>
                <p><strong>Organized by:</strong> ${organization.org_name}</p>
                <p><strong>Contact:</strong> ${organization.org_contact} | ${organization.org_email}</p>
            </div>
            
            <div class="event-description">
                <h2>About this event</h2>
                <p>${event.event_desc}</p>
            </div>
            
            <div class="event-goals">
                <h2>Fundraising Progress</h2>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${(event.event_progress / event.event_goal) * 100}%"></div>
                </div>
                <p class="progress-stats">$${event.event_progress.toFixed(2)} raised of $${event.event_goal.toFixed(2)}</p>
            </div>
            
            <div class="event-actions">
                <p><strong>Ticket Price:</strong> $${event.ticket_price.toFixed(2)}</p>
                ${event.is_active ? '<button class="buy-tickets">Buy Tickets</button>' : '<p class="event-ended">This event has ended</p>'}
            </div>
        `;
        
        // 添加购票按钮事件监听
        const buyButton = document.querySelector('.buy-tickets');
        if (buyButton) {
            buyButton.addEventListener('click', () => {
                alert(`You are purchasing tickets for ${event.event_name} at $${event.ticket_price.toFixed(2)} each.`);
                // 这里可以添加实际购票逻辑
            });
        }
    } catch (error) {
        console.error('Error loading event details:', error);
        document.getElementById('event-detail').innerHTML = '<p class="error">Failed to load event details. Please try again later.</p>';
    }
});
    