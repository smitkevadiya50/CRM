import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import LoadingComp from './loading';

Modal.setAppElement('#root'); 


const EmpDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalPhotoUrl, setModalPhotoUrl] = useState('');
  const [employeeCount, setEmployeeCount] = useState({
    Supervisor: 0,
    Manager: 0,
    Worker: 0,
    Helper: 0,
    total: 0,
  });

  const [formState, setFormState] = useState({
    name: '',
    reference_name: '',
    age: '',
    number: '',
    address: '',
    category: '',
    joining_date: '',
    photo: null,
    adhar_photo: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const addEmployee = async () => {
    const formData = new FormData();
    for (const key in formState) {
      formData.append(key, formState[key]);
    }

    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:3001/employee', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setEmployees([...employees, response.data]);
    } catch (error) {
      console.error("Error adding employee", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://127.0.0.1:3001/employee/${id}`);
      setEmployees((prevEmployees) => prevEmployees.filter(employee => employee._id !== id));
    } catch (error) {
      console.error('Error deleting employee', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async () => {
    const formData = new FormData();
    for (const key in formState) {
      formData.append(key, formState[key]);
    }

    try {
      setLoading(true);
      const response = await axios.put(`http://127.0.0.1:3001/employee/${employees[editingIndex]._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Update the local state with the updated employee data
      setEmployees((prevEmployees) => 
        prevEmployees.map(emp => (emp._id === employees[editingIndex]._id ? response.data : emp))
      );
    } catch (error) {
      console.error('Error updating employee', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeeRes, categoryRes] = await Promise.all([
          axios.get('http://127.0.0.1:3001/employee'),
          axios.get('http://127.0.0.1:3001/category')
        ]);
        setCategories(categoryRes.data);
        setEmployees(employeeRes.data);

      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Count employees by category
    const countEmployees = () => {
      const counts = categories.reduce((acc, category) => {
        acc[category.name] = 0;
        return acc;
      }, {});

      employees.forEach(employee => {
        const category = categories.find(cat => cat._id === employee.category);
        if (category) {
          counts[category.name]++;
        }
      });

      setEmployeeCount({
        Supervisor: counts.Supervisor || 0,
        Manager: counts.Manager || 0,
        Worker: counts.Worker || 0,
        Helper: counts.Helper || 0,
        total: employees.length,
      });
    };

    if (employees.length && categories.length) {
      countEmployees();
    }
  }, [employees, categories]);

  const handleDropdownToggle = (index) => {
    setIsDropdownOpen(isDropdownOpen === index ? null : index);
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    setFormState({ ...formState, [id]: files[0] });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (isEditing) {
      updateEmployee();
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      await addEmployee();
    }
    setFormState({
      name: '',
      reference_name: '',
      age: '',
      number: '',
      address: '',
      category: '',
      joining_date: '',
      photo: null,
      adhar_photo: null
    });
  };

  const handleUpdate = (index) => {
    setIsEditing(true);
    setEditingIndex(index);
    setFormState(employees[index]);
    setIsDropdownOpen(null);
  };

  const handleDelete = (id) => {
    deleteEmployee(id);
    setIsDropdownOpen(null);
  };

  if (loading) {
    return (
      <LoadingComp/>
    );
  }

  const openModal = (photoUrl) => {
    setModalPhotoUrl(photoUrl);
    setModalIsOpen(true);
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
    setModalPhotoUrl('');
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%', // Width of the modal
      height: 'auto', // Adjust the height based on content
      maxHeight: '90vh', // Maximum height to prevent overflow
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)' // Background color of the overlay
    }
  };
  
  

  return (
    <div className="h-full">
      <div className="mb-4 mt-4 mx-8 p-4 rounded bg-white text-lg font-semibold">
        Employee Dashboard
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 mt-4 mx-8">
        <div className="bg-white p-4 shadow-lg rounded">Total Supervisors<br/><h1 className='text-4xl'>{employeeCount.Supervisor}</h1></div>
        <div className="bg-white p-4 shadow-lg rounded">Total Managers<br /><h1 className='text-4xl'>{employeeCount.Manager}</h1></div>
        <div className="bg-white p-4 shadow-lg rounded">Total Workers<br /><h1 className='text-4xl'>{employeeCount.Worker}</h1></div>
        <div className="bg-white p-4 shadow-lg rounded">Total Helpers<br /><h1 className='text-4xl'>{employeeCount.Helper}</h1></div>
        <div className="bg-white p-4 shadow-lg rounded">Total Employees<br /><h1 className='text-4xl'>{employeeCount.total}</h1></div>
      </div>
      <form className="bg-white p-8 shadow rounded mb-8 mx-8" onSubmit={handleAddEmployee}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="siteName" className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={formState.name}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="referenceName" className="block mb-2 text-sm font-medium text-gray-700">
              Reference Name
            </label>
            <input
              type="text"
              id="reference_name"
              name="reference_name"
              placeholder="Reference Name"
              value={formState.reference_name}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="ownerName" className="block mb-2 text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="text"
              id="age"
              name="age"
              placeholder="Age"
              value={formState.age}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="number"
              name="number"
              placeholder="Phone Number"
              value={formState.number}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="area" className="block mb-2 text-sm font-medium text-gray-700">
              Choose Area
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address"
              value={formState.address}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
              Choose Category
            </label>
            <select name="category" id="category" className="border p-2 rounded w-full" value={formState.category} onChange={handleInputChange}>
              <option value="">Choose Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="aadhar-upload" className="block mb-2 text-sm font-medium text-gray-700">
              Joining Date
            </label>
            <input type="date" name="joining_date" placeholder="Joining Date" value={formState.joining_date} onChange={handleInputChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label htmlFor="aadhar-upload" className="block mb-2 text-sm font-medium text-gray-700">
              Aadhar Photo
            </label>
            <input type="file" id="adhar_photo" className="border p-2 rounded w-full" onChange={handleFileChange}/>
          </div>
          <div>
            <label htmlFor="photo-upload" className="block mb-2 text-sm font-medium text-gray-700">
              Profile Photo
            </label>
            <input type="file" id="photo" className="border p-2 rounded w-full" onChange={handleFileChange}/>
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          {isEditing ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>
      <div className="overflow-auto mx-8">
        <table className="min-w-full bg-white">
          <thead>
            <tr style={{backgroundColor: '#F0F1F6'}}>
              <th className="py-2 px-4 border-b">Profile</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Age</th>
              <th className="py-2 px-4 border-b">Phone Number</th>
              <th className="py-2 px-4 border-b">Area</th>
              <th className="py-2 px-4 border-b">Reference Name</th>
              <th className="py-2 px-4 border-b">Joining Date</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Aadhar Photo</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee._id} className='text-center'>
                <td className="py-2 px-4 border-b text-center"><img src={employee.photo} alt="Profile" className="w-12 h-12 rounded-lg mx-auto" /></td>
                <td className="py-2 px-4 border-b">{employee.name}</td>
                <td className="py-2 px-4 border-b">{employee.age}</td>
                <td className="py-2 px-4 border-b">{employee.number}</td>
                <td className="py-2 px-4 border-b">{employee.address}</td>
                <td className="py-2 px-4 border-b">{employee.reference_name}</td>
                <td className="py-2 px-4 border-b">{new Date(employee.joining_date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{categories.find(category => category._id === employee.category)?.name}</td>
                <td className="py-2 px-4 border-b">
                  <div onClick={() => openModal(employee.adhar_photo)} className=" text-blue-400 font-bold py-1 px-3 rounded">View</div>  
                </td>                
                <td className="py-2 px-4 border-b relative">
                  <button onClick={() => handleDropdownToggle(index)} className="focus:outline-none">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h.01M12 12h.01M12 18h.01" />
                    </svg>
                  </button>
                  {isDropdownOpen === index && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                      <button onClick={() => handleUpdate(index)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Update</button>
                      <button onClick={() => handleDelete(employee._id)} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Photo Modal"
      >
        <div className="flex flex-col items-center">
          <img src={modalPhotoUrl} alt="Employee" className="max-w-full max-h-96 object-contain" />
          <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default EmpDashboard;
