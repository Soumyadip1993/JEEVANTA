import {useEffect,useState} from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import {errorMessage,listFrom,formatDateTime} from "../utils/data";
import {useAuth} from "../context/AuthContext";

const blank={patientId:"",doctorId:"",appointmentId:"",symptoms:"",diagnosis:"",notes:""};
export default function ClinicalRecords(){
 const {user}=useAuth();const[rows,setRows]=useState([]),[form,setForm]=useState(blank),[show,setShow]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState(""),[busy,setBusy]=useState(false);
 const canCreate=["ADMIN","DOCTOR"].includes(user?.role);
 const load=async()=>{try{const{data}=await api.get("/clinical-records");setRows(listFrom(data,["records","clinicalRecords"]))}catch(e){setError(errorMessage(e,"Unable to load clinical records."))}};
 useEffect(()=>{load()},[]);
 const submit=async e=>{e.preventDefault();setBusy(true);try{await api.post("/clinical-records",{...form,patientId:Number(form.patientId),doctorId:Number(form.doctorId),appointmentId:form.appointmentId?Number(form.appointmentId):undefined});setSuccess("Clinical record created.");setForm(blank);setShow(false);load()}catch(e){setError(errorMessage(e,"Unable to create clinical record."))}finally{setBusy(false)}};
 return <div><PageHeader title="Clinical Records" subtitle="Electronic medical records and consultation notes" action={canCreate&&<button className="primary-button" onClick={()=>setShow(true)}>+ New Record</button>}/>{error&&<div className="alert error">{error}</div>}{success&&<div className="alert success">{success}</div>}
 {show&&<div className="panel"><div className="panel-title"><h2>Consultation Record</h2><button className="icon-button" onClick={()=>setShow(false)}>×</button></div><form className="form-grid" onSubmit={submit}>
 <label>Patient ID *<input type="number" value={form.patientId} onChange={e=>setForm({...form,patientId:e.target.value})} required/></label><label>Doctor ID *<input type="number" value={form.doctorId} onChange={e=>setForm({...form,doctorId:e.target.value})} required/></label><label>Appointment ID<input type="number" value={form.appointmentId} onChange={e=>setForm({...form,appointmentId:e.target.value})}/></label>
 <label className="full">Symptoms<textarea rows="3" value={form.symptoms} onChange={e=>setForm({...form,symptoms:e.target.value})}/></label><label className="full">Diagnosis<textarea rows="3" value={form.diagnosis} onChange={e=>setForm({...form,diagnosis:e.target.value})}/></label><label className="full">Notes<textarea rows="3" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
 <div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setShow(false)}>Cancel</button><button className="primary-button" disabled={busy}>{busy?"Saving...":"Save Record"}</button></div></form></div>}
 <div className="panel"><div className="table-wrap"><table><thead><tr><th>Patient</th><th>Doctor</th><th>Symptoms</th><th>Diagnosis</th><th>Created</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.patient?.patientCode||r.patientId}</td><td>{r.doctor?.user?.name||r.doctorId}</td><td>{r.symptoms||"—"}</td><td>{r.diagnosis||"—"}</td><td>{formatDateTime(r.createdAt)}</td></tr>)}</tbody></table></div></div></div>
}
