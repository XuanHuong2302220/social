export const debounce = (func: Function, delay: number)=> {
    let timeout : ReturnType<typeof setTimeout> | null = null;

    return (...arg: any)=> {
        if(timeout){
            clearTimeout(timeout);
        }
        timeout = setTimeout(()=>func(...arg), delay)
    }
}