import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {submitTrackingForm, type FormDataType, type FormType} from '../api';

const useSubmitTrackingForm = (type: FormType, uid: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({type, data}: {type: FormType; data: FormDataType}) =>
      submitTrackingForm(type, data),
    onSuccess: () => {
      toast.success('Form submitted successfully');
      queryClient.invalidateQueries({
        queryKey: ['dailyEntries', type, uid],
      });
    },
    onError: () => {
      toast.error('Error submitting form');
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
