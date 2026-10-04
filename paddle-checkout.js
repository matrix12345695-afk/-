(()=>{
  const PADDLE_PRICE_ID='pri_01m43v8rae0ka8xh1p8y43g01c';
  const button=document.getElementById('paddleCheckout');
  const status=document.getElementById('paddleStatus');
  if(!button)return;

  const t=(key,fallback)=>{
    const i18n=window.invoiceGuardI18n;
    const lang=i18n?.lang||'en';
    return i18n?.dict?.[lang]?.[key]||i18n?.dict?.en?.[key]||fallback;
  };

  button.addEventListener('click',()=>{
    if(!window.Paddle){
      if(status)status.textContent=t('proCheckoutUnavailable','Checkout could not load. Please try again.');
      return;
    }
    if(!window.INVOICEGUARD_PADDLE_CLIENT_TOKEN){
      if(status)status.textContent=t('proCheckoutNeedsToken','Sandbox checkout is prepared. A Paddle client-side token is still required to open it.');
      return;
    }
    try{
      if(!window.__invoiceGuardPaddleInitialized){
        window.Paddle.Environment.set('sandbox');
        window.Paddle.Initialize({token:window.INVOICEGUARD_PADDLE_CLIENT_TOKEN});
        window.__invoiceGuardPaddleInitialized=true;
      }
      window.Paddle.Checkout.open({items:[{priceId:PADDLE_PRICE_ID,quantity:1}]});
    }catch(error){
      console.error('InvoiceGuard Paddle sandbox checkout error',error);
      if(status)status.textContent=t('proCheckoutUnavailable','Checkout could not load. Please try again.');
    }
  });
})();
