
// 全局变量
let currentUser = null;
let books = [
    { id: 1, title: 'JavaScript高级程序设计', author: 'Nicholas C. Zakas', format: 'epub', cover: '📖' },
    { id: 2, title: 'Python编程从入门到实践', author: 'Eric Matthes', format: 'pdf', cover: '🐍' },
    { id: 3, title: '深入理解计算机系统', author: 'Randal E. Bryant', format: 'pdf', cover: '💻' },
    { id: 4, title: '算法导论', author: 'Thomas H. Cormen', format: 'epub', cover: '🔍' },
    { id: 5, title: '设计模式', author: 'Erich Gamma', format: 'pdf', cover: '🎨' },
    { id: 6, title: '代码大全', author: 'Steve McConnell', format: 'epub', cover: '📝' }
];
let userBookshelf = [];

// 页面加载时的初始化
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    updateUI();
});

// 显示指定区域
function showSection(sectionName) {
    // 隐藏所有区域
    document.getElementById('home-section').classList.add('hidden');
    document.getElementById('upload-section').classList.add('hidden');
    document.getElementById('bookshelf-section').classList.add('hidden');
    
    // 显示指定区域
    document.getElementById(sectionName + '-section').classList.remove('hidden');
    
    // 如果是书架页面，加载书架数据
    if (sectionName === 'bookshelf' && currentUser) {
        loadBookshelf();
    }
}

// 切换认证界面
function toggleAuth() {
    const authSection = document.getElementById('auth-section');
    if (authSection.classList.contains('hidden')) {
        authSection.classList.remove('hidden');
        document.getElementById('auth-btn').textContent = '隐藏';
    } else {
        authSection.classList.add('hidden');
        document.getElementById('auth-btn').textContent = '显示';
    }
}

// 登录功能
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('请输入邮箱和密码');
        return;
    }

    // 这里应该是调用后端API进行验证
    // 模拟登录成功
    currentUser = email;
    alert('登录成功！');
    updateUI();
    document.getElementById('auth-section').classList.add('hidden');
}

// 注册功能
function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('请输入邮箱和密码');
        return;
    }

    if (password.length < 6) {
        alert('密码长度至少6位');
        return;
    }

    // 这里应该是调用后端API进行注册
    // 模拟注册成功
    currentUser = email;
    alert('注册成功！');
    updateUI();
    document.getElementById('auth-section').classList.add('hidden');
}

// 更新UI状态
function updateUI() {
    const userEmail = document.getElementById('user-email');
    const authBtn = document.getElementById('auth-btn');

    if (currentUser) {
        userEmail.textContent = currentUser;
        authBtn.textContent = '登出';
        authBtn.onclick = logout;
    } else {
        userEmail.textContent = '未登录';
        authBtn.textContent = '登录';
        authBtn.onclick = toggleAuth;
    }
}

// 登出功能
function logout() {
    currentUser = null;
    userBookshelf = [];
    updateUI();
    showSection('home');
}

// 加载书籍列表
function loadBooks() {
    const booksContainer = document.getElementById('books-list');
    booksContainer.innerHTML = '';

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-cover">${book.cover}</div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-format">${book.format.toUpperCase()}</div>
                <div class="book-actions">
                    <button class="action-btn" onclick="readBook(${book.id})">阅读</button>
                    <button class="action-btn" onclick="addToBookshelf(${book.id})">收藏</button>
                </div>
            </div>
        `;
        booksContainer.appendChild(bookCard);
    });
}

// 添加到书架
function addToBookshelf(bookId) {
    if (!currentUser) {
        alert('请先登录！');
        return;
    }

    const book = books.find(b => b.id === bookId);
    if (book && !userBookshelf.find(b => b.id === bookId)) {
        userBookshelf.push(book);
        alert('已添加到书架！');
        if (document.getElementById('bookshelf-section').classList.contains('hidden')) {
            showSection('bookshelf');
        }
    } else {
        alert('书籍已在书架中或不存在！');
    }
}

// 加载书架
function loadBookshelf() {
    const bookshelfContainer = document.getElementById('bookshelf');
    bookshelfContainer.innerHTML = '';

    if (userBookshelf.length === 0) {
        bookshelfContainer.innerHTML = '<p>您的书架还是空的，快去收藏一些书籍吧！</p>';
        return;
    }

    userBookshelf.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'shelved-book';
        bookItem.innerHTML = `
            <div class="book-cover">${book.cover}</div>
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <button class="action-btn" onclick="readBook(${book.id})" style="margin-top: 0.5rem;">阅读</button>
        `;
        bookshelfContainer.appendChild(bookItem);
    });
}

// 阅读书籍
function readBook(bookId) {
    if (!currentUser) {
        alert('请先登录！');
        return;
    }

    const book = books.find(b => b.id === bookId);
    if (book) {
        alert(`正在打开《${book.title}》进行阅读...`);
        // 这里应该打开电子书阅读器
        // 实际实现中需要集成EPUB.js或其他阅读器库
    }
}

// 处理文件选择
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('upload-status').innerHTML = 
            `<p>已选择文件: ${file.name}</p>`;
    }
}

// 上传书籍
function uploadBook() {
    if (!currentUser) {
        alert('请先登录！');
        return;
    }

    const fileInput = document.getElementById('book-file');
    const file = fileInput.files[0];

    if (!file) {
        alert('请选择一个文件！');
        return;
    }

    const validTypes = ['application/epub+zip', 'application/pdf', 'text/plain'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    const validExts = ['epub', 'pdf', 'txt', 'mobi'];

    if (!validExts.includes(fileExt)) {
        alert('不支持的文件格式！请上传 EPUB, PDF, TXT, 或 MOBI 文件。');
        return;
    }

    // 这里应该是实际的文件上传逻辑
    // 使用 FormData 和 fetch API 上传到后端
    const formData = new FormData();
    formData.append('book', file);
    formData.append('email', currentUser);

    // 模拟上传过程
    document.getElementById('upload-status').innerHTML = 
        '<p>上传中...</p>';

    setTimeout(() => {
        // 模拟上传成功
        const newBook = {
            id: books.length + 1,
            title: file.name.replace(/\.[^/.]+$/, ""),
            author: '未知作者',
            format: fileExt,
            cover: fileExt === 'epub' ? '📘' : fileExt === 'pdf' ? '📄' : '📑'
        };
        books.push(newBook);
        document.getElementById('upload-status').innerHTML = 
            '<p style="color: green;">上传成功！</p>';
        loadBooks(); // 重新加载书籍列表
        fileInput.value = ''; // 清空文件选择
    }, 2000);
}

// 模拟后端API调用的函数
function simulateAPI(endpoint, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`API Call to ${endpoint}`, data);
            resolve({ success: true,  data });
        }, 1000);
    });
}