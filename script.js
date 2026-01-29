let todos = [];
let habits = [];
let goals = [];

const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const habitInput = document.getElementById('habitInput');
const habitList = document.getElementById('habitList');
const goalInput = document.getElementById('goalInput');
const goalTarget = document.getElementById('goalTarget');
const goalList = document.getElementById('goalList');
const calendar = document.getElementById('calendar');
const overlay = document.getElementById('overlay');
const dayModal = document.getElementById('dayModal');
const dayTitle = document.getElementById('dayTitle');
const dayInfo = document.getElementById('dayInfo');
const radar = document.getElementById('radar');

function saveData() {
    const data = {
        todos,
        habits,
        goals,
        lastSaved: new Date().toISOString()
    };
    localStorage.setItem('focusflow-data', JSON.stringify(data));
}

function loadData() {
    try {
        const saved = localStorage.getItem('focusflow-data');
        if (saved) {
            const data = JSON.parse(saved);
            todos = data.todos || [];
            habits = data.habits || [];
            goals = data.goals || [];

            renderTodos();
            renderHabits();
            renderGoals();
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function addTodo() {
    const text = todoInput.value.trim();

    if (!text) {
        showNotification('Please enter a task', 'warning');
        return;
    }

    if (text.length > 100) {
        showNotification('Task is too long (max 100 characters)', 'warning');
        return;
    }

    todos.push({
        id: Date.now(),
        text,
        done: false,
        createdAt: new Date().toISOString()
    });

    todoInput.value = '';
    renderTodos();
    saveData();
    showNotification('Task added!', 'success');
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.done = !todo.done;
        renderTodos();
        saveData();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
    saveData();
    showNotification('Task deleted', 'info');
}

function renderTodos() {
    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        return;
    }

    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `row ${todo.done ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        checkbox.onchange = () => toggleTodo(todo.id);

        const span = document.createElement('span');
        span.textContent = todo.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteTodo(todo.id);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

function addHabit() {
    const name = habitInput.value.trim();

    if (!name) {
        showNotification('Please enter a habit', 'warning');
        return;
    }

    if (name.length > 50) {
        showNotification('Habit name is too long (max 50 characters)', 'warning');
        return;
    }

    habits.push({
        id: Date.now(),
        name,
        done: false,
        streak: 0,
        createdAt: new Date().toISOString()
    });

    habitInput.value = '';
    renderHabits();
    saveData();
    showNotification('Habit added!', 'success');
}

function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (habit) {
        habit.done = !habit.done;
        if (habit.done) {
            habit.streak = (habit.streak || 0) + 1;
        }
        renderHabits();
        saveData();
    }
}

function deleteHabit(id) {
    habits = habits.filter(h => h.id !== id);
    renderHabits();
    saveData();
    showNotification('Habit deleted', 'info');
}

function renderHabits() {
    if (habits.length === 0) {
        habitList.innerHTML = '<div class="empty-state">No habits yet. Start building one!</div>';
        return;
    }

    habitList.innerHTML = '';

    habits.forEach(habit => {
        const li = document.createElement('li');
        li.className = `row ${habit.done ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = habit.done;
        checkbox.onchange = () => toggleHabit(habit.id);

        const span = document.createElement('span');
        span.textContent = `${habit.name} ${habit.streak > 0 ? '🔥 ' + habit.streak : ''}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteHabit(habit.id);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        habitList.appendChild(li);
    });
}

function addGoal() {
    const name = goalInput.value.trim();
    const target = Number(goalTarget.value);

    if (!name) {
        showNotification('Please enter a goal name', 'warning');
        return;
    }

    if (!target || target <= 0) {
        showNotification('Please enter a valid target number', 'warning');
        return;
    }

    if (target > 1000) {
        showNotification('Target is too high (max 1000)', 'warning');
        return;
    }

    goals.push({
        id: Date.now(),
        name,
        target,
        progress: 0,
        createdAt: new Date().toISOString()
    });

    goalInput.value = '';
    goalTarget.value = '';
    renderGoals();
    saveData();
    showNotification('Goal added!', 'success');
}

function incrementGoal(id) {
    const goal = goals.find(g => g.id === id);
    if (goal && goal.progress < goal.target) {
        goal.progress++;

        if (goal.progress === goal.target) {
            showNotification(`🎉 Goal completed: ${goal.name}!`, 'success');
            setTimeout(() => {
                if (confirm(`Congratulations! You completed "${goal.name}"!\n\nWould you like to remove this goal?`)) {
                    deleteGoal(id);
                }
            }, 500);
        }

        renderGoals();
        saveData();
    }
}

function deleteGoal(id) {
    goals = goals.filter(g => g.id !== id);
    renderGoals();
    saveData();
    showNotification('Goal deleted', 'info');
}

function renderGoals() {
    if (goals.length === 0) {
        goalList.innerHTML = '<div class="empty-state">No goals yet. Set your first goal!</div>';
        drawRadar();
        return;
    }

    const sortedGoals = [...goals].sort((a, b) => {
        const remainingA = a.target - a.progress;
        const remainingB = b.target - b.progress;
        return remainingB - remainingA;
    });

    goalList.innerHTML = '';

    sortedGoals.forEach((goal, index) => {
        const li = document.createElement('li');
        li.className = 'row';

        const percentage = Math.round((goal.progress / goal.target) * 100);

        const text = document.createTextNode(
            `${index + 1}. ${goal.name} (${goal.progress}/${goal.target}) - ${percentage}%`
        );

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.className = 'plus';
        plusBtn.onclick = () => incrementGoal(goal.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.style.marginLeft = '8px';
        deleteBtn.onclick = () => deleteGoal(goal.id);

        li.appendChild(text);
        li.appendChild(plusBtn);
        li.appendChild(deleteBtn);
        goalList.appendChild(li);
    });

    drawRadar();
}

function drawRadar() {
    const ctx = radar.getContext('2d');
    const width = radar.width;
    const height = radar.height;

    ctx.clearRect(0, 0, width, height);

    if (goals.length < 3) {
        ctx.fillStyle = '#a0a0a0';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Add at least 3 goals', width / 2, height / 2 - 10);
        ctx.fillText('to see the radar chart', width / 2, height / 2 + 10);
        return;
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = 90;
    const angleStep = (Math.PI * 2) / goals.length;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let level = 1; level <= 4; level++) {
        ctx.beginPath();
        for (let i = 0; i <= goals.length; i++) {
            const radius = (maxRadius / 4) * level;
            const angle = angleStep * i - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    goals.forEach((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + maxRadius * Math.cos(angle),
            centerY + maxRadius * Math.sin(angle)
        );
        ctx.stroke();
    });

    ctx.beginPath();
    goals.forEach((goal, i) => {
        const remaining = (goal.target - goal.progress) / goal.target;
        const normalizedValue = Math.max(0, Math.min(1, remaining));
        const radius = maxRadius * normalizedValue;
        const angle = angleStep * i - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();

    ctx.fillStyle = 'rgba(255, 95, 162, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#ff5fa2';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    goals.forEach((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const labelRadius = maxRadius + 16;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);
        ctx.fillText((i + 1).toString(), x, y);
    });
}

function buildCalendar() {
    calendar.innerHTML = '';

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        if (day === today) {
            dayDiv.classList.add('today');
        }
        dayDiv.textContent = day;
        dayDiv.onclick = () => openDay(day);
        calendar.appendChild(dayDiv);
    }
}

function openDay(day) {
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });

    dayTitle.textContent = `${monthName} ${day}, ${now.getFullYear()}`;

    const completedTodos = todos.filter(t => t.done).length;
    const totalTodos = todos.length;
    const completedHabits = habits.filter(h => h.done).length;
    const totalHabits = habits.length;
    const completedGoals = goals.filter(g => g.progress === g.target).length;
    const totalGoals = goals.length;

    const todoPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
    const habitPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    dayInfo.innerHTML = `
    <p><b>📝 Tasks:</b> ${completedTodos} / ${totalTodos} completed (${todoPercentage}%)</p>
    <p><b>✅ Habits:</b> ${completedHabits} / ${totalHabits} done today (${habitPercentage}%)</p>
    <p><b>🎯 Goals Progress:</b></p>
    ${goals.length > 0 ? `
      <ul>
        ${goals.map(g => {
        const percentage = Math.round((g.progress / g.target) * 100);
        return `<li>${g.name}: ${g.progress}/${g.target} (${percentage}%)</li>`;
    }).join('')}
      </ul>
    ` : '<p style="margin-left: 20px; font-style: italic; color: #a0a0a0;">No active goals</p>'}
    <p style="margin-top: 20px;"><b>Total Completed Goals:</b> ${completedGoals} / ${totalGoals}</p>
  `;

    overlay.classList.remove('hidden');
    dayModal.classList.remove('hidden');
}

function closeDay() {
    overlay.classList.add('hidden');
    dayModal.classList.add('hidden');
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4ade80' : type === 'warning' ? '#fbbf24' : '#60a5fa'};
    color: #000;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (document.activeElement === todoInput) {
            addTodo();
        } else if (document.activeElement === habitInput) {
            addHabit();
        } else if (document.activeElement === goalTarget) {
            addGoal();
        }
    }

    if (e.key === 'Escape') {
        closeDay();
    }
});

function init() {
    loadData();
    buildCalendar();

    overlay.onclick = closeDay;

    console.log('✨ FocusFlow initialized successfully!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
