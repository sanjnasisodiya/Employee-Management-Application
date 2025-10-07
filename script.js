let employees = JSON.parse(localStorage.getItem("employees")) || [];

function renderTable(data) {
  const tbody = document.querySelector("#employeeTable tbody");
  tbody.innerHTML = "";
  data.forEach((emp, index) => {
    let row = `
        <tr>
          <td>${emp.id}</td>
          <td>${emp.name}</td>
          <td>${emp.email}</td>
          <td>${emp.mobile}</td>
          <td>
            <button onclick="editEmployee(${index})">Edit</button>
            <button onclick="deleteEmployee(${index})">Delete</button>
          </td>
        </tr>
      `;
    tbody.innerHTML += row;
  });
}

function validateEmployee(emp, isEdit = false, index = -1) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[6-9]\d{9}$/;

  if (!emp.id || !emp.name || !emp.email || !emp.mobile) {
    alert("All fields are required.");
    return false;
  }

  if (!emailRegex.test(emp.email)) {
    alert("Invalid email format.");
    return false;
  }

  if (!mobileRegex.test(emp.mobile)) {
    alert("Invalid mobile number. Must start with 6,7,8,9 and be 10 digits.");
    return false;
  }

  const duplicate = employees.some(
    (e, i) =>
      (e.id === emp.id || e.email === emp.email || e.mobile === emp.mobile) &&
      (!isEdit || i !== index)
  );
  if (duplicate) {
    alert("Duplicate ID, Email or Mobile not allowed.");
    return false;
  }

  return true;
}

document
  .getElementById("employeeForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("empId").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();

    const emp = { id, name, email, mobile };

    if (!validateEmployee(emp)) return;

    employees.push(emp);
    localStorage.setItem("employees", JSON.stringify(employees));
    renderTable(employees);
    this.reset();
  });

function editEmployee(index) {
  const emp = employees[index];
  document.getElementById("empId").value = emp.id;
  document.getElementById("name").value = emp.name;
  document.getElementById("email").value = emp.email;
  document.getElementById("mobile").value = emp.mobile;

  document.getElementById("employeeForm").onsubmit = function (e) {
    e.preventDefault();
    const updated = {
      id: document.getElementById("empId").value.trim(),
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      mobile: document.getElementById("mobile").value.trim(),
    };

    if (!validateEmployee(updated, true, index)) return;

    employees[index] = updated;
    localStorage.setItem("employees", JSON.stringify(employees));
    renderTable(employees);
    this.reset();
    this.onsubmit = defaultSubmit;
  };
}

function deleteEmployee(index) {
  if (confirm("Are you sure?")) {
    employees.splice(index, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
    renderTable(employees);
  }
}

const defaultSubmit = document.getElementById("employeeForm").onsubmit;

document.getElementById("search").addEventListener("input", function () {
  const keyword = this.value.trim();
  const filtered = employees.filter(
    (emp) => emp.id.includes(keyword) || emp.mobile.includes(keyword)
  );
  renderTable(filtered);
});

renderTable(employees);
