// import React from "react";
// import toast from "react-hot-toast";
// import { useCreatePaymentMutation } from "../../app/ApiSlice";

// const RAZORPAY_TEST_KEY = "rzp_test_1DP5mmOlF5G5ag";

// const RazorpayButton = ({ amount, submissionId, userId }) => {
//   const [createPayment] = useCreatePaymentMutation();

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async () => {
//     if (!userId) return toast.error("User not logged in");

//     const res = await loadRazorpayScript();
//     if (!res) {
//       toast.error("Razorpay SDK failed to load. Are you online?");
//       return;
//     }

//     const options = {
//       key: RAZORPAY_TEST_KEY,
//       amount: amount * 100,
//       currency: "INR",
//       name: "Exam Portal",
//       description: "Exam Form Payment",
//       handler: async (response) => {
//         try {
//           await createPayment({
//             SubmissionId: submissionId,
//             PaymentGateway: "Razorpay",
//             TransactionId: response.razorpay_payment_id,
//             PaymentMethod: "Online",
//             Amount: amount,
//             Status: "Success",
//             ReceiptUrl: "",
//           });

//           toast.success("Payment successful!");
//         } catch (err) {
//           console.error("Payment record failed:", err);
//           toast.error("Failed to record payment.");
//         }
//       },
//       prefill: {
//         name: localStorage.getItem("userName") || "",
//         email: localStorage.getItem("userEmail") || "",
//       },
//       theme: { color: "#2563eb" },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();

//     rzp.on("payment.failed", (response) => {
//       console.error("Payment failed:", response.error);
//       toast.error("Payment failed.");
//     });
//   };

//   return (
//     <button
//       onClick={handlePayment}
//       className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
//     >
//       Pay ₹{amount}
//     </button>
//   );
// };

// export default RazorpayButton;
import React from "react";
import toast from "react-hot-toast";
import { useCreatePaymentMutation } from "../../app/ApiSlice";

const RAZORPAY_TEST_KEY = "rzp_test_1DP5mmOlF5G5ag";

const RazorpayButton = ({ amount, submissionId, userId }) => {
  const [createPayment] = useCreatePaymentMutation();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!userId) return toast.error("User not logged in");

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: RAZORPAY_TEST_KEY,
      amount: amount * 100,
      currency: "INR",
      name: "Exam Portal",
      description: "Exam Form Payment",
      handler: async (response) => {
        try {
          await createPayment({
            SubmissionId: submissionId,
            PaymentGateway: "Razorpay",
            TransactionId: response.razorpay_payment_id,
            PaymentMethod: "Online",
            Amount: amount,
            Status: "Success",
            ReceiptUrl: "",
          }).unwrap();

          toast.success("Payment successful!");
        } catch (err) {
          console.error("Payment record failed:", err);
          toast.error("Failed to record payment.");
        }
      },
      prefill: {
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", (response) => {
      console.error("Payment failed:", response.error);
      toast.error("Payment failed.");
    });
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-2"
    >
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayButton;
