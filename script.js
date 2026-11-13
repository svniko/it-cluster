var STORAGE_KEY = "hospital";
var DATA_VERSION = 1;


// Початкові дані. ЛИШЕ для першого заповнення localStorage.
// Після цього працюємо тільки з localStorage.
var SEED_DATA = {
  doctors: [
    ["D-101", "Коваленко Ірина Петрівна", "Терапевт", 204, 14, "Вища", "+380 44 555 01 01", "Пн–Пт, 8:00–14:00"],
    ["D-102", "Шевченко Андрій Олексійович", "Кардіолог", 312, 21, "Вища", "+380 44 555 01 02", "Вт–Сб, 9:00–16:00"],
    ["D-103", "Бондаренко Олена Миколаївна", "Педіатр", 110, 8, "Перша", "+380 44 555 01 03", "Пн–Пт, 10:00–17:00"],
    ["D-104", "Мельник Василь Степанович", "Хірург", 401, 27, "Вища", "+380 44 555 01 04", "Пн, Ср, Пт, 8:00–15:00"],
    ["D-105", "Ткаченко Наталія Ігорівна", "Невролог", 218, 11, "Друга", "+380 44 555 01 05", "Пн–Чт, 12:00–19:00"]
  ],

  patients: [
    ["P-2001", "Лисенко Марія Дмитрівна", "12.03.1985", "Жін.", "A (II) Rh+", "+380 67 123 45 67", "м. Харків, вул. Сумська, 22, кв. 5", "ПЛ-448120"],
    ["P-2002", "Гриценко Олег Віталійович", "27.09.1972", "Чол.", "O (I) Rh+", "+380 50 234 56 78", "м. Харків, пр. Перемоги, 80, кв. 41", "ПЛ-448121"],
    ["P-2003", "Савченко Софія Андріївна", "05.06.2016", "Жін.", "B (III) Rh−", "+380 93 345 67 89", "м. Харків, вул. Іллінська, 9, кв. 17", "ПЛ-448122"],
    ["P-2004", "Ярмоленко Денис Сергійович", "18.11.1994", "Чол.", "AB (IV) Rh+", "+380 63 456 78 90", "м. Харків, бул. Полтавський Шлях, 14, кв. 63", "ПЛ-448123"],
    ["P-2005", "Кравчук Валентина Іванівна", "30.01.1958", "Жін.", "A (II) Rh−", "+380 96 567 89 01", "м. Київ, вул. Антоновича, 51, кв. 8", "ПЛ-448124"]
  ],

  visits: [
    ["V-5001", "21.10.2026, 09:00", "Лисенко М. Д.", "Коваленко І. П.", "Кашель, температура", "planned", 600],
    ["V-5002", "21.10.2026, 10:30", "Гриценко О. В.", "Шевченко А. О.", "Контроль тиску", "planned", 850],
    ["V-5003", "19.10.2026, 11:15", "Савченко С. А.", "Бондаренко О. М.", "Профілактичний огляд", "done", 500],
    ["V-5004", "16.10.2026, 14:00", "Ярмоленко Д. С.", "Мельник В. С.", "Консультація перед операцією", "done", 900],
    ["V-5005", "15.10.2026, 13:00", "Кравчук В. І.", "Ткаченко Н. І.", "Головний біль, запаморочення", "cancelled", 0]
  ]
};

var doctors = [];
var patients = [];
var visits = [];

var statusNames = {
  planned: "Заплановано",
  done: "Завершено",
  cancelled: "Скасовано"
};

function saveData() {
  var dataToSave = {
    version: DATA_VERSION,
    doctors: doctors,
    patients: patients,
    visits: visits
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}


function loadData() {
  var savedText = localStorage.getItem(STORAGE_KEY);
  var savedData = null;

  try {
    if (savedText != null) {
      savedData = JSON.parse(savedText);
    }
  }
  catch (error) {
    savedData = null;
  }

  if (savedData == null || savedData.version != DATA_VERSION) {
    doctors = JSON.parse(JSON.stringify(SEED_DATA.doctors));
    patients = JSON.parse(JSON.stringify(SEED_DATA.patients));
    visits = JSON.parse(JSON.stringify(SEED_DATA.visits));
    saveData();
  }
  else {
    doctors = savedData.doctors;
    patients = savedData.patients;
    visits = savedData.visits;
  }
}


// Повернення до початкових даних
function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  loadData();
  showAllTables();
}


