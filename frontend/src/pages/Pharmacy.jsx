import {useEffect,useState} from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import {errorMessage,listFrom} from "../utils/data";
import {useAuth} from "../context/AuthContext";

export default function Pharmacy(){
 const {user}=useAuth();const[meds,setMeds]=useState([]),[stock,setStock]=useState([]),[disp,setDisp]=useState([]),[form,setForm]=useState({medicineId:"",patientId:"",quantity:""}),[error,setError]=useState(""),[success,setSuccess]=useState("");
 const canDisp=user?.role==="ADMIN"||user?.role==="PHARMACIST";
 const load=async()=>{try{const[m,i,d]=await Promise.all([api.get("/medicines"),api.get("/inventory"),api.get("/dispensations")]);setMeds(listFrom(m.data,["medicines"]));setStock(listFrom(i.data,["inventory"]));setDisp(listFrom(d.data,["dispensations"]))}catch(e){setError(errorMessage(e,"Unable to load pharmacy data."))}};useEffect(()=>{load()},[]);
 const dispense=async e=>{e.preventDefault();try{await api.post("/dispensations",{medicineId:Number(form.medicineId),patientId:Number(form.patientId),quantity:Number(form.quantity)});setSuccess("Medicine dispensed.");setForm({medicineId:"",patientId:"",quantity:""});load()}catch(e){setError(errorMessage(e,"Unable to dispense medicine."))}};
 return <div><PageHeader title="Pharmacy" subtitle="Medicine catalog, inventory and dispensing"/>{error&&<div className="alert error">{error}</div>}{success&&<div className="alert success">{success}</div>}
 {canDisp&&<div className="panel"><h2>Dispense Medicine</h2><form className="inline-form" onSubmit={dispense}><label>Medicine<select value={form.medicineId} onChange={e=>setForm({...form,medicineId:e.target.value})} required><option value="">Select</option>{meds.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label><label>Patient ID<input type="number" value={form.patientId||""} onChange={e=>setForm({...form,patientId:e.target.value})} required/></label><label>Quantity<input type="number" min="1" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required/></label><button className="primary-button">Dispense</button></form></div>}
 <div className="panel"><h2>Inventory</h2><div className="table-wrap"><table><thead><tr><th>Medicine</th><th>Quantity</th><th>Reorder Level</th><th>Status</th></tr></thead><tbody>{stock.map(s=><tr key={s.id}><td>{s.medicine?.name||s.medicineId}</td><td>{s.quantity}</td><td>{s.reorderLevel}</td><td><span className={`status-badge ${s.quantity<=s.reorderLevel?"danger":"completed"}`}>{s.quantity<=s.reorderLevel?"LOW STOCK":"OK"}</span></td></tr>)}</tbody></table></div></div>
 <div className="panel"><h2>Recent Dispensations</h2><div className="table-wrap"><table><thead><tr><th>Medicine</th><th>Patient</th><th>Quantity</th><th>Date</th></tr></thead><tbody>{disp.slice(0,20).map(d=><tr key={d.id}><td>{d.medicine?.name||d.medicineId}</td><td>{d.patient?.patientCode||d.patientId}</td><td>{d.quantity}</td><td>{d.dispensedAt?new Date(d.dispensedAt).toLocaleString("en-IN"):"—"}</td></tr>)}</tbody></table></div></div></div>
}
