import { useState, useEffect } from "react"

/**
 * Custom hook debounce - trì hoãn cập nhật giá trị
 * @param {any} value - giá trị cần debounce
 * @param {number} delay - thời gian delay (ms), mặc định 500ms
 * @returns giá trị sau khi đã debounce
 */
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        // Đặt timer: sau `delay` ms mới cập nhật giá trị
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Cleanup: nếu `value` thay đổi trước khi hết `delay`
        // → hủy timer cũ, tạo timer mới
        return () => clearTimeout(timer)
    }, [value, delay])

    return debouncedValue
}