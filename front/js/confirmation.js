const getOrder = getOrderId();
displayOrderId(getOrderId());
clearLocalStorage();

function getOrderId() {
  const confirmationPage = window.location.search;
  const urlParams = new URLSearchParams(confirmationPage);
  return urlParams.get("orderId");
}

function displayOrderId(orderId) {
  const spanOderId = document.querySelector("#orderId");
  spanOderId.innerText = orderId;
}

function clearLocalStorage() {
    const localStorage = window.localStorage;
    localStorage.clear()
}
