import {useEffect,useState} from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import {errorMessage,listFrom,formatDateTime} from "../utils/data";
import {useAuth} from "../context/AuthContext";

const blank={clinicalRecordId:"",notes:"",medicineId:"",dosage:"",frequency:"",duration:"",quantity:""};
export default function Prescriptions(){
 const {user}=useAuth();const[rows,setRows]=useState([]),[meds,setMeds]=useState([]),[form,setForm]=useState(blank),[show,setShow]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState(""),[busy,setBusy]=useState(false);
 const canCreate=user?.role==="ADMIN"||user?.role==="DOCTOR";
 useEffect(()=>{load();loadMeds()},[]);
 const load=async()=>{try{const{data}=await api.get("/prescriptions");setRows(listFrom(data,["prescriptions"]))}catch(e){setError(errorMessage(e,"Unable to load prescriptions."))}};
 const loadMeds=async()=>{try{const{data}=await api.get("/medicines");setMeds(listFrom(data,["medicines"]))}catch{}};
 const submit=async e=>{e.preventDefault();setBusy(true);try{await api.post("/prescriptions",{clinicalRecordId:Number(form.clinicalRecordId),notes:form.notes,items:[{medicineId:Number(form.medicineId),dosage:form.dosage,frequency:form.frequency,duration:form.duration,quantity:form.quantity?Number(form.quantity):undefined}]});setSuccess("Prescription created.");setForm(blank);setShow(false);load()}catch(e){setError(errorMessage(e,"Unable to create prescription."))}finally{setBusy(false)}};
 return <div><PageHeader title="Prescriptions" subtitle="Digital prescriptions linked to clinical records" action={canCreate&&<button className="primary-button" onClick={()=>setShow(true)}>+ New Prescription</button>}/>{error&&<div className="alert error">{error}</div>}{success&&<div className="alert success">{success}</div>}
 {show&&<div className="panel"><div className="panel-title"><h2>New Prescription</h2><button className="icon-button" onClick={()=>setShow(false)}>×</button></div><form className="form-grid" onSubmit={submit}>
 <label>Clinical Record ID *<input type="number" value={form.clinicalRecordId} onChange={e=>setForm({...form,clinicalRecordId:e.target.value})} required/></label>
 <label>Medicine *<select value={form.medicineId} onChange={e=>setForm({...form,medicineId:e.target.value})} required><option value="">Select medicine</option>{meds.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
 <label>Dosage<input value={form.dosage} onChange={e=>setForm({...form,dosage:e.target.value})}/></label><label>Frequency<input value={form.frequency} onChange={e=>setForm({...form,frequency:e.target.value})}/></label><label>Duration<input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})}/></label><label>Quantity<input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})}/></label>
 <label className="full">Notes<textarea rows="3" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label><div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setShow(false)}>Cancel</button><button className="primary-button" disabled={busy}>{busy?"Saving...":"Create Prescription"}</button></div></form></div>}
 <div className="panel"><div className="table-wrap"><table><thead><tr><th>ID</th><th>Clinical Record</th><th>Date</th><th>Items</th><th>Notes</th></tr></thead><tbody>{rows.map(p=><tr key={p.id}><td>#{p.id}</td><td>{p.clinicalRecordId}</td><td>{formatDateTime(p.prescribedAt)}</td><td>{p.items?.map(i=><div key={i.id}>{i.medicine?.name||i.medicineId} — {i.dosage||""} {i.frequency||""}</div>)||"—"}</td><td>{p.notes||"—"}</td></tr>)}</tbody></table></div></div></div>
}
