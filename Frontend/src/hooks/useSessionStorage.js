// DATELE LOCALE(RAMAN PERMANENT STOCATE !!!)
// import { useState } from 'react';

// // Hook personalizat pentru localStorage
// const useLocalStorage = (key, initialValue) => {
//     const [storedValue, setStoredValue] = useState(() => {
//         try {
//             const item = window.localStorage.getItem(key);
//             return item ? JSON.parse(item) : initialValue;
//         } catch (error) {
//             console.error(error);
//             return initialValue;
//         }
//     });

//     const setValue = (value) => {
//         try {
//             const valueToStore = value instanceof Function ? value(storedValue) : value;
//             setStoredValue(valueToStore);
//             window.localStorage.setItem(key, JSON.stringify(valueToStore));
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     return [storedValue, setValue];
// };

// export default useLocalStorage;


import { useState } from 'react';

// Hook personalizat pentru sessionStorage
const useSessionStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export default useSessionStorage;
