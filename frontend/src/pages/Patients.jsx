import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import { errorMessage, listFrom, formatDate } from "../utils/data";

const blank={firstName:"",lastName:"",dateOfBirth:"",gender:"",phone:"",email:"",address:"",bloodGroup:""};

export default function Patients(){
  const {user}=useAuth(); const [rows,setRows]=useState([]); const [form,setForm]=useState(blank);
  const [editing,setEditing]=useState(null); const [search,setSearch]=useState(""); const [show,setShow]=useState(false);
  const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [success,setSuccess]=useState("");
  const canEdit=["ADMIN","RECEPTIONIST"].includes(user?.role); const canDelete=user?.role==="ADMIN";

  const load=async()=>{try{setError("");const {data}=await api.get("/patients");setRows(listFrom(data,["patients"]));}catch(e){setError(errorMessage(e,"Unable to load patients."));}};
  useEffect(()=>{load()},[]);
  const filtered=useMemo(()=>rows.filter(p=>`${p.patientCode} ${p.firstName} ${p.lastName||""} ${p.phone||""}`.toLowerCase().includes(search.toLowerCase())),[rows,search]);

  const submit=async e=>{e.preventDefault();setBusy(true);setError("");setSuccess("");try{
    const payload={...form,dateOfBirth:form.dateOfBirth||null,gender:form.gender||null};
    if(editing) await api.put(`/patients/${editing}`,payload); else await api.post("/patients",payload);
    setSuccess(editing?"Patient updated successfully.":"Patient registered successfully.");setForm(blank);setEditing(null);setShow(false);await load();
  }catch(e){setError(errorMessage(e,"Unable to save patient."));}finally{setBusy(false)}};

  const edit=p=>{setEditing(p.id);setForm({firstName:p.firstName||"",lastName:p.lastName||"",dateOfBirth:p.dateOfBirth?.slice(0,10)||"",gender:p.gender||"",phone:p.phone||"",email:p.email||"",address:p.address||"",bloodGroup:p.bloodGroup||""});setShow(true)};
  const remove=async id=>{if(!confirm("Delete this patient?"))return;try{await api.delete(`/patients/${id}`);setSuccess("Patient deleted.");await load()}catch(e){setError(errorMessage(e,"Unable to delete patient."))}};

  return <div>
    <PageHeader title="Patients" subtitle="Register and manage patient demographic records" action={canEdit&&<button className="primary-button" onClick={()=>{setForm(blank);setEditing(null);setShow(true)}}>+ Add Patient</button>}/>
    {error&&<div className="alert error">{error}</div>}{success&&<div className="alert success">{success}</div>}
    {show&&<div className="panel"><div className="panel-title"><h2>{editing?"Edit Patient":"Register Patient"}</h2><button className="icon-button" onClick={()=>setShow(false)}>×</button></div>
      <form className="form-grid" onSubmit={submit}>
        {["firstName","lastName","phone","email","bloodGroup"].map(name=><label key={name}>{name==="firstName"?"First Name":name==="lastName"?"Last Name":name==="bloodGroup"?"Blood Group":name[0].toUpperCase()+name.slice(1)}{name==="firstName"&&" *"}<input name={name} value={form[name]} onChange={e=>setForm({...form,[name]:e.target.value})} required={name==="firstName"}/></label>)}
        <label>Date of Birth<input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})}/></label>
        <label>Gender<select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option value="">Select</option><option>MALE</option><option>FEMALE</option><option>OTHER</option></select></label>
        <label className="full">Address<textarea rows="3" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label>
        <div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setShow(false)}>Cancel</button><button className="primary-button" disabled={busy}>{busy?"Saving...":editing?"Update":"Register"}</button></div>
      </form>
    </div>}
    <div className="panel"><div className="toolbar"><div><h2>Patient Records</h2><small>{rows.length} total</small></div><input className="search" placeholder="Search patient..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="table-wrap"><table><thead><tr><th>Code</th><th>Name</th><th>DOB</th><th>Gender</th><th>Phone</th><th>Blood</th>{canEdit&&<th>Actions</th>}</tr></thead>
      <tbody>{filtered.map(p=><tr key={p.id}><td><b>{p.patientCode}</b></td><td>{p.firstName} {p.lastName||""}</td><td>{formatDate(p.dateOfBirth)}</td><td>{p.gender||"—"}</td><td>{p.phone||"—"}</td><td>{p.bloodGroup||"—"}</td>{canEdit&&<td className="actions"><button className="small-button" onClick={()=>edit(p)}>Edit</button>{canDelete&&<button className="small-button danger" onClick={()=>remove(p.id)}>Delete</button>}</td>}</tr>)}</tbody></table></div>
      {filtered.length===0&&<div className="empty">No patients found.</div>}
    </div>
  </div>
}
