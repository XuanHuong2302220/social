export const debounce = (func: Function, delay: number)=> {
    let timeout : ReturnType<typeof setTimeout> | null = null;

    return (...arg: any)=> {
        if(timeout){
            clearTimeout(timeout);
        }
        console.log('debounce')
        timeout = setTimeout(()=>func(...arg), delay)
    }
}