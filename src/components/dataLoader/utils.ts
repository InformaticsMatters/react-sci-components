import { FieldConfig } from './sources';

const getFieldsFromForm = (form: HTMLFormElement, fieldNames: string[]) => {
  let output: FieldConfig[] = [];
  fieldNames.forEach((name) => {
    const min = form?.[`${name}-min`]?.value;
    const max = form?.[`${name}-max`]?.value;
    const dtype = form?.[`${name}-dtype`]?.value;
    const isNumeric = dtype === 'int' || dtype === 'float';

    const enabled = form?.[`${name}-enabled`]?.checked;

    enabled &&
      output.push({
        name: name,
        nickname: form?.[`${name}-nickname`]?.value,
        dtype,
        min: isNumeric && min !== '' ? Number(min) : undefined,
        max: isNumeric && max !== '' ? Number(max) : undefined,
      });
  });

  return output;
};

export const getDataFromForm = (form: HTMLFormElement, fieldNames: string[]) => {
  const target = form as typeof form & { [key: string]: { value: string } };

  const maxRecords = Number(target.maxRecords.value);
  const configs = getFieldsFromForm(target, fieldNames);

  return { maxRecords, configs };
};
