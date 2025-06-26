document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const exampleBtn = document.getElementById('exampleBtn');
    const errorWord = 'timelane';
    const shiftDeleteBtn = document.getElementById('shiftDeleteBtn');

    // 示例输入
    exampleBtn.addEventListener('click', function() {
        textInput.innerText = "We kindly request that you provide the updated project timelane by the end of this week.";
        textInput.focus();
        setTimeout(() => highlightErrorWords(), 50);
    });

    // 实时高亮
    textInput.addEventListener('input', highlightErrorWords);

    // Shift+Delete 删除下一个 timelane
    textInput.addEventListener('keydown', function(e) {
        if (e.key === 'Delete' && e.shiftKey) {
            e.preventDefault();
            deleteNextErrorWordAndSetCursor();
        }
    });

    if (shiftDeleteBtn) {
        shiftDeleteBtn.addEventListener('click', function() {
            deleteAInNextErrorWordAndSetCursor();
        });
    }

    // 用DOM操作高亮所有 timelane
    function highlightErrorWords() {
        // 先把所有 error-word span 还原成纯文本
        let walker = document.createTreeWalker(textInput, NodeFilter.SHOW_ELEMENT, null, false);
        let nodesToUnwrap = [];
        while (walker.nextNode()) {
            if (walker.currentNode.classList && walker.currentNode.classList.contains('error-word')) {
                nodesToUnwrap.push(walker.currentNode);
            }
        }
        nodesToUnwrap.forEach(node => {
            const textNode = document.createTextNode(node.textContent);
            node.parentNode.replaceChild(textNode, node);
        });

        // 再高亮所有 timelane
        let child = textInput.firstChild;
        while (child) {
            if (child.nodeType === Node.TEXT_NODE) {
                let idx;
                while ((idx = child.data.toLowerCase().indexOf(errorWord)) !== -1) {
                    const before = child.splitText(idx);
                    const match = before.splitText(errorWord.length);
                    const span = document.createElement('span');
                    span.className = 'error-word';
                    span.textContent = errorWord;
                    before.parentNode.replaceChild(span, before);
                    child = span; // 继续向后
                }
            }
            child = child.nextSibling;
        }
    }

    // 删除下一个 timelane 并将光标移动到原位置
    function deleteNextErrorWordAndSetCursor() {
        const errorSpan = textInput.querySelector('.error-word');
        if (!errorSpan) return;
        // 记录下一个兄弟节点
        const parent = errorSpan.parentNode;
        const nextSibling = errorSpan.nextSibling;
        // 删除 timelane
        parent.removeChild(errorSpan);
        // 重新高亮
        highlightErrorWords();
        // 设置光标
        setTimeout(() => {
            setCursorToPosition(parent, nextSibling);
        }, 0);
    }

    // 将光标定位到删除处
    function setCursorToPosition(parent, nextSibling) {
        const range = document.createRange();
        const sel = window.getSelection();
        if (nextSibling) {
            range.setStart(nextSibling, 0);
        } else {
            range.selectNodeContents(parent);
            range.collapse(false);
        }
        sel.removeAllRanges();
        sel.addRange(range);
    }

    // 删除下一个 timelane 单词中的字母 a，并保持高亮和光标
    function deleteAInNextErrorWordAndSetCursor() {
        const errorSpan = textInput.querySelector('.error-word');
        if (!errorSpan) return;
        const idx = errorSpan.textContent.indexOf('a');
        if (idx === -1) return;
        // 构造新内容，去掉第一个a
        const before = errorSpan.textContent.slice(0, idx);
        const after = errorSpan.textContent.slice(idx + 1);
        // 插入一个唯一marker
        const marker = '[[[CURSOR_MARKER]]]';
        errorSpan.textContent = before + marker + after;
        // 重新高亮（marker 可能被拆分到文本节点中）
        highlightErrorWords();
        // 设置光标到marker处
        setTimeout(() => {
            // 在所有节点中查找marker
            let found = false;
            const walker = document.createTreeWalker(textInput, NodeFilter.SHOW_TEXT, null, false);
            while (walker.nextNode()) {
                const node = walker.currentNode;
                const pos = node.data.indexOf(marker);
                if (pos !== -1) {
                    // 定位光标
                    setCursorToTextNode(node, pos);
                    // 移除marker
                    node.deleteData(pos, marker.length);
                    found = true;
                    break;
                }
            }
        }, 0);
    }

    // 将光标定位到文本节点的offset
    function setCursorToTextNode(node, offset) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(node, offset);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    // 显示删除消息
    function showDeleteMessage(message) {
        const deleteDiv = document.createElement('div');
        deleteDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        deleteDiv.textContent = message;
        document.body.appendChild(deleteDiv);
        
        // 2秒后移除消息
        setTimeout(() => {
            deleteDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(deleteDiv);
            }, 300);
        }, 2000);
    }
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}); 