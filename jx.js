//星耀云官网：www.sgvps.cn  关注官网活动有机会免费得永久虚拟主机，不定时限量免费，免费，免费！
// feijipan-parser.js
// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const panUrlInput = document.getElementById('panUrl');
    const parseBtn = document.getElementById('parseBtn');
    const loading = document.getElementById('loading');
    const errorMsg = document.getElementById('errorMsg');
    const result = document.getElementById('result');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const downUrl = document.getElementById('downUrl');
    const copyBtn = document.getElementById('copyBtn');

    // 解析按钮点击事件
    parseBtn.addEventListener('click', async () => {
        // 获取输入的链接
        const url = panUrlInput.value.trim();
        
        // 验证输入
        if (!url) {
            showError('请输入飞机盘分享链接！');
            return;
        }
        
        // 验证链接格式（简单验证）
        if (!url.startsWith('https://share.feijipan.com/')) {
            showError('请输入有效的飞机盘分享链接！');
            return;
        }
        
        // 清空之前的状态
        hideError();
        hideResult();
        
        // 显示加载状态
        loading.classList.remove('hidden');
        
        try {
            // 调用API解析链接
            const apiUrl = `https://api.suyanw.cn/api/feijipan.php?url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            // 隐藏加载状态
            loading.classList.add('hidden');
            
            // 处理API返回结果
            if (data.code === 200 && data.data) {
                // 显示解析结果
                fileName.textContent = data.data.file_name || '未知文件名';
                fileSize.textContent = data.data.file_size || '未知大小';
                downUrl.value = data.data.down_url || '';
                result.classList.remove('hidden');
            } else {
                showError(data.msg || '解析失败，请稍后重试！');
            }
        } catch (error) {
            // 隐藏加载状态
            loading.classList.add('hidden');
            // 显示错误信息
            showError('网络错误或API调用失败，请检查网络或稍后重试！');
            console.error('解析失败：', error);
        }
    });

    // 复制按钮点击事件
    copyBtn.addEventListener('click', async () => {
        const url = downUrl.value;
        if (!url) return;
        
        try {
            // 复制到剪贴板
            await navigator.clipboard.writeText(url);
            // 临时修改按钮文本提示复制成功
            copyBtn.innerHTML = '<i class="fa-solid fa-check mr-1"></i>已复制';
            // 2秒后恢复按钮文本
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-copy mr-1"></i>复制';
            }, 2000);
        } catch (error) {
            // 备用复制方案（兼容旧浏览器）
            downUrl.select();
            document.execCommand('copy');
            copyBtn.innerHTML = '<i class="fa-solid fa-check mr-1"></i>已复制';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-copy mr-1"></i>复制';
            }, 2000);
            console.error('复制失败：', error);
        }
    });

    // 显示错误信息
    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
    }

    // 隐藏错误信息
    function hideError() {
        errorMsg.classList.add('hidden');
        errorMsg.textContent = '';
    }

    // 隐藏结果区域
    function hideResult() {
        result.classList.add('hidden');
        fileName.textContent = '';
        fileSize.textContent = '';
        downUrl.value = '';
    }

    // 回车触发解析
    panUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            parseBtn.click();
        }
    });
});
