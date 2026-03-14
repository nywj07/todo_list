/**
 * 计划待办工具 - 主脚本文件
 * 功能：实现待办事项的添加、完成、删除和存储功能
 */

// 从 localStorage 加载待办事项数据，如果没有则初始化为空数组
let todos = JSON.parse(localStorage.getItem('todos')) || [];

/**
 * 页面加载完成后的初始化函数
 * 渲染任务列表和更新统计信息
 */
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    updateStats();
});

/**
 * 添加新的待办事项
 * 获取输入框内容，创建新任务并保存到列表
 */
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    // 验证输入内容不能为空
    if (text === '') {
        alert('请输入要做的内容！');
        return;
    }
    
    // 创建新的任务对象
    const todo = {
        id: Date.now(),  // 使用时间戳作为唯一 ID
        text: text,
        completed: false  // 新任务默认为未完成状态
    };
    
    // 添加到任务数组
    todos.push(todo);
    
    // 保存到 localStorage
    saveTodos();
    
    // 重新渲染列表和更新统计
    renderTodos();
    updateStats();
    
    // 清空输入框并重新聚焦
    input.value = '';
    input.focus();
}

/**
 * 切换任务的完成状态
 * @param {number} id - 任务 ID
 */
function toggleTodo(id) {
    // 遍历所有任务，找到匹配 ID 的任务并切换其完成状态
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    // 保存更改并重新渲染
    saveTodos();
    renderTodos();
    updateStats();
}

/**
 * 删除指定的任务
 * @param {number} id - 要删除的任务 ID
 */
function deleteTodo(id) {
    // 过滤掉指定 ID 的任务
    todos = todos.filter(todo => todo.id !== id);
    
    // 保存更改并重新渲染
    saveTodos();
    renderTodos();
    updateStats();
}

/**
 * 将任务数据保存到 localStorage
 * 实现数据持久化，关闭页面后数据不丢失
 */
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * 渲染任务列表
 * 将任务分为未完成和已完成两组，分别渲染到左右两侧
 */
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const completedList = document.getElementById('completedList');
    
    // 分离未完成和已完成的任务
    const pendingTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);
    
    // 渲染未完成任务列表（左侧）
    if (pendingTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <p>暂无待办事项</p>
            </div>
        `;
    } else {
        todoList.innerHTML = pendingTodos.map(todo => `
            <li>
                <input 
                    type="checkbox" 
                    onchange="toggleTodo(${todo.id})"
                >
                <span>${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">删除</button>
            </li>
        `).join('');
    }
    
    // 渲染已完成任务列表（右侧）
    if (completedTodos.length === 0) {
        completedList.innerHTML = `
            <div class="empty-state">
                <p>暂无已完成</p>
            </div>
        `;
    } else {
        completedList.innerHTML = completedTodos.map(todo => `
            <li class="completed">
                <input 
                    type="checkbox" 
                    checked
                    onchange="toggleTodo(${todo.id})"
                >
                <span>${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">删除</button>
            </li>
        `).join('');
    }
}

/**
 * 更新顶部统计信息
 * 显示总任务数和已完成任务数
 */
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    
    document.getElementById('totalCount').textContent = `总任务：${total}`;
    document.getElementById('completedCount').textContent = `已完成：${completed}`;
}

/**
 * 处理回车键事件
 * 当用户在输入框中按回车时，自动添加任务
 * @param {Event} event - 键盘事件对象
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
}

/**
 * HTML 转义函数，防止 XSS 攻击
 * 将用户输入的特殊字符转换为 HTML 实体
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
