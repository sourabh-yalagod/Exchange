export function throttle(func:()=>void, limit:number) {
    let lastExecTime:any = null;
    return ()=>{
        if(lastExecTime)return
        lastExecTime = setTimeout(()=>{
            lastExecTime=null;
            func()
        },limit)
    }
     
}
