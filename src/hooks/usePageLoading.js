import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../store/loadingSlice';

// Custom hook to handle page loading state
export const usePageLoading = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Show loading when component mounts
        dispatch(setLoading(true));

        // Hide loading after spinner completes one full rotation (1200ms)
        const timer = setTimeout(() => {
            dispatch(setLoading(false));
        }, 1200);

        // Cleanup
        return () => {
            clearTimeout(timer);
            dispatch(setLoading(false));
        };
    }, [dispatch]);
};
