Note: This example assumes you have set up a Spring Boot project and have the necessary dependencies for Spring Data JPA and Spring Web.

To create APIs for all CRUD operations in this example, we will be using the Employee entity as an example. You can modify the code to suit your needs.

1. Create the Employee class:

Create a new file called Employee.java and add the following code:

```java
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

2. Create the EmployeeRepository interface:

Create a new file called EmployeeRepository.java and add the following code:

```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
```

3. Create the EmployeeController class:

Create a new file called EmployeeController.java and add the following code:

```java
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

   @GetMapping("/{id}")
   public Employee getEmployeeById(@PathVariable Long id) {
       return employeeRepository.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
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

4. Set up the frontend (HTML, CSS, JS):

Create a new file called index.html and add the following code:

```html
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

Create a new file called script.js in the js directory and add the following code:

```javascript
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
```

Make sure to include the necessary dependencies for Spring Boot, set up the configuration files, and run the application. Access the frontend by opening index.html in a web browser.

This example provides a template for creating CRUD APIs using Spring Boot and a basic frontend UI using HTML, CSS, and JS. You can modify the code according to your specific requirements and customize the UI design to fit your needs.