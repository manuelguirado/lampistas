
import {useState} from 'react';
import Header from "./components/header";
import toast from 'react-hot-toast';
export default function SuspendCompany() {
    const [formData, setFormData] = useState({ companyID: "" ,until :""});
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    fetch(`http://localhost:3000/admin/suspendCompany/${formData.companyID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
      body: JSON.stringify({
        companyID: formData.companyID,
        until: new Date(formData.until),
      }),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success('Company suspended successfully!');
      })
      .catch((error) => {
        toast.error('Error suspending company.' + error.message);
      });
  }
  return (
    <div className=" w-full h-full flex flex-col bg-white/80 justify-center items-center p-4">
        <Header />
      <h2 className="text-2xl font-bold p-20">Suspend Company Page</h2>
       <form action="" method="post" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company ID"
          value={formData.companyID}
          onChange={(e) => setFormData({ ...formData, companyID: e.target.value })}
          className="border p-2 mb-4"
        />
        <input
          type="date"
          placeholder="Until"
          value={formData.until}
          onChange={(e) => setFormData({ ...formData, until: e.target.value })}
          className="border p-2 mb-4"
        />
        <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded">
          Suspend Company
        </button>
      </form>
    </div>
  );
}
