//Pictures
export const API_TIMEOUT = 120000;
export const URL_QUOTES =
  "https://api.quotable.io/quotes/random?limit=3&maxLength=60&tags=famous-quotes/";

export const URL_PICTURES = "https://api.unsplash.com/photos/random?query=galaxy&count=3";
export const HEADER_PICTURES = {
  Authorization: "Client-ID 9wRLI-vqDZFP7_U0ff0mqislkT5enaru6oL51TLlmvA",
};

//Midtrans
export const URL_MIDTRANS = "https://app.sandbox.midtrans.com/snap/v1/";
export const URL_MIDTRANS_STATUS = "https://api.sandbox.midtrans.com/v2/";

export const HEADER_MIDTRANS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Basic U0ItTWlkLXNlcnZlci1MQ1Q1bTNSWWdpX2RCUjZlcHk2dFV6Q0g=",
};
