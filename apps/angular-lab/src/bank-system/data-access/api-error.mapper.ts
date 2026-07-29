import { BankingError } from '../state/banking.models';

export function mapApiError(error: unknown): BankingError {
  if (error instanceof Error) {
    return {
      title: 'Request failed',
      message: error.message,
      recoverable: true,
    };
  }

  return {
    title: 'Unknown status',
    message: 'The request result is unclear. Check request status instead of submitting again.',
    recoverable: true,
  };
}
