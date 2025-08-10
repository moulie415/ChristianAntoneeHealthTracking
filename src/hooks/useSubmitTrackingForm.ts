import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {submitTrackingForm, type FormDataType, type FormType} from '../api';
import { useNavigate } from 'react-router';

const useSubmitTrackingForm = (type: FormType, uid: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: ({type, data}: {type: FormType; data: FormDataType}) =>
      submitTrackingForm(type, data),
    onSuccess: () => {
      toast.success('Form submitted successfully');
      queryClient.invalidateQueries({
        queryKey: ['dailyEntry', type, uid],
      });
      navigate(`/history?type=${type}&success=true`)
    },
    onError: () => {
      toast.error(
        'Error submitting form, please make sure you have verified your email',
      );
    },
  });

  const submitForm = (data: FormDataType) => {
    mutation.mutate({type, data});
  };

  return {
    loading: mutation.isPending,
    submitForm,
  };
};

export default useSubmitTrackingForm;
