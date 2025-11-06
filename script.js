// 监听表单提交事件
document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault(); // 阻止表单的默认提交行为

    // 获取表单中的数据
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;

    // 向后端发送 POST 请求，添加联系人
    fetch('http://localhost:3000/add-contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            phone: phone
        })
    })
    .then(response => response.text())  // 处理响应
    .then(data => {
        console.log(data);  // 输出响应数据
        alert('Contact added successfully!');  // 提示成功
        fetchContacts(); // 重新获取并显示联系人列表
    })
    .catch(error => console.error('Error:', error));  // 错误处理
});

// 获取所有联系人并显示
function fetchContacts() {
    fetch('http://localhost:3000/get-contacts') // 假设后端提供一个接口获取所有联系人
    .then(response => response.json())
    .then(data => {
        renderContactsList(data);  // 调用函数渲染联系人列表
    })
    .catch(error => console.error('Error fetching contacts:', error));  // 错误处理
}

// 渲染联系人列表
function renderContactsList(contacts) {
    const contactsContainer = document.getElementById('contact-list');
    contactsContainer.innerHTML = ''; // 清空现有的联系人列表

    contacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.id = `contact-${contact.id}`;
        contactElement.classList.add('contact');
        contactElement.innerHTML = `
            <p>Name: <span class="name">${contact.name}</span> Phone: <span class="phone">${contact.phone}</span></p>
            <button class="edit" onclick="editContact(${contact.id})">Edit</button>
            <button class="delete" onclick="deleteContact(${contact.id})">Delete</button>
        `;
        contactsContainer.appendChild(contactElement);  // 添加新的联系人到容器中
    });
}

// 编辑联系人
function editContact(contactId) {
    const contactElement = document.getElementById(`contact-${contactId}`);
    const newName = prompt("Enter new name:", contactElement.querySelector('.name').textContent);
    const newPhone = prompt("Enter new phone number:", contactElement.querySelector('.phone').textContent);

    fetch(`http://localhost:3000/update-contact/${contactId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newName,
            phone: newPhone
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        alert('Contact updated successfully!');
        contactElement.querySelector('.name').textContent = newName;
        contactElement.querySelector('.phone').textContent = newPhone;
    })
    .catch(error => console.error('Error:', error));
}

// 删除联系人
function deleteContact(contactId) {
    if (confirm("Are you sure you want to delete this contact?")) {
        fetch(`http://localhost:3000/delete-contact/${contactId}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            alert('Contact deleted successfully!');
            document.getElementById(`contact-${contactId}`).remove();  // 从页面中移除已删除的联系人
        })
        .catch(error => console.error('Error:', error));
    }
}

// 页面加载时获取联系人列表
window.onload = function() {
    fetchContacts();
};
