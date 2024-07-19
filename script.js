const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

let getNoteRecords = [];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
apiFunction();
notePostApi();
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false,
  updateId;

addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

 function showNotes() {
  console.log(getNoteRecords)
  if (!getNoteRecords) return;
  document.querySelectorAll(".note").forEach((li) => li.remove());
  getNoteRecords.forEach((note, id) => {
    let filterDesc = note.description;
    // let filterDesc = note.description.replaceAll("\n", "<br/>");
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="fa-solid fa-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="fa-solid fa-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}


function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));

  showNotes();
}

function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll("<br/>", "\r\n");
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let title = titleTag.value.trim(),
    description = descTag.value.trim();

  if (title || description) {
    let currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();

    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    console.log("NOTEINFO", notes)
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});

function apiFunction() {
  const apiUrl = 'https://googlekeepapis.vercel.app/';
// Make a GET request
// fetch(apiUrl)
//   .then(response => {
//     console.log("RESULT", response)
//     if (!response) {
//       throw new Error('Network response was not ok');
//     }    return response.json();
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });

  // fetch(apiUrl)
  // .then(response => {
  //   return response.json();
  // })
  // .then(data => {
  //   console.log(data)
  //   getNoteRecords.push(data);
  // })

  
fetch(apiUrl)
.then(response => {
  if (response.ok) {
    return response.json(); // Parse the response data as JSON
  } else {
    throw new Error('API request failed');
  }
})
.then(data => {
  // Process the response data here
  console.log(data); // Example: Logging the data to the console
  getNoteRecords = data;
  showNotes();
})
.catch(error => {
  // Handle any errors here
  console.error(error); // Example: Logging the error to the console
});
}
function notePostApi() {
  fetch("https://googlekeepapis.vercel.app/insertCard", {
    method: "POST",
    body: JSON.stringify({
      title: 'importPath',
      description: "Path for all the files",
      date: "July 19, 2024"
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}
