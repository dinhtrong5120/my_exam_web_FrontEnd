const KEY='studyflow_token'
export const getToken=()=>localStorage.getItem(KEY)
export const setToken=v=>v?localStorage.setItem(KEY,v):localStorage.removeItem(KEY)
export const json=(method,body)=>({method,body:JSON.stringify(body)})
export async function api(path,options={}){const headers={...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...options.headers};if(getToken())headers.Authorization=`Token ${getToken()}`;const r=await fetch(`/api${path}`,{...options,headers});const d=r.status===204?null:await r.json().catch(()=>({}));if(!r.ok)throw Error(d?.detail||'Có lỗi xảy ra. Vui lòng thử lại.');return d}
