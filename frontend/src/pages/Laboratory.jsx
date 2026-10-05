import {useEffect,useState} from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import {errorMessage,listFrom,formatDateTime} from "../utils/data";
import {useAuth} from "../context/AuthContext";

export default function Laboratory(){
 const {user}=useAuth();const[rows,setRows]=useState([]),[form,setForm]=useState({clinicalRecordId:"",testName:""}),[result,setResult]=useState({labTestId:"",result:"",remarks:""}),[error,setError]=useState(""),[success,setSuccess]=useState("");
 const canCreate=["ADMIN","DOCTOR"].includes(user?.role),canResult=["ADMIN","LAB_TECHNICIAN"].includes(user?.role);
 const load=async()=>{try{const{data}=await api.get("/lab/tests");setRows(listFrom(data,["labTests","tests"]))}catch(e){setError(errorMessage(e,"Unable to load laboratory tests."))}};useEffect(()=>{load()},[]);
 const create=async e=>{e.preventDefault();try{await api.post("/lab/tests",{clinicalRecordId:Number(form.clinicalRecordId),testName:form.testName});setSuccess("Lab test requested.");setForm({clinicalRecordId:"",testName:""});load()}catch(e){setError(errorMessage(e,"Unable to create lab test."))}};
 const status=async(id,s)=>{try{await api.patch(`/lab/tests/${id}/status`,{status:s});load()}catch(e){setError(errorMessage(e,"Unable to update test status."))}};
 const saveResult=async e=>{e.preventDefault();try{await api.post("/lab/results",{labTestId:Number(result.labTestId),result:result.result,remarks:result.remarks});setSuccess("Lab result saved.");setResult({labTestId:"",result:"",remarks:""});load()}catch(e){setError(errorMessage(e,"Unable to save result."))}};
 return <div><PageHeader title="Laboratory" subtitle="Test requests, status and results"/>{error&&<div className="alert error">{error}</div>}{success&&<div className="alert success">{success}</div>}
 <div className="two-col">
 {canCreate&&<form className="panel stack-form" onSubmit={create}><h2>Request Test</h2><label>Clinical Record ID<input type="number" value={form.clinicalRecordId} onChange={e=>setForm({...form,clinicalRecordId:e.target.value})} required/></label><label>Test Name<input value={form.testName} onChange={e=>setForm({...form,testName:e.target.value})} required/></label><button className="primary-button">Request Test</button></form>}
 {canResult&&<form className="panel stack-form" onSubmit={saveResult}><h2>Enter Result</h2><label>Lab Test ID<input type="number" value={result.labTestId} onChange={e=>setResult({...result,labTestId:e.target.value})} required/></label><label>Result<textarea value={result.result} onChange={e=>setResult({...result,result:e.target.value})}/></label><label>Remarks<textarea value={result.remarks} onChange={e=>setResult({...result,remarks:e.target.value})}/></label><button className="primary-button">Save Result</button></form>}
 </div>
 <div className="panel"><div className="table-wrap"><table><thead><tr><th>ID</th><th>Patient</th><th>Test</th><th>Status</th><th>Requested</th><th>Actions</th></tr></thead><tbody>{rows.map(t=><tr key={t.id}><td>#{t.id}</td><td>{t.clinicalRecord?.patient?.patientCode||t.clinicalRecordId}</td><td>{t.testName}</td><td><StatusBadge value={t.status}/></td><td>{formatDateTime(t.requestedAt)}</td><td className="actions">{t.status==="PENDING"&&canResult&&<button className="small-button" onClick={()=>status(t.id,"IN_PROGRESS")}>Start</button>}{t.status==="IN_PROGRESS"&&canResult&&<button className="small-button" onClick={()=>status(t.id,"COMPLETED")}>Complete</button>}</td></tr>)}</tbody></table></div></div></div>
}
