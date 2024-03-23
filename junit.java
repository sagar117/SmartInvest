import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

@ExtendWith(SpringExtension.class)
@WebMvcTest(EmployeeController.class)
public class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeRepository employeeRepository;

    @Test
    public void testGetAllEmployees() throws Exception {
        Employee employee1 = new Employee("John Doe", 5000, "Manager");
        Employee employee2 = new Employee("Jane Smith", 6000, "Supervisor");
        List<Employee> employees = Arrays.asList(employee1, employee2);

        when(employeeRepository.findAll()).thenReturn(employees);

        mockMvc.perform(get("/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is(employee1.getName())))
                .andExpect(jsonPath("$[0].salary", is(employee1.getSalary())))
                .andExpect(jsonPath("$[0].designation", is(employee1.getDesignation())))
                .andExpect(jsonPath("$[1].name", is(employee2.getName())))
                .andExpect(jsonPath("$[1].salary", is(employee2.getSalary())))
                .andExpect(jsonPath("$[1].designation", is(employee2.getDesignation())));
    }

    @Test
    public void testCreateEmployee() throws Exception {
        Employee employee = new Employee("John Doe", 5000, "Manager");

        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

        mockMvc.perform(post("/employees")
                .contentType("application/json")
                .content("{\"name\":\"John Doe\",\"salary\":5000,\"designation\":\"Manager\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(employee.getName())))
                .andExpect(jsonPath("$.salary", is(employee.getSalary())))
                .andExpect(jsonPath("$.designation", is(employee.getDesignation())));
    }

    @Test
    public void testUpdateEmployee() throws Exception {
        Employee existingEmployee = new Employee("John Doe", 5000, "Manager");
        Employee updatedEmployee = new Employee("John Smith", 6000, "Supervisor");

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(existingEmployee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(updatedEmployee);

        mockMvc.perform(put("/employees/1")
                .contentType("application/json")
                .content("{\"name\":\"John Smith\",\"salary\":6000,\"designation\":\"Supervisor\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(updatedEmployee.getName())))
                .andExpect(jsonPath("$.salary", is(updatedEmployee.getSalary())))
                .andExpect(jsonPath("$.designation", is(updatedEmployee.getDesignation())));
    }

    @Test
    public void testDeleteEmployee() throws Exception {
        Employee employee = new Employee("John Doe", 5000, "Manager");

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        mockMvc.perform(delete("/employees/1"))
                .andExpect(status().isOk());
    }
}
```

Note: This is just an example, and you may need to customize the test methods based on your specific requirements and validations.