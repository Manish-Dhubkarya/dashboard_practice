import React from 'react';
import { useSelector } from 'react-redux';

const AdminList = () => {
  const admins = useSelector((state) => state.admin.admins);

  return (
    <div>
      <h2>Registered Admins</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.id}</td>
              <td>{admin.adminName}</td>
              <td>{admin.email}</td>
              <td>{admin.mobileNumber}</td>
              <td>
                <img src={admin.imageData} alt="Admin" style={{ width: '50px', height: '50px' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;
