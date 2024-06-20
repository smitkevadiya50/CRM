import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const SiteDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [sites, setSites] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [managers, setManagers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [formState, setFormState] = useState({
    site_name: '',
    site_location: '',
    owner_name: '',
    owner_number: '',
    supervisor: '',
    manager: '',
    worker: [],
    helper: [],
    joining_date: '',
    ending_date: '',
    site_logo: 'https://upload.wikimedia.org/wikipedia/en/d/d7/Random_person_image.png?20100615155821'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployeesByCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:3001/employee/by-category');
        setSupervisors(response.data.supervisors);
        setManagers(response.data.managers);
        setWorkers(response.data.worker);
        setHelpers(response.data.helper);
      } catch (error) {
        console.error('Error fetching employees by category', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSites = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:3001/site');
        setSites(response.data);
      } catch (error) {
        console.error('Error fetching sites', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeesByCategory();
    fetchSites();
  }, []);

  const handleDropdownToggle = (index) => {
    setIsDropdownOpen(isDropdownOpen === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSelectChange = (selectedOption, { name }) => {
    if (name === 'worker' || name === 'helper') {
      setFormState({ ...formState, [name]: selectedOption ? selectedOption.map(opt => opt.value) : [] });
    } else {
      setFormState({ ...formState, [name]: selectedOption ? selectedOption.value : '' });
    }
  };

  const handleAddSite = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = isEditing
        ? await axios.put(`http://127.0.0.1:3001/site/${sites[editingIndex]._id}`, formState)
        : await axios.post('http://127.0.0.1:3001/site', formState);

      const updatedSites = isEditing
        ? sites.map((s, index) => (index === editingIndex ? response.data : s))
        : [...sites, response.data];

      setSites(updatedSites);
      setIsEditing(false);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error saving site', error);
    } finally {
      setLoading(false);
      setFormState({
        site_name: '',
        site_location: '',
        owner_name: '',
        owner_number: '',
        supervisor: '',
        manager: '',
        worker: [],
        helper: [],
        joining_date: '',
        ending_date: '',
        site_logo: ''
      });
    }
  };

  const handleUpdate = (index) => {
    setIsEditing(true);
    setEditingIndex(index);
    const siteToEdit = sites[index];
    setFormState({
      site_name: siteToEdit.site_name,
      site_location: siteToEdit.site_location,
      owner_name: siteToEdit.owner_name,
      owner_number: siteToEdit.owner_number,
      supervisor: siteToEdit.supervisor,
      manager: siteToEdit.manager,
      worker: siteToEdit.worker,
      helper: siteToEdit.helper,
      joining_date: siteToEdit.joining_date.split('T')[0],
      ending_date: siteToEdit.ending_date.split('T')[0],
    });
    setIsDropdownOpen(null);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://127.0.0.1:3001/site/${id}`);
      setSites(sites.filter(site => site._id !== id));
    } catch (error) {
      console.error('Error deleting site', error);
    } finally {
      setLoading(false);
    }
  };

  const employeeOptions = (employees) => employees.map(employee => ({ value: employee._id, label: employee.name }));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full">
      <div className="mb-4 mt-4 mx-8 p-4 rounded bg-white">
        Site Dashboard
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 mt-4 mx-8">
        <div className="bg-white p-4 shadow-lg rounded">Total Sites<br /><h1 className='text-4xl'>10</h1></div>
        <div className="bg-white p-4 shadow-lg rounded">Total Managers<br /><h1 className='text-4xl'>05</h1></div>
        <div className="bg-white p-4 shadow-lg rounded">Total Workers<br /><h1 className='text-4xl'>30</h1></div>
        <div className="bg-white p-4 shadow-lg rounded">Total Helpers<br /><h1 className='text-4xl'>05</h1></div>
        <div className="bg-white p-4 shadow-lg rounded">Total Employees<br /><h1 className='text-4xl'>41</h1></div>
      </div>
      <form className="bg-white p-8 shadow rounded mb-8 mx-8" onSubmit={handleAddSite}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input type="text" name="site_name" placeholder="Site Name" value={formState.site_name} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="site_location" placeholder="Site Location" value={formState.site_location} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="owner_name" placeholder="Owner Name" value={formState.owner_name} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="owner_number" placeholder="Owner Number" value={formState.owner_number} onChange={handleInputChange} className="border p-2 rounded" />
          <Select
            name="supervisor"
            placeholder="Select Supervisor"
            value={employeeOptions(supervisors).find(option => option.value === formState.supervisor)}
            onChange={handleSelectChange}
            options={employeeOptions(supervisors)}
            className="border p-2 rounded"
          />
          <Select
            name="manager"
            placeholder="Select Manager"
            value={employeeOptions(managers).find(option => option.value === formState.manager)}
            onChange={handleSelectChange}
            options={employeeOptions(managers)}
            className="border p-2 rounded"
          />
          <Select
            name="worker"
            placeholder="Select Worker(s)"
            value={employeeOptions(workers).filter(option => formState.worker.includes(option.value))}
            onChange={handleSelectChange}
            options={employeeOptions(workers)}
            isMulti
            className="border p-2 rounded"
          />
          <Select
            name="helper"
            placeholder="Select Helper(s)"
            value={employeeOptions(helpers).filter(option => formState.helper.includes(option.value))}
            onChange={handleSelectChange}
            options={employeeOptions(helpers)}
            isMulti
            className="border p-2 rounded"
          />
          <input type="date" name="joining_date" placeholder="Joining Date" value={formState.joining_date} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="date" name="ending_date" placeholder="Ending Date" value={formState.ending_date} onChange={handleInputChange} className="border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Site Logo</label>
          <input type="file" className="border p-2 rounded w-full" />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          {isEditing ? 'Update Site' : 'Add Site'}
        </button>
      </form>
      <div className="overflow-auto mx-8">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Logo</th>
              <th className="py-2 px-4 border-b">Site Name</th>
              <th className="py-2 px-4 border-b">Site Location</th>
              <th className="py-2 px-4 border-b">Owner Name</th>
              <th className="py-2 px-4 border-b">Owner Number</th>
              <th className="py-2 px-4 border-b">Supervisor</th>
              <th className="py-2 px-4 border-b">Manager</th>
              <th className="py-2 px-4 border-b">Worker</th>
              <th className="py-2 px-4 border-b">Helper</th>
              <th className="py-2 px-4 border-b">Join Date</th>
              <th className="py-2 px-4 border-b">End Date</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-center"><span className="block w-4 h-4 rounded-full bg-purple-500 mx-auto"></span></td>
                <td className="py-2 px-4 border-b">{site.site_name}</td>
                <td className="py-2 px-4 border-b">{site.site_location}</td>
                <td className="py-2 px-4 border-b">{site.owner_name}</td>
                <td className="py-2 px-4 border-b">{site.owner_number}</td>
                <td className="py-2 px-4 border-b">{supervisors.find(sup => sup._id === site.supervisor)?.name || ''}</td>
                <td className="py-2 px-4 border-b">{managers.find(man => man._id === site.manager)?.name || ''}</td>
                <td className="py-2 px-4 border-b">
                  {site.worker.map(workerId => (
                    <div key={workerId}>{workers.find(w => w._id === workerId)?.name || ''}</div>
                  ))}
                </td>
                <td className="py-2 px-4 border-b">
                  {site.helper.map(helperId => (
                    <div key={helperId}>{helpers.find(h => h._id === helperId)?.name || ''}</div>
                  ))}
                </td>
                <td className="py-2 px-4 border-b">{site.joining_date.split('T')[0]}</td>
                <td className="py-2 px-4 border-b">{site.ending_date.split('T')[0]}</td>
                <td className="py-2 px-4 border-b relative">
                  <button onClick={() => handleDropdownToggle(index)} className="focus:outline-none">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h.01M12 12h.01M12 18h.01" />
                    </svg>
                  </button>
                  {isDropdownOpen === index && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                      <button onClick={() => handleUpdate(index)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Update</button>
                      <button onClick={() => handleDelete(site._id)} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SiteDashboard;
