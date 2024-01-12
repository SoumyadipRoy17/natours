import axios from 'axios';
import { showAlert } from './alerts';
const Stripe = require('stripe');
export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51OWiRkSC4ZiPu2ZLdBeqDgkxtzRKb9eHpg06eLE1yS05WGjOGrDcE5vvlu5aztVi3SQ1w8YLANLJeSLcPWDoXOP900S9tvW00f'
    );
    //1) Get the checkout session from the server
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    //2) Create checkout form + charge credit card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
    if (session) window.location.href = session.data.session.url;
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
