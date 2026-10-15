import React from 'react';

const InputField = React.forwardRef(({ label, type, name, placeholder, error, ...remain }, ref) => {
    
    
    return (
        <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor={name}>{label}</label>
            <input
                id={name}
                ref={ref}
                type={type}
                name={name}
                placeholder={placeholder}
                autoComplete="off"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white"
                {...remain}
            />
            {error && (
                <p className="font-semibold text-red-500 text-sm">
                    Error: {error}
                </p>
            )}
        </div>
    )
})

export default InputField;