import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: "",
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${API_URL}?search=${search}&department=${department}&sortBy=${sortBy}&order=${order}&page=${page}&limit=5`
      );
      setEmployees(res.data.employees);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      alert("Error fetching employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, department, sortBy, order, page]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
        alert("Employee updated successfully");
      } else {
        await axios.post(API_URL, formData);
        alert("Employee added successfully");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        salary: "",
      });
      setEditId(null);
      fetchEmployees();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (employee) => {
    setEditId(employee._id);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("Employee deleted successfully");
        fetchEmployees();
      } catch (error) {
        alert("Error deleting employee");
      }
    }
  };

  return (
    <div className="container">
      <h1>Employee Management System</h1>
      <p className="subtitle">Full Stack CRUD App using React, Node, Express and MongoDB</p>

      <form onSubmit={handleSubmit} className="form">
        <input name="name" placeholder="Employee Name" value={formData.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
        <input name="position" placeholder="Position" value={formData.position} onChange={handleChange} required />
        <input name="salary" type="number" placeholder="Salary" value={formData.salary} onChange={handleChange} required />

        <button type="submit">{editId ? "Update Employee" : "Add Employee"}</button>
      </form>

      <div className="filters">
        <input
          placeholder="Search by name, email or position"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <input
          placeholder="Filter by department"
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setPage(1);
          }}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Newest</option>
          <option value="name">Name</option>
          <option value="salary">Salary</option>
          <option value="department">Department</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="7">No employees found</td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department}</td>
                <td>{emp.position}</td>
                <td>₹{emp.salary}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(emp)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(emp._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App; 