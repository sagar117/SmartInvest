
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Employee {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   private String name;
   private double salary;
   private String designation;

   // Constructors, getters, and setters

   // You can also include any additional methods and validations here
}
```

EmployeeRepository.java:
```
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
```

EmployeeController.java:
```
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

   @Autowired
   private EmployeeRepository employeeRepository;

   @GetMapping
   public List<Employee> getAllEmployees() {
       return employeeRepository.findAll();
   }

   @PostMapping
   public Employee createEmployee(@RequestBody Employee employee) {
       return employeeRepository.save(employee);
   }

   @PutMapping("/{id}")
   public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
       Employee employee = employeeRepository.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

       employee.setName(employeeDetails.getName());
       employee.setSalary(employeeDetails.getSalary());
       employee.setDesignation(employeeDetails.getDesignation());

       return employeeRepository.save(employee);
   }

   @DeleteMapping("/{id}")
   public void deleteEmployee(@PathVariable Long id) {
       Employee employee = employeeRepository.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

       employeeRepository.delete(employee);
   }
}
```

Frontend (HTML, CSS, JS):

index.html:
```
<body>
   <h1>Employee Database</h1>
   <form id="employeeForm">
       <input type="text" id="name" placeholder="Name">
       <input type="number" id="salary" placeholder="Salary">
       <input type="text" id="designation" placeholder="Designation">
       <button type="submit">Add Employee</button>
   </form>
   <table id="employeeTable">
       <thead>
           <tr>
               <th>Name</th>
               <th>Salary</th>
               <th>Designation</th>
               <th>Actions</th>
           </tr>
       </thead>
       <tbody id="employeeTableBody"></tbody>
   </table>

   <script src="js/script.js"></script>
</body>
```

script.js:
```
// Fetch all employees and display them in the table
fetch("/employees")
   .then(response => response.json())
   .then(employees => {
       const employeeTableBody = document.getElementById("employeeTableBody");

       employees.forEach(employee => {
           const row = document.createElement("tr");
           row.innerHTML = `
               <td>${employee.name}</td>
               <td>${employee.salary}</td>
               <td>${employee.designation}</td>
               <td>
                   <button onclick="editEmployee(${employee.id})">Edit</button>
                   <button onclick="deleteEmployee(${employee.id})">Delete</button>
               </td>
           `;
           employeeTableBody.appendChild(row);
       });
   });

// Add a new employee when the form is submitted
document.getElementById("employeeForm").addEventListener("submit", function(event) {
   event.preventDefault();

   const name = document.getElementById("name").value;
   const salary = document.getElementById("salary").value;
   const designation = document.getElementById("designation").value;

   fetch("/employees", {
       method: "POST",
       headers: {
           "Content-Type": "application/json"
       },
       body: JSON.stringify({ name, salary, designation })
   })
   .then(response => response.json())
   .then(employee => {
       const employeeTableBody = document.getElementById("employeeTableBody");

       const row = document.createElement("tr");
       row.innerHTML = `
           <td>${employee.name}</td>
           <td>${employee.salary}</td>
           <td>${employee.designation}</td>
           <td>
               <button onclick="editEmployee(${employee.id})">Edit</button>
               <button onclick="deleteEmployee(${employee.id})">Delete</button>
           </td>
       `;
       employeeTableBody.appendChild(row);

       // Clear form inputs
       document.getElementById("name").value = "";
       document.getElementById("salary").value = "";
       document.getElementById("designation").value = "";
   });
});

// Edit an existing employee
function editEmployee(id) {
   // Implement your edit logic here
}

// Delete an employee
function deleteEmployee(id) {
   // Implement your delete logic here
}
