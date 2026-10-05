import { useEffect,useState } from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { errorMessage,listFrom,formatDateTime } from "../utils/data";
import { useAuth } from "../context/AuthContext";

const blank={patientId:"",doctorId:"",departmentId:"",appointmentDate:"",tokenNumber:"",reason:""};
export default function Appointments(){
 const {user}=useAuth(); const [rows,setRows]=useState([]),[form,setForm]=useState(blank),[show,setShow]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState("");
 const canCreate=["ADMIN","RECEPTIONIST"].includes(user?.role);
 const load=async()=>{try{const {data}=await api.get("/appointments");setRows(listFrom(data,["appointments"]))}catch(e){setError(errorMessage(e,"Unable to load appointments."))}};
 useEffect(()=>{load()},[]);
 const submit=async e=>{e.preventDefault();setBusy(true);setError("");try{await api.post("/appointments",{...form,patientId:Number(form.patientId),doctorId:Number(form.doctorId),departmentId:Number(form.departmentId),tokenNumber:form.tokenNumber?Number(form.tokenNumber):undefined});setSuccess("Appointment created.");setForm(blank);setShow(false);load()}catch(e){setError(errorMessage(e,"Unable to create appointment."))}finally{setBusy(false)}};
 const cancel=async id=>{if(!confirm("Cancel this appointment?"))return;try{await api.patch(`/appointments/${id}/cancel`);setSuccess("Appointment cancelled.");load()}catch(e){setError(errorMessage(e,"Unable to cancel appointment."))}};
 return <div><PageHeader title="Appointments" subtitle="Schedule and manage patient appointments" action={canCreate&&<button className="primary-button" onClick={()=>setShow(true)}>+ New Appointment</button>}/>{error&&<div className="alert error">{error}</div>}{success&&<div className="alert success">{success}</div>}
 {show&&<div className="panel"><div className="panel-title"><h2>New Appointment</h2><button className="icon-button" onClick={()=>setShow(false)}>×</button></div><form className="form-grid" onSubmit={submit}>
 <label>Patient ID *<input type="number" value={form.patientId} onChange={e=>setForm({...form,patientId:e.target.value})} required/></label>
 <label>Doctor ID *<input type="number" value={form.doctorId} onChange={e=>setForm({...form,doctorId:e.target.value})} required/></label>
 <label>Department ID *<input type="number" value={form.departmentId} onChange={e=>setForm({...form,departmentId:e.target.value})} required/></label>
 <label>Appointment Date & Time *<input type="datetime-local" value={form.appointmentDate} onChange={e=>setForm({...form,appointmentDate:e.target.value})} required/></label>
 <label>Token Number<input type="number" value={form.tokenNumber} onChange={e=>setForm({...form,tokenNumber:e.target.value})}/></label>
 <label className="full">Reason<textarea rows="3" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/></label>
 <div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setShow(false)}>Cancel</button><button className="primary-button" disabled={busy}>{busy?"Saving...":"Create Appointment"}</button></div></form></div>}
 <div className="panel"><div className="toolbar"><h2>Appointment Schedule</h2><small>{rows.length} records</small></div><div className="table-wrap"><table><thead><tr><th>Token</th><th>Patient</th><th>Doctor</th><th>Department</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map(a=><tr key={a.id}><td>{a.tokenNumber||"—"}</td><td>{a.patient?.firstName||a.patientId} {a.patient?.lastName||""}</td><td>{a.doctor?.user?.name||a.doctorId}</td><td>{a.department?.name||a.departmentId}</td><td>{formatDateTime(a.appointmentDate)}</td><td><StatusBadge value={a.status}/></td><td>{a.status==="SCHEDULED"&&<button className="small-button danger" onClick={()=>cancel(a.id)}>Cancel</button>}</td></tr>)}</tbody></table></div></div></div>
}
