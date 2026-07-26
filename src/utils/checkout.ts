export async function triggerMidtransCheckout(
  items: any[], 
  totalPrice: number, 
  onComplete: () => void
) {
  try {
    const res = await fetch("/api/tokenizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, totalPrice }),
    });

    const data = await res.json();

    if (data.token && typeof window !== "undefined" && (window as any).snap) {
      (window as any).snap.pay(data.token, {
        onSuccess: function (result: any) {
          console.log("Midtrans Payment Success:", result);
          onComplete();
        },
        onPending: function (result: any) {
          console.log("Midtrans Payment Pending:", result);
          onComplete();
        },
        onError: function (result: any) {
          console.error("Midtrans Payment Error:", result);
          onComplete();
        },
        onClose: function () {
          console.log("Midtrans Snap closed by user");
          onComplete();
        },
      });
    } else {
      // Fallback redirection
      onComplete();
    }
  } catch (err) {
    console.error("Midtrans checkout error:", err);
    onComplete();
  }
}
