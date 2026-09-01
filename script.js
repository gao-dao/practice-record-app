document.addEventListener('DOMContentLoaded', () => {
    const todayDateElement = document.getElementById('today-date');
    const practiceInput = document.getElementById('practice');
    const insightInput = document.getElementById('insight');
    const saveBtn = document.getElementById('save-btn');
    const recordsElement = document.getElementById('records');

    // 現在の日付を表示
    todayDateElement.textContent = new Date().toLocaleDateString();

    // editingId の状態を保持する変数
    let editingId = null;

    // 保存ボタンクリック時のイベントハンドラ
    saveBtn.addEventListener('click', saveRecord);

    // 表示を更新する関数
    function displayRecords() {
        recordsElement.innerHTML = '';

        const records = JSON.parse(localStorage.getItem('records')) || [];
        records.forEach((record, index) => {
            const recordElement = document.createElement('div');
            recordElement.classList.add('record');
            recordElement.innerHTML = `
                <p><strong>練習内容:</strong> ${record.practice}</p>
                <p><strong>気づいたこと:</strong> ${record.insight}</p>
                <p><strong>日付:</strong> ${record.date}</p>
                <button class="edit-btn" data-id="${index}">編集</button>
                <button class="delete-btn" data-id="${index}">削除</button>
            `;
            recordsElement.appendChild(recordElement);
        });
    }

    // 編集・削除ボタンのイベントハンドラ
    recordsElement.addEventListener('click', handleEditDeleteClick);

    // 記録を編集する関数
    function editRecord(event) {
        if (event.target.classList.contains('edit-btn')) {
            const id = parseInt(event.target.getAttribute('data-id'), 10);
            const records = JSON.parse(localStorage.getItem('records')) || [];
            const record = records[id];
            practiceInput.value = record.practice;
            insightInput.value = record.insight;

            // エディットモードに移動
            saveBtn.textContent = '更新';
            editingId = id; // editingId を設定
        }
    }

    // 記録を削除する関数
    function deleteRecord(event) {
        if (event.target.classList.contains('delete-btn')) {
            const id = parseInt(event.target.getAttribute('data-id'), 10);
            const records = JSON.parse(localStorage.getItem('records')) || [];
            records.splice(id, 1);
            localStorage.setItem('records', JSON.stringify(records));

            // 表示を更新
            displayRecords();
        }
    }

    // handleEditDeleteClick から editRecord と deleteRecord を呼び出す
    function handleEditDeleteClick(event) {
        if (event.target.classList.contains('edit-btn')) {
            editRecord(event);
        } else if (event.target.classList.contains('delete-btn')) {
            deleteRecord(event);
        }
    }

    // 保存ボタンクリック時のイベントハンドラ
    function saveRecord() {
        const practice = practiceInput.value.trim();
        const insight = insightInput.value.trim();

        if (practice && insight) {
            if (editingId === null) {
                // 新規保存
                const records = JSON.parse(localStorage.getItem('records')) || [];
                records.push({ practice, insight, date: new Date().toLocaleDateString() });
                localStorage.setItem('records', JSON.stringify(records));

                // 表示を更新
                displayRecords();

                // 入力欄をクリア
                practiceInput.value = '';
                insightInput.value = '';
                saveBtn.textContent = '保存';
            } else {
                // 更新
                updateRecord();
            }
        } else {
            alert('練習内容と気づいたことを両方入力してください。');
        }
    }

    // 記録を更新する関数
    function updateRecord() {
        const id = editingId;
        const records = JSON.parse(localStorage.getItem('records')) || [];
        const practice = practiceInput.value.trim();
        const insight = insightInput.value.trim();

        if (practice && insight) {
            records[id] = { practice, insight, date: new Date().toLocaleDateString() };
            localStorage.setItem('records', JSON.stringify(records));

            // 表示を更新
            displayRecords();

            // エディットモードを解除
            practiceInput.value = '';
            insightInput.value = '';
            saveBtn.textContent = '保存';
            editingId = null; // editingId をリセット
        } else {
            alert('練習内容と気づいたことを両方入力してください。');
        }
    }

    // 表示を更新
    displayRecords();
});