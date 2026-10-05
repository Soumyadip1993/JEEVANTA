import {useEffect,useState} from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import {errorMessage,listFrom} from "../utils/data";
import {useAuth} from "../context/AuthContext";

export default function Nurses(){
 const {user}=useAuth();const[rows,setRows]=useState([]),[form,setForm]=useState({userId:"",departmentId:""}),[show,setShow]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState("");
 const admin=user?.role==="ADMIN";
 const load=async()=>{try{const{data}=await api.get("/nurses");setRows(listFrom(data,["nurses"]))}catch(e){setError(errorMessage(e,"Unable to load nurses."))}};useEffect(()=>{load()},[]);
 const submit=async e=>{e.preventDefault();try{await api.post("/nurses",{userId:Number(form.userId),departmentId:form.departmentId?Number(form.departmentId):undefined});setSuccess("Nurse profile created.");setForm({userId:"",departmentId:""});setShow(false);load()}catch(e){setError(errorMessage(e,"Unable to create nurse profile."))}};
 return <div><PageHeader title="Nurses" subtitle="Nursing staff profiles and departments" action={admin&&<button className="primary-button" onClick={()=>setShow(true)}>+ Add Nurse</button>}/>{error&&<div className="alert error">{error}</div>}{success&&<div className="alert success">{success}</div>}
 {show&&<div className="panel"><form className="inline-form" onSubmit={submit}><label>User ID<input type="number" value={form.userId} onChange={e=>setForm({...form,userId:e.target.value})} required/></label><label>Department ID<input type="number" value={form.departmentId} onChange={e=>setForm({...form,departmentId:e.target.value})}/></label><button className="primary-button">Create</button></form></div>}
 <div className="panel"><div className="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th></tr></thead><tbody>{rows.map(n=><tr key={n.id}><td>#{n.id}</td><td>{n.user?.name||"—"}</td><td>{n.user?.email||"—"}</td><td>{n.department?.name||n.departmentId||"—"}</td></tr>)}</tbody></table></div></div></div>
}
