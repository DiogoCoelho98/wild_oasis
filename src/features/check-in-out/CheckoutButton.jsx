import { useCheckout } from './useCheckout';
import Button from 'ui/Button';

export default function CheckoutButton({ bookingId }) {
  const { isLoading, mutate: checkout } = useCheckout();

  return (
    <Button
      variation='primary'
      size='small'
      onClick={() => checkout(bookingId)}
      disabled={isLoading}>
        Check out
    </Button>
  );
}