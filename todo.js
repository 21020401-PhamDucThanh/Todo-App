let apiList = 'http://localhost:3000/user'; 

const newTodo = document.querySelector(".input_add_todo");
const addButton = document.querySelector(".push");
const deleteTodo = document.querySelector(".input-checkbox");
const taskNumber = document.querySelector(".pendingTasksNumb");
const clearAll = document.querySelector(".clear-all")


const userId = sessionStorage.getItem('userId');

// Hàm để lấy danh sách công việc của người dùng từ server
const getUserTasks = async (userId) => {
  const response = await fetch(`${apiList}/${userId}`);
  const user = await response.json();
  return user.tasks;
}

// Hàm để hiển thị danh sách công việc lên màn hình
const displayUserTasks = async () => {
  try {
    // Lấy danh sách công việc của người dùng từ server
    const tasks = await getUserTasks(userId);
    
    // Lấy thẻ ul của danh sách công việc
    const todoList = document.querySelector(".todo__list");

    // Xóa tất cả các công việc đã hiển thị trước đó
    todoList.innerHTML = "";

    // Lặp qua danh sách công việc và hiển thị lên màn hình
    tasks.forEach(task => {
      const newListItem = document.createElement("li");
      newListItem.innerHTML = `
      <div class="content"><p>${task.content}</p>
                <input class="input-checkbox" type="checkbox">
                <i class='bx bx-trash trash'></i>
            </div>
      `;
      todoList.appendChild(newListItem);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Gọi hàm để hiển thị danh sách công việc khi trang được tải
displayUserTasks();


addButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const newTodo = document.querySelector(".input_add_todo");

  // Kiểm tra xem nội dung công việc mới có rỗng không
  const todoText = newTodo.value.trim();

  if (todoText === "") {
    alert("Bạn chưa thêm hoạt động nào vào");
    return;
  }

  try {
    // Lấy danh sách công việc hiện tại của người dùng
    const response = await fetch(`http://localhost:3000/user/${userId}`);
    const userData = await response.json();
    const tasks = userData.tasks || [];
    const numbertasks = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    // console.log(tasks)
    // Thêm công việc mới vào danh sách công việc
    const updatedTasks = [...tasks, { content: todoText, completed: false , id: numbertasks }];
    // Gửi yêu cầu PATCH để cập nhật danh sách công việc của người dùng
    const updateResponse = await fetch(`http://localhost:3000/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tasks: updatedTasks
      })
    });

    if (updateResponse.ok) {
      // Hiển thị lại danh sách công việc sau khi thêm mới
      await displayUserTasks();
      // Xóa nội dung trong input sau khi thêm
      newTodo.value = "";
    } else {
      console.error("Error:", updateResponse.statusText);
      alert("Có lỗi xảy ra khi thêm công việc mới");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi thêm công việc mới");
  }
});

// delete todo
// const trashIcon = document.querySelector('.bx.bx-trash.trash');

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("bx-trash")) {

    const listItem = e.target.parentElement;
    const taskContent = listItem.querySelector("p").textContent;

    try {
      // Lấy danh sách công việc hiện tại của người dùng
      const response = await fetch(`http://localhost:3000/user/${userId}`);
      const userData = await response.json();
      const tasks = userData.tasks || [];

      // Tìm công việc cần xóa trong danh sách
      const taskToDelete = tasks.find(task => task.content === taskContent);

      if (!taskToDelete) {
        console.error("Error: Không thể tìm thấy công việc cần xóa");
        return;
      }

      // Xóa công việc khỏi danh sách
      const updatedTasks = tasks.filter(task => task.id !== taskToDelete.id);

      // Gửi yêu cầu PATCH để cập nhật danh sách công việc của người dùng
      const updateResponse = await fetch(`http://localhost:3000/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tasks: updatedTasks
        })
      });

      if (updateResponse.ok) {
        // Hiển thị lại danh sách công việc sau khi xóa
        await displayUserTasks();
      } else {
        console.error("Error:", updateResponse.statusText);
        alert("Có lỗi xảy ra khi xóa công việc");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi xóa công việc");
    }
  }
});

// clear all tasks
clearAll.addEventListener("click", async () => {
  try {
    // Gửi yêu cầu PATCH với danh sách công việc trống
    const updateResponse = await fetch(`http://localhost:3000/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tasks: []
      })
    });

    if (updateResponse.ok) {
      // Hiển thị lại danh sách công việc sau khi xóa
      await displayUserTasks();
    } else {
      console.error("Error:", updateResponse.statusText);
      alert("Có lỗi xảy ra khi xóa tất cả các công việc");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi xóa tất cả các công việc");
  }
});

