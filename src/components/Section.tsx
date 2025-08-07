import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';

type Option = {
  label: string;
  value: string | boolean;
};

type SectionProps = {
  title: string;
  name: string;
  radioOptions: Option[];
  control: any;
  disabled?: boolean;
};

export function Section({
  title,
  name,
  radioOptions,
  control,
  disabled,
}: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <FormLabel>{title}</FormLabel>
      </CardHeader>
      <CardContent className="space-y-2">
        <FormField
          control={control}
          name={name}
          render={({field}) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  disabled={disabled}
                  onValueChange={val => {
                    const value =
                      val === 'true' ? true : val === 'false' ? false : val;
                    field.onChange(value);
                  }}
                  value={String(field.value)}
                  className="space-y-2">
                  {radioOptions.map(opt => (
                    <FormItem
                      key={String(opt.value)}
                      className="flex items-center gap-3">
                      <RadioGroupItem value={String(opt.value)} />
                      <Label htmlFor={String(opt.value)}>{opt.label}</Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
