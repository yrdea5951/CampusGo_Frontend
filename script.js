const serviceSelect = document.querySelector("#serviceType");
const serviceCards = document.querySelectorAll(".service-card");
const timeSlots = document.querySelectorAll(".time-slot");
const form = document.querySelector("#bookingForm");
const message = document.querySelector("#formMessage");
let selectedTime = "٧:٠٠ مساءً";

const serviceNames = {
  printing: "طباعة مستندات",
  group: "حجز جماعي",
  studio: "خدمات الاستوديو",
  delivery: "توصيل الطلبات"
};

serviceCards.forEach(card => {
  card.addEventListener("click", () => {
    serviceCards.forEach(item => item.classList.remove("chosen"));
    card.classList.add("chosen");
    serviceSelect.value = card.dataset.service;
    document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

serviceSelect.addEventListener("change", () => {
  serviceCards.forEach(card => {
    card.classList.toggle("chosen", card.dataset.service === serviceSelect.value);
  });
});

timeSlots.forEach(slot => {
  slot.addEventListener("click", () => {
    timeSlots.forEach(item => item.classList.remove("active"));
    slot.classList.add("active");
    selectedTime = slot.dataset.time;
  });
});

form.addEventListener("submit", event => {
  event.preventDefault();
  message.className = "form-message";

  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const order = {
    studentName: data.get("studentName").trim(),
    phone: data.get("phone").trim(),
    university: data.get("university"),
    faculty: data.get("faculty").trim(),
    service: serviceNames[data.get("serviceType")],
    details: data.get("details").trim(),
    address: data.get("address").trim(),
    appointment: selectedTime,
    fulfillment: data.get("fulfillment"),
    payment: data.get("payment")
  };

  // Demo only: stores the sample order in this browser. No real booking/payment is made.
  const previousOrders = JSON.parse(localStorage.getItem("campusgo_demo_orders") || "[]");
  previousOrders.push({ ...order, createdAt: new Date().toISOString(), demo: true });
  localStorage.setItem("campusgo_demo_orders", JSON.stringify(previousOrders));

  message.className = "form-message show success";
  message.innerHTML = `<strong>تم تجهيز نموذج الطلب بنجاح!</strong><br>
    الاسم: ${escapeHtml(order.studentName)}<br>
    الجامعة: ${escapeHtml(order.university)} — ${escapeHtml(order.faculty)}<br>
    الخدمة: ${escapeHtml(order.service)}<br>
    الميعاد: ${escapeHtml(order.appointment)}<br>
    الاستلام: ${escapeHtml(order.fulfillment)}<br>
    الدفع المختار: ${escapeHtml(order.payment)}<br>
    <small>هذا تأكيد تجريبي داخل المتصفح فقط، ولم يتم إرسال الطلب إلى مكتب أو تنفيذ أي دفع.</small>`;
  message.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}
