// Efek scroll
window.addEventListener("scroll", () => {
    let elements = document.querySelectorAll(".elemen-transisi");
    
    for(let i = 0; i < elements.length; i++){
        let heightWindow = window.innerHeight;
        let topElement = elements[i].getBoundingClientRect().top;
        let scroll = 200;
        if(topElement < heightWindow - scroll){
            elements[i].classList.add("transisi");
        }else{
            elements[i].classList.remove("transisi");
        }
    }
})

// Ambil Element
const todos = [];
const RENDER_EVENT = 'render-todo';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      content();
    });
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

  function content() {
    const textBookshelf = document.getElementById('inputBookTitle').value;
    const textBookAuthor = document.getElementById('inputBookAuthor').value;
    const timestamp = document.getElementById('inputBookYear').value;
    const bookIsCompleted = document.getElementById('inputBookIsComplete').checked;

    if (!checkBox.Checked) {
    }

    const generatedID = generateId();
    const BookshelfObject = generateBookshelfObject(generatedID, textBookshelf, textBookAuthor, timestamp, bookIsCompleted);
    todos.push(BookshelfObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  // kondisi teks di check Box (default true)
  const checkBox = document.getElementById('inputBookIsComplete');
  let check = false;
  checkBox.addEventListener('change', function () {
      ;
      if (!checkBox.Checked) {
          let check = true;
          document.querySelector('span').innerText = ''
      }
      return !checkBox
  }) 

  function generateId() {
    return +new Date();
  }

  function generateBookshelfObject(id, task, author, timestamp, bookIsCompleted) {
    return {
      id,
      task,
      author,
      timestamp,
      bookIsCompleted
    }
  }

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById('incompleteBookshelfList');
  uncompletedTODOList.innerHTML = '';

  const completedTODOList = document.getElementById('completeBookshelfList');
  completedTODOList.innerHTML = '';

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.bookIsCompleted)
      uncompletedTODOList.append(todoElement);
    else
      completedTODOList.append(todoElement);
  }
});

function makeTodo(BookshelfObject) {
    const text = document.createElement('h3');
    text.innerHTML = "Buku";

    const newText = document.createElement('h4');
    newText.innerText = "Judul : ";
    
    const textTitle = document.createElement('p');
    textTitle.innerText = BookshelfObject.task;
    newText.append(textTitle);

    const newAuthor = document.createElement('h4');
    newAuthor.innerText = "Penulis : ";
    
    const textAuthor = document.createElement('p');
    textAuthor.innerText = BookshelfObject.author;
    newAuthor.append(textAuthor);
    
    const newTitle = document.createElement('h4');
    newTitle.innerText = "Tahun : ";
    
    const textTimestamp = document.createElement('p')
    textTimestamp.innerText = BookshelfObject.timestamp;
    newTitle.append(textTimestamp);

    const textsection = document.createElement('div');
    textsection.classList.add('inner');
    textsection.append(text);
    textsection.append(newText, textTitle, newAuthor, textAuthor, newTitle, textTimestamp);

    const section = document.createElement('div');
    section.classList.add('item', 'shadow');
    section.append(textsection);
    section.setAttribute('id', `todo-${BookshelfObject.id}`);

    // Menghilangkan value di kotak input
    inputBookTitle.value = "";
    inputBookAuthor.value = "";
    inputBookYear.value = "";
    inputBookIsComplete.checked = "";

    if (BookshelfObject.bookIsCompleted) {
      
        const undoButton = document.createElement('button');
        undoButton.classList.add('ungreen');
        undoButton.innerHTML = "Belum selesai dibaca";

        undoButton.addEventListener('click', function () {
          undoTaskFromCompleted(BookshelfObject.id);
        });

        function undoTaskFromCompleted(todoId) {
          if (confirm("Apakah anda belum selesai membaca buku ini?")){
            const todoTarget = findTodo(todoId);

            if (todoTarget == null) return;

            todoTarget.bookIsCompleted = false;
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
          }
        }
        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerHTML = "Hapus buku";

        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(BookshelfObject.id);
        });

        function removeTaskFromCompleted(todoId) {
          if (confirm("Apakah anda yakin mau menghapus list ini?")){
            const todoTarget = findTodoIndex(todoId);

            if (todoTarget === -1) return;

            todos.splice(todoTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
          }
        }
        section.append(undoButton, trashButton);
      } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerHTML = "Selesai dibaca";
        
        checkButton.addEventListener('click', function () {
          addTaskToCompleted(BookshelfObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerHTML = "Hapus buku";

        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(BookshelfObject.id);
        });

        function removeTaskFromCompleted(todoId) {
          if (confirm("Apakah anda yakin mau menghapus list ini?")){
            const todoTarget = findTodoIndex(todoId);

            if (todoTarget === -1) return;

            todos.splice(todoTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
          }
        }
        section.append(checkButton, trashButton);
      }

    return section;
}

function addTaskToCompleted (todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.bookIsCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findTodo(todoId) {
    for (const todoItem of todos) {
      if (todoItem.id === todoId) {
        return todoItem;
      }
    }
    return null;
  }

  function findTodoIndex(todoId) {
    for (const index in todos) {
      if (todos[index].id === todoId) {
        return index;
      }
    }

    return -1;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