// Перемальовуємо всі три таблиці
function showAllTables() {
  fillTable("doctors-body", doctors);
  fillTable("patients-body", patients);
  fillVisits();
}


// Перетворюємо повне ПІБ на скорочене
function shortName(name) {
  var words = name.split(" ");

  if (words.length < 3) {
    return name;
  }

  return words[0] + " " + words[1][0] + ". " + words[2][0] + ".";
}


// Заповнюємо випадаючісписки пацієнтів і лікарів у формі прийому
function fillSelects() {
  var html = "";

  for (var i = 0; i < patients.length; i++) {
    html = html + "<option>" + shortName(patients[i][1]) + "</option>";
  }
  document.getElementById("vis-patient").innerHTML = html;

  html = "";

  for (var i = 0; i < doctors.length; i++) {
    html = html + "<option>" + shortName(doctors[i][1]) + "</option>";
  }
  document.getElementById("vis-doctor").innerHTML = html;
}


// Виведення лікарів і пацієнтів
function fillTable(tbodyId, tableData) {
  var html = "";

  for (var i = 0; i < tableData.length; i++) {
    html = html + "<tr>";

    for (var j = 0; j < tableData[i].length; j++) {

      // Для ПІБ додаємо можливість редагування
      if (j == 1) {
        html = html + '<td class="edit-name" onclick="editName(\'' + tbodyId + '\',' + i + ')">' + tableData[i][j] + "</td>";
      }
      else {
        html = html + "<td>" + tableData[i][j] + "</td>";
      }
    }

    // Кнопка видалення
    html = html + '<td><button class="delete-btn" onclick="deleteRow(\'' + tbodyId + '\',' + i + ')">✖</button></td>';
    html = html + "</tr>";
  }

  document.getElementById(tbodyId).innerHTML = html;

  // Оновлюємо списки у формі прийому
  fillSelects();
}


// Виведення записів на прийом
function fillVisits() {
  var html = "";

  for (var i = 0; i < visits.length; i++) {
    var visit = visits[i];

    html = html + "<tr>";
    html = html + "<td>" + visit[0] + "</td>";
    html = html + "<td>" + visit[1] + "</td>";
    html = html + "<td>" + visit[2] + "</td>";
    html = html + "<td>" + visit[3] + "</td>";
    html = html + "<td>" + visit[4] + "</td>";
    html = html + '<td><span class="status status-' + visit[5] + '">' + statusNames[visit[5]] + "</span></td>";
    html = html + "<td>" + visit[6] + "</td>";

    // Кнопка видалення прийому
    html = html + '<td><button class="delete-btn" onclick="deleteRow(\'visits-body\',' + i + ')">✖</button></td>';
    html = html + "</tr>";
  }

  document.getElementById("visits-body").innerHTML = html;
}


// Видалення рядків
function deleteRow(type, index) {

  // Видалення лікаря
  if (type == "doctors-body") {
    var doctorName = shortName(doctors[index][1]);

    // Перевіряємо, чи використовується лікар у прийомах
    for (var i = 0; i < visits.length; i++) {
      if (visits[i][3] == doctorName) {
        alert("Неможливо видалити лікаря! Він використовується в таблиці прийомів.");
        return;
      }
    }

    doctors.splice(index, 1);
    fillTable("doctors-body", doctors);
  }

  // Видалення пацієнта
  else if (type == "patients-body") {
    var patientName = shortName(patients[index][1]);

    // Перевіряємо, чи використовується пацієнт у прийомах
    for (var i = 0; i < visits.length; i++) {
      if (visits[i][2] == patientName) {
        alert("Неможливо видалити пацієнта! Він використовується в таблиці прийомів.");
        return;
      }
    }

    patients.splice(index, 1);
    fillTable("patients-body", patients);
  }

  // Видалення прийому
  else if (type == "visits-body") {
    visits.splice(index, 1);
    fillVisits();
  }

  saveData();
}


