import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = 'text',
    className = '',
    errorMessage,
    ...props
}, ref)
{
    const id = useId()
    return (
        <div className='w-full relative'>
            {
            label && <label className="block text-sm font-medium mb-1" htmlFor={id}>{label}
            </label>
            }
            <input
                type={type}
                className={`w-full text-sm bg-custom-gray px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500 ${errorMessage ? 'border-red-500' : ''}`}    
                ref={ref} // it will give ref to its parent component ref will pass from parent component and take access of state from here 
                {...props}
                id={id}
            />
            {errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}
        
            </div>
    )
}) 

export default Input
