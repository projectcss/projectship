import { useEffect, RefObject } from 'react'

function useClickOutside(ref:RefObject<HTMLElement>, hander:Function) {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if(!ref.current || ref.current.contains(event.target as HTMLElement)){
                return ;
            }
            hander()
        }
        document.addEventListener('click', listener);
        return () => {
            document.removeEventListener('click', listener);
        }
    }, [ref, hander])
}

export default useClickOutside;