// API 基础地址
const API_BASE_URL = 'http://localhost:3001/api';

// 首页：获取即将到来的事件
export async function getUpcomingEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}/events/upcoming`);
        if (!response.ok) {
            throw new Error('获取事件失败');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        throw error;
    }
}

// 搜索页：获取所有类别
export async function getCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
            throw new Error('获取类别失败');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

// 搜索页：搜索事件
export async function searchEvents(filters) {
    try {
        const params = new URLSearchParams();
        if (filters.date) params.append('date', filters.date);
        if (filters.location) params.append('location', filters.location);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);

        const response = await fetch(`${API_BASE_URL}/events/search?${params}`);
        if (!response.ok) {
            throw new Error('搜索事件失败');
        }
        return await response.json();
    } catch (error) {
        console.error('Error searching events:', error);
        throw error;
    }
}

// 详情页：获取事件详情
export async function getEventDetail(eventId) {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('事件不存在');
            }
            throw new Error('获取事件详情失败');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching event detail:', error);
        throw error;
    }
}