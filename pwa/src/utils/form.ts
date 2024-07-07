import { SymfonyValidationFailedResponse } from '#/components/types';
import { MultipleFieldErrors } from 'react-hook-form/dist/types/errors';
import { UseFormSetError } from 'react-hook-form';

export function setErrorFromSymfonyViolations(setError: UseFormSetError<any>, violations: SymfonyValidationFailedResponse['violations'] | undefined) {
  let violationsByPropertyPath: Record<string, (Omit<SymfonyValidationFailedResponse['violations'][number], 'propertyPath'>)[]> = {};
  for (const violation of violations || []) {
    if (!violationsByPropertyPath[violation.propertyPath]) {
      violationsByPropertyPath[violation.propertyPath] = [];
    }
    const { propertyPath, ...violationWithoutPropertyPath } = violation;
    violationsByPropertyPath[violation.propertyPath].push(violationWithoutPropertyPath);
  }

  for (const [propertyPath, violations] of Object.entries(violationsByPropertyPath)) {
    setError(propertyPath, {
      type: 'server',
      message: violations.map(violation => violation.title).join(', '),
      types: violations.reduce((acc, violation) => ({ ...acc, [violation.type]: violation.title }), {} satisfies MultipleFieldErrors),
    });
  }
}
