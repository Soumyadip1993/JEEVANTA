import {useEffect,useState} from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import {errorMessage,listFrom} from "../utils/data";
import {useAuth} from "../context/AuthContext";

export default function Wards(){
 const {user}=useAuth();const[wards,setWards]=useState([]),[beds,setBeds]=useState([]),[wardForm,setWardForm]=useState({name:"",wardType:"GENERAL",floor:"",capacity:""}),[bedForm,setBedForm]=useState({wardId:"",bedNumber:""}),[error,setError]=useState(""),[success,setSuccess]=useState("");
 const admin=user?.role==="ADMIN";
 const load=async()=>{try{const[w,b]=await Promise.all([api.get("/wards"),api.get("/beds")]);setWards(listFrom(w.data,["wards"]));setBeds(listFrom(b.data,["beds"]))}catch(e){setError(errorMessage(e,"Unable to load wards and beds."))}};useEffect(()=>{load()},[]);
 const addWard=async e=>{e.preventDefault();try{await api.post("/wards",{...wardForm,capacity:Number(wardForm.capacity)});setSuccess("Ward created.");setWardForm({name:"",wardType:"GENERAL",floor:"",capacity:""});load()}catch(e){setError(errorMessage(e,"Unable to create ward."))}};
 const addBed=async e=>{e.preventDefault();try{await api.post("/beds",{wardId:Number(bedForm.wardId),bedNumber:bedForm.bedNumber,status:"AVAILABLE"});setSuccess("Bed created.");setBedForm({wardId:"",bedNumber:""});load()}catch(e){setError(errorMessage(e,"Unable to create bed."))}};
 return <div><PageHeader title="Wards & Beds" subtitle="Monitor ward capacity and bed occupancy"/>{error&&<div className="alert error">{error}</div>}{success&&<div className="alert success">{success}</div>}
 {admin&&<div className="two-col"><form className="panel stack-form" onSubmit={addWard}><h2>Add Ward</h2><label>Name<input value={wardForm.name} onChange={e=>setWardForm({...wardForm,name:e.target.value})} required/></label><label>Type<input value={wardForm.wardType} onChange={e=>setWardForm({...wardForm,wardType:e.target.value})}/></label><label>Floor<input value={wardForm.floor} onChange={e=>setWardForm({...wardForm,floor:e.target.value})}/></label><label>Capacity<input type="number" value={wardForm.capacity} onChange={e=>setWardForm({...wardForm,capacity:e.target.value})} required/></label><button className="primary-button">Create Ward</button></form>
 <form className="panel stack-form" onSubmit={addBed}><h2>Add Bed</h2><label>Ward<select value={bedForm.wardId} onChange={e=>setBedForm({...bedForm,wardId:e.target.value})} required><option value="">Select ward</option>{wards.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select></label><label>Bed Number<input value={bedForm.bedNumber} onChange={e=>setBedForm({...bedForm,bedNumber:e.target.value})} required/></label><button className="primary-button">Create Bed</button></form></div>}
 <div className="panel"><h2>Wards</h2><div className="cards-grid">{wards.map(w=><div className="mini-card" key={w.id}><strong>{w.name}</strong><span>{w.wardType||"WARD"} · {w.floor||"—"}</span><b>{beds.filter(b=>b.wardId===w.id&&b.status==="OCCUPIED").length} occupied / {beds.filter(b=>b.wardId===w.id).length} beds</b></div>)}</div></div>
 <div className="panel"><h2>Bed Register</h2><div className="table-wrap"><table><thead><tr><th>Bed</th><th>Ward</th><th>Status</th></tr></thead><tbody>{beds.map(b=><tr key={b.id}><td><b>{b.bedNumber}</b></td><td>{b.ward?.name||wards.find(w=>w.id===b.wardId)?.name||b.wardId}</td><td><StatusBadge value={b.status}/></td></tr>)}</tbody></table></div></div>
 </div>
}