// Редагування ПІБ лікаря або пацієнта
function editName(type, index) {
  var tableData;

  if (type == "doctors-body") {
    tableData = doctors;
  }
  else {
    tableData = patients;
  }

  var cell = document.getElementById(type).rows[index].cells[1];
  var oldName = tableData[index][1];

  // Створюємо поле для введення нового ПІБ
  cell.innerHTML = '<input type="text" class="edit-input" value="' + oldName + '">';

  var input = cell.querySelector("input");
  input.focus();

  // Щоб натискання в полі не запускало редагування повторно
  input.onclick = function(event) {
    event.stopPropagation();
  };

  // Зберігаємо зміни після натискання Enter або переходу в інше місце
  input.onblur = function() {
    var newName = input.value.trim();

    if (newName != "") {
      tableData[index][1] = newName;

      // Оновлюємо ПІБ у таблиці прийомів
      var oldShortName = shortName(oldName);
      var newShortName = shortName(newName);

      for (var i = 0; i < visits.length; i++) {
        if (type == "doctors-body" && visits[i][3] == oldShortName) {
          visits[i][3] = newShortName;
        }

        if (type == "patients-body" && visits[i][2] == oldShortName) {
          visits[i][2] = newShortName;
        }
      }
    }

    // Перемальовуємо таблиці
    showAllTables();
    saveData();
  };

  // Enter завершує редагування
  input.onkeydown = function(event) {
    if (event.key == "Enter") {
      input.blur();
    }
  };
}


// Спочатку завантажуємо дані (з localStorage або початкові), потім виводимо таблиці
loadData();
showAllTables();


// Якщо дані змінили в іншій вкладці - оновлюємо цю сторінку
window.addEventListener("storage", function() {
  loadData();
  showAllTables();
});


// Перемикання вкладок
var tabs = document.querySelectorAll(".tab");
var panels = document.querySelectorAll(".panel");

for (var i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function() {

    for (var j = 0; j < tabs.length; j++) {
      tabs[j].classList.remove("is-active");
      panels[j].classList.remove("is-active");
    }

    this.classList.add("is-active");

    var panelId = this.id.replace("btn-", "panel-");
    document.getElementById(panelId).classList.add("is-active");
  });
}


// Відкриття форм
document.getElementById("open-doctors").onclick = function() {
  document.getElementById("dialog-doctors").showModal();
};

document.getElementById("open-patients").onclick = function() {
  document.getElementById("dialog-patients").showModal();
};

document.getElementById("open-visits").onclick = function() {
  document.getElementById("dialog-visits").showModal();
};


// Закриття форм
document.getElementById("cancel-doctors").onclick = function() {
  document.getElementById("dialog-doctors").close();
};

document.getElementById("cancel-patients").onclick = function() {
  document.getElementById("dialog-patients").close();
};

document.getElementById("cancel-visits").onclick = function() {
  document.getElementById("dialog-visits").close();
};


// Додавання лікаря
document.getElementById("form-doctors").onsubmit = function(event) {
  event.preventDefault();

  var newDoctor = [
    document.getElementById("doc-id").value,
    document.getElementById("doc-name").value,
    document.getElementById("doc-spec").value,
    Number(document.getElementById("doc-room").value),
    Number(document.getElementById("doc-exp").value),
    document.getElementById("doc-category").value,
    document.getElementById("doc-phone").value,
    document.getElementById("doc-schedule").value
  ];

  doctors.push(newDoctor);
  fillTable("doctors-body", doctors);
  saveData();

  this.reset();
  document.getElementById("dialog-doctors").close();
};


// Додавання пацієнта
document.getElementById("form-patients").onsubmit = function(event) {
  event.preventDefault();

  var newPatient = [
    document.getElementById("pat-id").value,
    document.getElementById("pat-name").value,
    document.getElementById("pat-birth").value,
    document.getElementById("pat-gender").value,
    document.getElementById("pat-blood").value,
    document.getElementById("pat-phone").value,
    document.getElementById("pat-address").value,
    document.getElementById("pat-policy").value
  ];

  patients.push(newPatient);
  fillTable("patients-body", patients);
  saveData();

  this.reset();
  document.getElementById("dialog-patients").close();
};


// Додавання прийому
document.getElementById("form-visits").onsubmit = function(event) {
  event.preventDefault();

  var newVisit = [
    document.getElementById("vis-id").value,
    document.getElementById("vis-date").value,
    document.getElementById("vis-patient").value,
    document.getElementById("vis-doctor").value,
    document.getElementById("vis-reason").value,
    document.getElementById("vis-status").value,
    Number(document.getElementById("vis-price").value)
  ];

  visits.push(newVisit);
  fillVisits();
  saveData();

  this.reset();
  document.getElementById("dialog-visits").close();
};
