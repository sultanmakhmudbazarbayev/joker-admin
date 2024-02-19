import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchQuizData } from '@/application/actions/quiz';


const useFetchQuizData = (id) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndDispatchQuizData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Dispatch the Redux action to fetch quiz data
        await dispatch(fetchQuizData(id));
        setError(null); // Clear previous errors, if any
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        setError(error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchAndDispatchQuizData();
  }, [id, dispatch]);

  return { loading, error }; // Return loading and error states for consumer components to use
};

export default useFetchQuizData;
