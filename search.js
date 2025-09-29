// 搜索功能实现
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const resultsContainer = document.getElementById('search-results');
    const searchCount = document.getElementById('search-count');
    
    // 页面加载时获取所有类别用于筛选
    loadCategories();
    
    // 表单提交事件
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        performSearch();
    });
    
    // 输入框实时搜索
    searchInput.addEventListener('input', debounce(performSearch, 500));
    
    // 类别筛选变化时搜索
    categoryFilter.addEventListener('change', performSearch);
    
    // 防抖函数，防止输入时频繁请求
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    // 加载所有活动类别
    async function loadCategories() {
        try {
            const response = await fetch('/api/categories');
            const categories = await response.json();
            
            // 添加默认选项
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'All Categories';
            categoryFilter.appendChild(defaultOption);
            
            // 添加类别选项
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_id;
                option.textContent = category.category_name;
                categoryFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }
    
    // 执行搜索
    async function performSearch() {
        const searchTerm = searchInput.value.trim();
        const categoryId = categoryFilter.value;
        
        // 显示加载状态
        resultsContainer.innerHTML = '<p class="loading">Searching...</p>';
        
        try {
            // 构建查询参数
            const params = new URLSearchParams();
            if (searchTerm) params.append('q', searchTerm);
            if (categoryId) params.append('category', categoryId);
            
            // 发送搜索请求
            const response = await fetch(`/api/charity-events/search?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error('Search failed');
            }
            
            const results = await response.json();
            
            // 更新结果计数
            searchCount.textContent = `${results.length} result(s) found`;
            
            // 显示结果
            if (results.length === 0) {
                resultsContainer.innerHTML = '<p class="no-results">No events found matching your criteria.</p>';
                return;
            }
            
            // 渲染搜索结果
            resultsContainer.innerHTML = '';
            results.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'search-result-card';
                eventCard.innerHTML = `
                    <h3><a href="event-detail.html?id=${event.event_id}">${event.event_name}</a></h3>
                    <p class="date">${new Date(event.event_date).toLocaleString()}</p>
                    <p class="location">${event.event_location}</p>
                    <p class="description">${event.event_desc.substring(0, 150)}${event.event_desc.length > 150 ? '...' : ''}</p>
                `;
                resultsContainer.appendChild(eventCard);
            });
        } catch (error) {
            console.error('Error during search:', error);
            resultsContainer.innerHTML = '<p class="error">An error occurred during search. Please try again.</p>';
        }
    }
});
    